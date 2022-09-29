import { Alert, Spin } from 'antd'
import PropTypes from 'prop-types'

import MovieCard from '../movie-card/movie-card'

import './movies.css'

export default function Movies({
  movies,
  noFilmsFound,
  allGenres,
  guestSessionId,
  addRatedMovie,
  movieRates,
  isLoading,
}) {
  const noFilmsMessage = noFilmsFound && (
    <Alert message="No films found for this query. Try something else" type="error" />
  )

  const loadingSpin = isLoading && <Spin />

  const content = movies.map((movieInfo) => {
    const {
      id,
      original_title: titleName,
      release_date: date,
      poster_path: imgLink,
      overview,
      genre_ids: FilmGenreIds,
      vote_average: voteAverage,
    } = movieInfo

    //  смотрим был ли фильм уже оценен в этой сессии, если да, то добавляем значение в аккумулятор, если нет, то просто прибавляем 0
    const rateValue = movieRates.reduce((acc, { id: filmId, rate }) => (filmId === id ? (acc += rate) : (acc += 0)), 0)

    return (
      <MovieCard
        key={id}
        id={id}
        titleName={titleName}
        date={date}
        imgLink={imgLink}
        overview={overview}
        allGenres={allGenres}
        FilmGenreIds={FilmGenreIds}
        voteAverage={voteAverage}
        guestSessionId={guestSessionId}
        addRatedMovie={addRatedMovie}
        rateValue={rateValue}
      />
    )
  })

  return (
    <ul className="movies">
      {loadingSpin}
      {noFilmsMessage}
      {content}
    </ul>
  )
}

Movies.defaultProps = {
  movies: [],
  noFilmsFound: false,
  allGenres: [],
  guestSessionId: '',
  addRatedMovie: () => {},
  movieRates: [],
  isLoading: false,
}

MovieCard.propTypes = {
  movies: PropTypes.oneOfType([PropTypes.object]),
  noFilmsFound: PropTypes.bool,
  allGenres: PropTypes.oneOfType([PropTypes.object]),
  guestSessionId: PropTypes.string,
  addRatedMovie: PropTypes.func,
  movieRates: PropTypes.oneOfType([PropTypes.object]),
  isLoading: PropTypes.bool,
}
