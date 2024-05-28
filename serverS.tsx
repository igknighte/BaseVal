import dotenv from 'dotenv';
import { ConnectionPool } from 'mssql';

dotenv.config({ path: './config.env' });

import app from './app';

process.on('uncaughtException', (err: Error) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER!,
  database: process.env.DB_NAME,
  options: {
    encrypt: true, // for azure
    trustServerCertificate: true, // change to true for local dev / self-signed certs
  },
};

const pool = new ConnectionPool(config);

pool.connect()
  .then(() => {
    console.log('DB connection successful!');
    const port = process.env.PORT || 3000;
    const server = app.listen(port, () => {
      console.log(`App running on port ${port}...`);
    });

    process.on('unhandledRejection', (err: any) => {
      console.error('UNHANDLED REJECTION! 💥 Shutting down...');
      console.error(err.name, err.message);
      server.close(() => {
        process.exit(1);
      });
    });
  })
  .catch(err => {
    console.error('DB connection failed:', err.message);
    process.exit(1);
  });
