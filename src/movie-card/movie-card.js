import { format, parseISO } from 'date-fns'
import { Rate } from 'antd'
import { Component } from 'react'

import './movie-card.css'
// добавить state isLoadingImg и errLoadingImg если isLoadingImg=false и errLoadingImg=true то показывать ошибку, если isLoadingImg=true
// и errLoadingImg=false, то компонент загрузки если оба false то картинку
export default class MovieCard extends Component {
  state = {
    starCount: 0,
  }

  starCountChange = (number) => {
    this.setState({
      starCount: number,
    })
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
    const { titleName, imgLink, allGenres, genreIds, voteAverage } = this.props
    const { starCount } = this.state
    const { genres } = allGenres
    let { date, overview } = this.props

    const filmGenres = genreIds.map((filmGenreId) => {
      const objHasFilmId = genres.filter(({ id }) => Number(filmGenreId) === Number(id))

      if (objHasFilmId.length) return objHasFilmId[0]
      return ''
    })

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

    overview = this.truncate(overview)

    return (
      <li className="movie-card">
        <img className="movie-card__image" src={`https://image.tmdb.org/t/p/w400${imgLink}`} alt={titleName} />
        <div className="movie-card__info">
          <div className={this.setColor(voteAverage)}>{voteAverage}</div>
          <h1 className="movie-card__name">{titleName}</h1>
          <div className="movie-card__date">{date}</div>
          <div className="movie-card__tags tag">{renderTags}</div>
          <div className="movie-card__description">{overview}</div>
          <Rate allowHalf style={{ fontSize: 16 }} count={10} value={starCount} onChange={this.starCountChange} />
        </div>
      </li>
    )
  }
}

MovieCard.defaultProps = {
  date: new Date(),
}
