//npm install @types/node @types/express @types/jsonwebtoken @types/cookie-parser
import crypto from 'crypto';
import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import User from '../models/userModel';
import AppError from '../utils/appError';
import catchAsync from '../utils/catchAsync';
import Email from '../utils/email';

const signToken = (id: string): string =>
  jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendToken = (user: any, statusCode: number, res: Response): void => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + parseInt(process.env.JWT_COOKIE_EXPIRES_IN as string, 10) * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

export const signup = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const url = `${req.protocol}://${req.get('host')}/me`;
  await new Email(newUser, url).sendWelcome();

  createSendToken(newUser, 201, res);
});

export const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  createSendToken(user, 201, res);
});

export const protect = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  let token: string | undefined;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(new AppError('You are not logged in to get access', 401));
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET as string) as { id: string, iat: number };

  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(new AppError('The user belonging to this token does not exist', 401));
  }

  if (freshUser.changedPasswordAfter(decoded.iat)) {
    return next(new AppError('User recently changed password! Please log in again.', 401));
  }

  req.user = freshUser;
  res.locals.user = freshUser;
  next();
});

export const isLoggedIn = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (req.cookies.jwt) {
    try {
      const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET as string) as { id: string, iat: number };

      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
});

export const logout = (req: Request, res: Response): void => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
};

export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have the permission to perform this action', 403));
    }
    next();
  };
};

export const forgotPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with email address', 404));
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  try {
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
    await new Email(user, resetURL).sendPasswordReset();
    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new AppError('There was an error sending the email. Try again later', 500));
  }
});

export const resetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  createSendToken(user, 201, res);
});

export const updatePassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const user = await User.findById(req.user.id).select('+password');

  if (!user || !(await user.correctPassword(req.body.currentPassword, user.password))) {
    return next(new AppError('Your current password is wrong', 401));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  createSendToken(user, 201, res);
});
