/* eslint-disable no-unused-vars */
/* eslint-disable react/destructuring-assignment */
import { format, parseISO } from 'date-fns'
import { Spin, Rate, Alert } from 'antd'
import { Component } from 'react'

import MovapiService from '../movapi-service/movapi-service'

import './movie-card.css'
// добавить state isLoadingImg и errLoadingImg если isLoadingImg=false и errLoadingImg=true то показывать ошибку, если isLoadingImg=true
// и errLoadingImg=false, то компонент загрузки если оба false то картинку
// при оценке фильма, нужно записать фильм с оценкой в state app и потом  смотреть оценивали ли этот фильм по id
export default class MovieCard extends Component {
  movapiService = new MovapiService()

  state = {
    isLoadingImg: true,
    errLoadingImg: false,
    starCount: this.props.rateValue,
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

  imgLoaded = () => {
    this.setState({ isLoadingImg: false, errLoadingImg: false })
  }

  imgLoadingError = () => {
    this.setState({ isLoadingImg: false, errLoadingImg: true })
  }

  render() {
    const {
      titleName,
      imgLink,
      allGenres: { genres },
      FilmGenreIds,
      overview,
      voteAverage,
      isLoading,
    } = this.props

    const { starCount, isLoadingImg, errLoadingImg } = this.state

    let { date } = this.props

    const errorMessage = <Alert message="Try restarting page to get image" type="error" className="top" />

    const filmGenres = FilmGenreIds.map(
      (filmGenreId) => genres.filter(({ id }) => Number(filmGenreId) === Number(id))[0]
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

    if (!imgLink) {
      this.imgLoadingError()
    }

    const content = (
      <>
        <div className="movie-card__image">
          <img
            src={`https://image.tmdb.org/t/p/w400${imgLink}`}
            alt=""
            onLoad={this.imgLoaded}
            onError={this.imgLoadingError}
          />
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

    return <li className="movie-card">{isLoading ? <Spin size="large" className="centered" /> : content}</li>
  }
}

MovieCard.defaultProps = {
  date: new Date(),
}
