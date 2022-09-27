/* eslint-disable camelcase */
import { Component } from 'react'
import { Spin, Alert } from 'antd'

import MovieCard from '../movie-card/movie-card'

import './movies.css'

export default class Movies extends Component {
  componentDidMount() {}

  render() {
    const { movies, isLoading, error, allGenres } = this.props
    const loadSpinner = isLoading && <Spin />
    const errorDownload = error && <Alert message="Ошибка загрузки. Попробуйте перезагрузить страницу" type="error" />

    const content = movies.map((movieInfo) => {
      const { id, original_title, release_date, poster_path, overview, genre_ids, vote_average } = movieInfo
      return (
        <MovieCard
          key={id}
          titleName={original_title}
          date={release_date}
          imgLink={poster_path}
          overview={overview}
          allGenres={allGenres}
          genreIds={genre_ids}
          voteAverage={vote_average}
        />
      )
    })

    return (
      <ul className="movies">
        {loadSpinner}
        {errorDownload}
        {content}
      </ul>
    )
  }
}
