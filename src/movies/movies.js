/* eslint-disable camelcase */
import { Component } from 'react'

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
    movies: null,
  }

  getMoviesInfo() {
    this.swapiService.getAllMovies().then((results) => {
      this.setState({
        movies: results,
      })
    })
  }

  render() {
    const { movies } = this.state
    if (movies === null) return null
    const films = movies.map((movieInfo) => {
      const { id, original_title, release_date, backdrop_path, overview } = movieInfo
      return (
        <MovieCard key={id} name={original_title} date={release_date} imgLink={backdrop_path} overview={overview} />
      )
    })
    return <ul className="movies">{films}</ul>
  }
}
