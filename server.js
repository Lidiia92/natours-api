const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', err => {
  console.log(err);
  console.log('Uncaught Exception');
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

const app = require('./index');

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => {
    console.log('DB connected');
  });

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});

process.on('unhandledRejection', err => {
  console.log(err);
  console.log('Unhandled Rejection');
  server.close(() => {
    process.exit(1);
  });
});
