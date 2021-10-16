const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const validator = require('validator');

const validationMethod = (data) => {
  const expLink = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gm;
  if (validator.isURL(data) && expLink.test(data)) {
    return data;
  }
  throw new Error('URL - адрес введен неправильно');
};

const {
  getMovies,
  addMovie,
  deleteMovie,
} = require('../controllers/movies');

router.get('/movies', getMovies);

router.post('/movies', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    image: Joi.string().required().custom(validationMethod),
    trailer: Joi.string().required().custom(validationMethod),
    thumbnail: Joi.string().required().custom(validationMethod),
    movieId: Joi.number().required(),
  }),
}), addMovie);

router.delete('/movies/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.required(),
  }),
}), deleteMovie);

module.exports = router;
