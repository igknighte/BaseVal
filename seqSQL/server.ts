import { createServer } from 'http';
import dotenv from 'dotenv';
import app from './app';
import sequelize from './config/database';

dotenv.config({ path: './config.env' });

const port = process.env.PORT || 3000;
const server = createServer(app);

process.on('uncaughtException', (err: Error) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('DB connection successful!');
    await sequelize.sync();
    server.listen(port, () => {
      console.log(`App running on port ${port}...`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

startServer();

process.on('unhandledRejection', (err: any) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
