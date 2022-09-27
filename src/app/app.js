/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-unused-state */
/* eslint-disable camelcase */
import { Component } from 'react'
import { Pagination } from 'antd'
import { debounce } from 'lodash'

import MovapiService from '../movapi-service/movapi-service'
import Movies from '../movies/movies'
import './app.css'

export default class App extends Component {
  movapiService = new MovapiService()

  state = {
    searchValue: null,
    movies: [],
    totalResults: 0,
    currentPage: 1,
    isLoading: false,
    error: false,
    guestSessionId: '',
    allGenres: [],
  }

  updateSearchValue = debounce((value) => {
    this.setState({
      searchValue: value,
    })
  }, 500)

  componentDidMount() {
    this.movapiService.createNewGuestSession().then((guestSessionId) =>
      this.setState({
        guestSessionId,
      })
    )

    this.movapiService.getMoviesGenres().then((allGenres) =>
      this.setState({
        allGenres,
      })
    )
  }

  componentDidUpdate(prevprops, prevState) {
    const { searchValue, currentPage } = this.state

    if (searchValue !== prevState.searchValue || currentPage !== prevState.currentPage) {
      this.updateMovieList()
    }
  }

  updateMovieList = () => {
    const { searchValue, currentPage } = this.state
    if (!searchValue) {
      return
    }

    this.setState({
      isLoading: true,
      error: false,
    })

    this.movapiService
      .getMovieList(searchValue, currentPage)
      .then((answer) => {
        const { results, total_results } = answer

        if (!results.length) {
          this.setState({
            error: true,
          })
        }

        this.setState({
          movies: results,
          isLoading: false,
          totalResults: total_results,
        })
      })
      .catch(this.onError)
  }

  onError = () => {
    this.setState({
      error: true,
      isLoading: false,
    })
  }

  onPageChange = (page) => {
    this.setState({
      currentPage: page,
    })
  }

  render() {
    const { movies, isLoading, error, totalResults, currentPage, allGenres } = this.state
    return (
      <div className="app">
        <input
          className="film-search"
          type="text"
          placeholder="Type to search..."
          onChange={(event) => this.updateSearchValue(event.target.value)}
        />
        <Movies movies={movies} isLoading={isLoading} error={error} allGenres={allGenres} />
        <Pagination
          current={currentPage}
          onChange={this.onPageChange}
          total={totalResults}
          defaultPageSize={20}
          showSizeChanger={false}
          hideOnSinglePage
        />
      </div>
    )
  }
}
