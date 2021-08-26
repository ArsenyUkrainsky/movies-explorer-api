const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getCurrentUser,
  createUser,
  login,
  updateProfile,
} = require('../controllers/users');

const auth = require('../middlewares/auth');

// роуты, не требующие авторизации
router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().min(3),
    password: Joi.string().required(),
    name: Joi.string().required().min(2),
  }).unknown(true),
}), createUser);

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().min(3),
    password: Joi.string().required(),
  }),
}), login);

router.use(auth);

// роуты, которым авторизация нужна (и далее в movies)
router.get('/users/me', getCurrentUser); // роут для получения информации о пользователе
router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().min(3),
  }).unknown(true),
}), updateProfile); // обновляет информацию о пользователе (email и имя)

module.exports = router;
