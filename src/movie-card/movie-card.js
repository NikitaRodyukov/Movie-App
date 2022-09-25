import { format, parseISO } from 'date-fns'
import { Component } from 'react'
import './movie-card.css'

export default class MovieCard extends Component {
  truncate(text) {
    const maxLength = 180

    if (text.length > maxLength) {
      const breakpoint = text.slice(0, maxLength).lastIndexOf(' ')
      return `${text.slice(0, breakpoint)} ...`
    }

    return text
  }

  render() {
    const { name, imgLink } = this.props
    let { date, overview } = this.props
    date = format(parseISO(date), 'MMMM d, yyyy')
    overview = this.truncate(overview)

    return (
      <li className="movie-card">
        <img className="movie-card__image" src={`https://image.tmdb.org/t/p/w400${imgLink}`} alt={name} />
        <div className="movie-card__info">
          <h1 className="movie-card__name">{name}</h1>
          <div className="movie-card__date">{date}</div>
          <div className="movie-card__tags tag">
            <div className="tag__name">Action</div>
            <div className="tag__name">Drama</div>
          </div>
          <div className="movie-card__description">{overview}</div>
        </div>
      </li>
    )
  }
}

MovieCard.defaultProps = {
  date: new Date(),
}
