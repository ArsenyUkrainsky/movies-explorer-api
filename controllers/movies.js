const Movie = require('../models/movie');
const BadRequest400 = require('../errors/badRequest400');
const Forbidden403 = require('../errors/forbidden403');
const NotFound404 = require('../errors/notFound404');

module.exports.getMovies = async (req, res, next) => {
  try {
    const movies = await Movie.find({});
    res.send({ movies });
  } catch (e) { next(); }
};

module.exports.addMovie = async (req, res, next) => {
  try {
    const {
      country,
      director,
      duration,
      year,
      description,
      image,
      trailer,
      nameRU,
      nameEN,
      thumbnail,
      movieId = res._id,
      owner = req.user.id,
    } = req.body;
    const movie = await Movie.create({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailer,
      nameRU,
      nameEN,
      thumbnail,
      movieId,
      owner,
    });
    res.send({ movie });
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequest400('Переданы некорректные данные при создании фильма.'));
    } else next(err);
  }
};

module.exports.deleteMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.movieId);
    if (!movie) {
      throw new NotFound404('Фильм с указанным _id не найден.');
    } else if (movie.owner.toString() === req.user.id) {
      // movie найден
      // проверим кто создал, строгое сравнение и по типу данных
      try {
        await Movie.findByIdAndDelete(req.params.movieId);
        res.send({ movie });
      } catch (e) { next(e); } // необходимо обязательно передать в next объект ошибки
    } else throw new Forbidden403('Нельзя удалить чужой фильм.');
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequest400('Был передан невалидный идентификатор _id.'));
    } else next(err);
  }
};
