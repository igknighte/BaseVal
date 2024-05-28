import { DataTypes, Model } from 'sequelize';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import sequelize from '../config/database';

interface UserAttributes {
  id?: number;
  name: string;
  email: string;
  photo?: string;
  role?: string;
  password: string;
  passwordConfirm?: string;
  passwordChangedAt?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  active?: boolean;
}

class User extends Model<UserAttributes> implements UserAttributes {
  public id!: number;
  public name!: string;
  public email!: string;
  public photo?: string;
  public role?: string;
  public password!: string;
  public passwordConfirm?: string;
  public passwordChangedAt?: Date;
  public passwordResetToken?: string;
  public passwordResetExpires?: Date;
  public active?: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public correctPassword = async function (candidatePassword: string, userPassword: string): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, userPassword);
  };

  public changedPasswordAfter = function (JWTTimestamp: number): boolean {
    if (this.passwordChangedAt) {
      const changedTimestamp = parseInt((this.passwordChangedAt.getTime() / 1000).toString(), 10);
      return JWTTimestamp < changedTimestamp;
    }
    return false;
  };

  public createPasswordResetToken = function (): string {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
    return resetToken;
  };
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Please tell us your name!',
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: 'Please provide a valid email',
        },
        notEmpty: {
          msg: 'Please provide your email',
        },
      },
    },
    photo: {
      type: DataTypes.STRING,
      defaultValue: 'default.jpg',
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: 'user',
      validate: {
        isIn: {
          args: [['user', 'guide', 'lead-guide', 'admin']],
          msg: 'Invalid role',
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [8, undefined],
          msg: 'Password must be at least 8 characters long',
        },
      },
    },
    passwordConfirm: {
      type: DataTypes.VIRTUAL,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Please confirm your password',
        },
        isMatch(value: string) {
          if (value !== this.password) {
            throw new Error('Passwords are not the same!');
          }
        },
      },
    },
    passwordChangedAt: {
      type: DataTypes.DATE,
    },
    passwordResetToken: {
      type: DataTypes.STRING,
    },
    passwordResetExpires: {
      type: DataTypes.DATE,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      validate: {
        notEmpty: {
          msg: 'Active field cannot be empty',
        },
      },
    },
  },
  {
    sequelize,
    tableName: 'users',
    hooks: {
      beforeSave: async (user: User) => {
        if (user.changed('password')) {
          user.password = await bcrypt.hash(user.password, 12);
          user.passwordConfirm = undefined;
        }
        if (user.isNewRecord || user.changed('password')) {
          user.passwordChangedAt = new Date(Date.now() - 1000);
        }
      },
      beforeFind: (options) => {
        if (!options.where) options.where = {};
        options.where.active = { [Op.ne]: false };
      },
    },
  },
);

export default User;
