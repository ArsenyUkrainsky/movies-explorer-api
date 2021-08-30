const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // Для создания токенов
const User = require('../models/user');
const BadRequest400 = require('../errors/badRequest400');
const Unauthorized401 = require('../errors/unauthorized401');
const NotFound404 = require('../errors/notFound404');
const Conflict409 = require('../errors/conflict409');

const { JWT_SECRET = 'secret-dev-key' } = process.env;

module.exports.updateProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, email },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!user) {
      throw new NotFound404('Пользователь по указанному _id не найден.');
    }
    res.send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequest400('Переданы некорректные данные при обновлении профиля.'));
    } else if (err.name === 'CastError') {
      next(new BadRequest400('Был передан невалидный идентификатор _id.'));
    } else if (err.code === 11000) {
      next(new Conflict409('Пользователь с таким Email уже зарегистрирован.'));
    } else {
      next(err);
    }
  }
};

// контроллер аутентификации
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    next(new BadRequest400('Email или пароль отсутствует.'));
  }
  // Проверим, есть ли пользователь в базе
  return User.findOne({ email }).select('+password')
    .orFail(() => {
      throw new Unauthorized401('Email или пароль некорректный.');
    })
    .then((user) => {
      // пользователь найден
      // проверка пароля
      bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new Unauthorized401('Email или пароль некорректный.');
          }
          // метод jwt.sign, чтобы создать токен
          const token = jwt.sign({
            id: user._id,
          }, JWT_SECRET, { expiresIn: '7d' });
          return res.send({ token });
        })
        .catch(next);
    })
    .catch(next);
};

// Регистрация нового пользователя
module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body; // Данные всех полей - в теле запроса.
  if (!email || !password) {
    throw new BadRequest400('Email или пароль отсутствует.');
  }
  return User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new Conflict409('Пользователь с таким Email уже зарегистрирован.');
      }
      // Хеширование пароля
      return bcrypt.hash(password, 10)
        .then((hash) => {
          User.create({
            name, email, password: hash, // +записываем хеш в базу
          })
            .then(({ _id }) => res.send({ _id, email }))
            .catch(() => {
              next(new BadRequest400('Недопустимый адрес email'));
            });
        });
    })
    .catch(next);
};

// контроллер для получения информации о пользователе
module.exports.getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.send(user);
  } catch (e) {
    next(new NotFound404('Пользователь не найден'));
  }
};
