// Все роуты подключены в файле index.js, который находится в папке routes.
const router = require('express').Router();
const NotFound404 = require('../errors/notFound404');
const usersRouter = require('./users');
const cardsRouter = require('./movies');

router.use('/', usersRouter);
router.use('/', cardsRouter);
router.use('*', (req, res, next) => { next(new NotFound404('Запрашиваемый ресурс не найден')); });
module.exports = router;
