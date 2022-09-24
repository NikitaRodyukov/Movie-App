/* eslint-disable camelcase */
import { Component } from 'react'
import { Spin, Alert } from 'antd'

import SwapiService from '../swapi-service/swapi-service'
import MovieCard from '../movie-card/movie-card'

import './movies.css'

export default class Movies extends Component {
  swapiService = new SwapiService()

  constructor() {
    super()
    this.getMoviesInfo()
  }

  state = {
    movies: [],
    isLoading: true,
    error: false,
  }

  onError = () => {
    this.setState({
      error: true,
      isLoading: false,
    })
  }

  getMoviesInfo = () => {
    this.swapiService
      .getAllMovies()
      .then((moviesList) => {
        this.setState({
          movies: moviesList,
          isLoading: false,
        })
      })
      .catch(this.onError)
  }

  render() {
    const { movies, isLoading, error } = this.state
    const loadSpinner = isLoading && <Spin />
    const errorDownload = error && <Alert message="Ошибка загрузки. Попробуйте перезагрузить страницу" type="error" />

    const content = movies.map((movieInfo) => {
      const { id, original_title, release_date, backdrop_path, overview } = movieInfo
      return (
        <MovieCard key={id} name={original_title} date={release_date} imgLink={backdrop_path} overview={overview} />
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
