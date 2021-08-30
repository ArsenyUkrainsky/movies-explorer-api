const mongoose = require('mongoose');
const validator = require('validator'); // Для валидации воспользуйтесь модулем validator, npm i validator.

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: [2, 'минимальная длина имени — 2 символа'],
      maxlength: [30, 'максимальная длина 30 символов'],
    },
    email: {
      type: String,
      required: true,
      unique: true, // email должен быть уникальным.
      validate: { // опишем свойство validate.
        validator(email) { // validator - функция проверки данных.
          return validator.isEmail(email);
        },
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  { versionKey: false },
);
module.exports = mongoose.model('user', userSchema);
