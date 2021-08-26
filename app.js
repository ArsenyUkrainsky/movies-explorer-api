const express = require('express');
const app = express();
const bodyParser = require('body-parser');
require('dotenv').config();
const mongoose = require('mongoose');
const { DB = 'mongodb://localhost:27017/bitfilmsdb' } = process.env;
mongoose.connect(DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});
const helmet = require('helmet'); // защитить приложение от некоторых широко известных веб-уязвимостей
const { errors } = require('celebrate');
const limiter = require('./middlewares/rateLimiter');
const corsHandler = require('./middlewares/corsHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const router = require('./routes/index');
const errorHandler = require('./middlewares/errorHandler');
const { PORT = 3000 } = process.env;

app.use(requestLogger); // подключаем логгер запросов
app.use(helmet());
app.use(limiter);
app.use(bodyParser.json());
app.use(corsHandler);
app.use(router);
app.use(errorLogger); // подключаем логгер ошибок
// обработчики ошибок
app.use(errors()); // обработчик ошибок celebrate
app.use(errorHandler); // Централизованная обработка ошибок

app.listen(PORT, () => {
  console.log(`Приложение запущено на ${PORT} порту`);
});
