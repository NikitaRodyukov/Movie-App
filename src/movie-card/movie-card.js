/* eslint-disable react/no-unused-class-component-methods */
import { format, parseISO } from 'date-fns'
import { Spin, Rate, Alert } from 'antd'
import { Component } from 'react'
import PropTypes from 'prop-types'

import MovapiService from '../movapi-service/movapi-service'

import './movie-card.css'

export default class MovieCard extends Component {
  movapiService = new MovapiService()

  state = {
    isLoading: true,
    loadingImageError: false,
    imgUrl: '',
    // eslint-disable-next-line react/destructuring-assignment
    starCount: this.props.rateValue,
  }

  componentDidMount() {
    const { imgLink } = this.props
    this.movapiService
      .getImage(imgLink)
      .then((response) => {
        this.setState({ isLoading: false, imgUrl: response.url })
      })
      .catch(() => this.setState({ isLoading: false, loadingImageError: true }))
  }

  starCountChange = (number) => {
    const { id, guestSessionId, addRatedMovie } = this.props

    this.setState({
      starCount: number,
    })

    this.movapiService.rateMovie(id, guestSessionId, number)

    addRatedMovie(id, number)
  }

  truncate = (text) => {
    const maxLength = 180

    if (text.length > maxLength) {
      const breakpoint = text.slice(0, maxLength).lastIndexOf(' ')
      return `${text.slice(0, breakpoint)} ...`
    }

    return text
  }

  setColor = (rating) => {
    let className = 'movie-card__vote'

    if (rating >= 0 && rating < 3) {
      className += ' red'
    }

    if (rating >= 3 && rating < 5) {
      className += ' orange'
    }

    if (rating >= 5 && rating < 7) {
      className += ' yellow'
    }

    if (rating >= 7) {
      className += ' green'
    }
    return className
  }

  render() {
    const {
      titleName,
      allGenres: { genres }, // здесь у нас объекты с id и названием жанров
      FilmGenreIds,
      overview,
      voteAverage,
    } = this.props

    const { starCount, isLoading, loadingImageError, imgUrl } = this.state

    let { date } = this.props

    const filmGenres = FilmGenreIds.map(
      (filmGenreId) => genres.filter(({ id }) => Number(filmGenreId) === Number(id))[0] // метод filter возвращает массив с одним объектом, поэтому мы просто берем его
    )

    const renderTags = filmGenres.map(({ id, name }) => (
      <div key={id} className="tag__name">
        {name}
      </div>
    ))

    try {
      date = format(parseISO(date), 'MMMM d, yyyy')
    } catch {
      date = 'Date unknown'
    }

    const content = isLoading ? (
      <Spin size="large" />
    ) : (
      <>
        <div className="movie-card__image">
          {!loadingImageError ? (
            <img src={imgUrl} alt="Film poster" />
          ) : (
            <Alert message="Error" description="Error while downloading image." type="error" />
          )}
        </div>

        <div className="movie-card__info">
          <div className={this.setColor(voteAverage)}>{voteAverage.toFixed(1)}</div>
          <h1 className="movie-card__name">{titleName}</h1>
          <div className="movie-card__date">{date}</div>
          <div className="movie-card__tags tag">{renderTags}</div>
          <div className="movie-card__description">{this.truncate(overview)}</div>
          <Rate allowHalf style={{ fontSize: 16 }} count={10} value={starCount} onChange={this.starCountChange} />
        </div>
      </>
    )

    return <li className="movie-card">{content}</li>
  }
}

MovieCard.defaultProps = {
  titleName: 'No title',
  date: new Date(),
  imgLink: '',
  genres: [''],
  FilmGenreIds: [{}],
  overview: 'No description found',
  voteAverage: 0,
}

MovieCard.propTypes = {
  titleName: PropTypes.string,
  date: PropTypes.instanceOf(Date),
  imgLink: PropTypes.string,
  genres: PropTypes.arrayOf(PropTypes.string),
  FilmGenreIds: PropTypes.oneOfType([PropTypes.object]),
  overview: PropTypes.string,
  voteAverage: PropTypes.number,
}
