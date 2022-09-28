/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
/* eslint-disable camelcase */
import { Component } from 'react'
import { Alert } from 'antd'

import MovieCard from '../movie-card/movie-card'

import './movies.css'

export default class Movies extends Component {
  componentDidMount() {}

  render() {
    const { movies, error, allGenres, guestSessionId, addRatedMovie, movieRates } = this.props

    const errorDownload = error && <Alert message="Ошибка загрузки. Попробуйте перезагрузить страницу" type="error" />

    const content = movies.map((movieInfo) => {
      const { id, original_title, release_date, poster_path, overview, genre_ids, vote_average } = movieInfo

      const rateValue = movieRates.reduce(
        (acc, { id: filmId, rate }) => (filmId === id ? (acc += rate) : (acc += 0)),
        0
      )

      return (
        <MovieCard
          key={id}
          id={id}
          titleName={original_title}
          date={release_date}
          imgLink={poster_path}
          overview={overview}
          allGenres={allGenres}
          FilmGenreIds={genre_ids}
          voteAverage={vote_average}
          guestSessionId={guestSessionId}
          addRatedMovie={addRatedMovie}
          rateValue={rateValue}
        />
      )
    })

    return (
      <ul className="movies">
        {errorDownload}
        {content}
      </ul>
    )
  }
}
