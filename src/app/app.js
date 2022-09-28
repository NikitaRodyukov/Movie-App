/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-unused-state */
/* eslint-disable camelcase */
import { Component } from 'react'
import { Pagination, Tabs } from 'antd'
import { debounce } from 'lodash'

import MovapiService from '../movapi-service/movapi-service'
import Movies from '../movies/movies'
import './app.css'

export default class App extends Component {
  movapiService = new MovapiService()

  state = {
    searchValue: null,
    movies: [],
    ratedMovies: [],
    totalratedMovies: 0,
    movieRates: [],
    totalResults: 0,
    currentPage: 1,
    isLoading: false,
    error: false,
    guestSessionId: '',
    allGenres: [],
    currentTab: 1,
    tabRatedInactive: true,
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
    const { searchValue, currentPage, tabRatedInactive, movieRates } = this.state

    if (searchValue !== prevState.searchValue || currentPage !== prevState.currentPage) {
      this.updateMovieList()
    }

    if (tabRatedInactive && movieRates.length) this.makeRatedTabActive()
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

  addRatedMovie = (id, newRate) => {
    this.setState(({ movieRates }) => {
      const oldMovieRates = movieRates
      const idx = movieRates.findIndex((el) => id === el.id)

      if (idx >= 0) {
        const updatedRating = oldMovieRates.reduce(
          (acc, { id: filmId, rate: oldRating }) =>
            filmId === id ? (acc = { id, rate: newRate }) : (acc = { id, rate: oldRating }),
          {}
        )
        return { movieRates: [...oldMovieRates.slice(0, idx), updatedRating, ...oldMovieRates.slice(idx + 1)] }
      }

      return { movieRates: [...oldMovieRates, { id, rate: newRate }] }
    })
  }

  getRatedMovies = () => {
    const { guestSessionId } = this.state

    this.setState({
      isLoading: true,
      error: false,
    })

    this.movapiService.getRatedMovies(guestSessionId).then((answer) => {
      const { results, total_results } = answer

      this.setState({
        ratedMovies: results,
        isLoading: false,
        totalratedMovies: total_results,
      })
    })
  }

  onTabChange = (key) => {
    if (key === 'rated') {
      this.getRatedMovies()
    }
  }

  makeRatedTabActive = () => this.setState({ tabRatedInactive: false })

  render() {
    const {
      movies,
      ratedMovies,
      error,
      totalResults,
      currentPage,
      allGenres,
      guestSessionId,
      tabRatedInactive,
      movieRates,
      totalratedMovies,
    } = this.state

    return (
      <div className="app">
        <Tabs onChange={(key) => this.onTabChange(key)} size="large" centered="true">
          <Tabs.TabPane tab="Search" key="search">
            <input
              className="film-search center"
              type="text"
              placeholder="Type to search..."
              onChange={(event) => this.updateSearchValue(event.target.value)}
            />
            <Movies
              movies={movies}
              error={error}
              allGenres={allGenres}
              movieRates={movieRates}
              guestSessionId={guestSessionId}
              addRatedMovie={this.addRatedMovie}
            />
            <Pagination
              current={currentPage}
              onChange={this.onPageChange}
              total={totalResults}
              defaultPageSize={20}
              showSizeChanger={false}
              hideOnSinglePage
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Rated" key="rated" disabled={tabRatedInactive} onClick={() => this.getRatedMovies()}>
            <Movies
              movies={ratedMovies}
              error={error}
              allGenres={allGenres}
              movieRates={movieRates}
              guestSessionId={guestSessionId}
              addRatedMovie={this.addRatedMovie}
            />
            <Pagination
              current={currentPage}
              onChange={this.onPageChange}
              total={totalratedMovies}
              defaultPageSize={20}
              showSizeChanger={false}
              hideOnSinglePage
            />
          </Tabs.TabPane>
        </Tabs>
      </div>
    )
  }
}
