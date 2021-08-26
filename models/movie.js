const mongoose = require('mongoose');
const expLink = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/m;
const movieSchema = new mongoose.Schema(
  {
    country: {
      type: String,
      required: [
        true,
        'страна создания фильма. Обязательное поле-строка.',
      ],
    },
    director: {
      type: String,
      required: [
        true,
        'режиссёр фильма. Обязательное поле-строка.',
      ],
    },
    duration: {
      type: Number,
      required: [
        true,
        'длительность фильма. Обязательное поле-число.',
      ],
    },
    year: {
      type: String,
      required: [
        true,
        'год выпуска фильма. Обязательное поле-строка.',
      ],
    },
    description: {
      type: String,
      required: [
        true,
        'описание фильма. Обязательное поле-строка.',
      ],
    },
    nameRU: {
      type: String,
      required: [
        true,
        'название фильма на русском языке',
      ],
    },
    nameEN: {
      type: String,
      required: [
        true,
        'название фильма на английском языке',
      ],
    },
    image: {
      type: String,
      validate: {
        validator(link) {
          return expLink.test(link);
        },
      },
      required: [
        true,
        'ссылка на постер к фильму',
      ],
    },
    trailer: {
      type: String,
      validate: {
        validator(link) {
          return expLink.test(link);
        },
      },
      required: [
        true,
        'ссылка на трейлер фильма',
      ],
    },
    thumbnail: {
      type: String,
      validate: {
        validator(link) {
          return expLink.test(link);
        },
      },
      required: [
        true,
        'миниатюрное изображение постера к фильму',
      ],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, '_id пользователя, который сохранил фильм'],
    },
    movieId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'id фильма, который содержится в ответе сервиса MoviesExplorer'],
    },
  },
  { versionKey: false },
);
module.exports = mongoose.model('movie', movieSchema);
