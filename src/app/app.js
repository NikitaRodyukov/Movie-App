import { Component } from 'react'
import { Pagination, Tabs, Alert } from 'antd'
import { debounce } from 'lodash'

import { Provider, Consumer } from '../movieapi-context/movieapi-contex'
import MovapiService from '../movapi-service/movapi-service'
import Movies from '../movies/movies'
import './app.css'

export default class App extends Component {
  movapiService = new MovapiService()

  state = {
    searchValue: '',
    movies: [],
    ratedMovies: [],
    totalratedMovies: 0,
    movieRates: [],
    totalResults: 0,
    currentPage: 1,
    isLoading: false,
    sessionError: false,
    noFilmsFound: false,
    allGenres: [],
    guestSessionId: '',
    tabRatedInactive: true,
  }

  updateSearchValue = debounce((value) => {
    this.setState({
      searchValue: value,
    })
  }, 500)

  componentDidMount() {
    this.movapiService
      .createNewGuestSession()
      .then((guestSessionId) =>
        this.setState({
          guestSessionId,
        })
      )
      .catch(() => this.setState({ sessionError: true }))

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
      this.setState({ movies: [], totalResults: 0 })
      return
    }

    this.setState({
      isLoading: true,
      noFilmsFound: false,
    })

    this.movapiService
      .getMovieList(searchValue, currentPage)
      .then((answer) => {
        const { results, total_results: totalResults } = answer

        if (!results.length) {
          this.setState({
            isLoading: false,
            noFilmsFound: true,
          })
        }

        this.setState({
          movies: results,
          isLoading: false,
          totalResults,
        })
      })
      .catch(this.onError)
  }

  onError = () => {
    this.setState({
      noFilmsFound: true,
      isLoading: false,
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
      noFilmsFound: false,
    })

    this.movapiService.getRatedMovies(guestSessionId).then((answer) => {
      const { results, total_results: totalResults } = answer

      this.setState({
        ratedMovies: results,
        isLoading: false,
        totalratedMovies: totalResults,
      })
    })
  }

  onTabChange = (key) => {
    if (key === 'rated') {
      this.getRatedMovies()
    }
  }

  onPageChange = (page) => {
    this.setState({
      currentPage: page,
    })
  }

  makeRatedTabActive = () => this.setState({ tabRatedInactive: false })

  render() {
    const {
      movies,
      ratedMovies,
      isLoading,
      totalResults,
      currentPage,
      guestSessionId,
      tabRatedInactive,
      movieRates,
      totalratedMovies,
      sessionError,
      noFilmsFound,
      allGenres,
    } = this.state

    return (
      <Provider value={allGenres}>
        <div className="app">
          <Tabs onChange={(key) => this.onTabChange(key)} size="large" centered="true">
            <Tabs.TabPane tab="Search" key="search">
              <input
                className="film-search center"
                type="text"
                placeholder="Type to search..."
                onChange={(event) => this.updateSearchValue(event.target.value)}
              />
              {sessionError && (
                <Alert
                  message="Failed to create session"
                  description="Please restart the page to create the session"
                  type="error"
                />
              )}
              <Consumer>
                {(genres) => (
                  <Movies
                    movies={movies}
                    isLoading={isLoading}
                    noFilmsFound={noFilmsFound}
                    allGenres={genres}
                    movieRates={movieRates}
                    guestSessionId={guestSessionId}
                    addRatedMovie={this.addRatedMovie}
                  />
                )}
              </Consumer>
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
              <Consumer>
                {(genres) => (
                  <Movies
                    movies={ratedMovies}
                    allGenres={genres}
                    movieRates={movieRates}
                    guestSessionId={guestSessionId}
                    addRatedMovie={this.addRatedMovie}
                  />
                )}
              </Consumer>
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
      </Provider>
    )
  }
}
