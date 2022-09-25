/* eslint-disable camelcase */
import { Component } from 'react'
import { Spin, Alert } from 'antd'

import MovieCard from '../movie-card/movie-card'

import './movies.css'

export default class Movies extends Component {
  componentDidMount() {}

  render() {
    const { movies, isLoading, error } = this.props
    const loadSpinner = isLoading && <Spin />
    const errorDownload = error && <Alert message="Ошибка загрузки. Попробуйте перезагрузить страницу" type="error" />

    const content = movies.map((movieInfo) => {
      const { id, original_title, release_date, poster_path, overview } = movieInfo
      return <MovieCard key={id} name={original_title} date={release_date} imgLink={poster_path} overview={overview} />
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
