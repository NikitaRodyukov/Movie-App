export default class MovapiService {
  async getData(url) {
    const answer = await fetch(url)

    if (!answer.ok) {
      throw new Error(`Could not fetch ${url}, received ${answer.status}`)
    }
    const result = await answer.json()
    return result
  }

  async getMovieList(movieName, pageNumber) {
    const res = await this.getData(
      `https://api.themoviedb.org/3/search/movie?api_key=71964362e6f4b8cb55e7d1ffd26051f0&query=${movieName}&page=${pageNumber}`
    )

    return res
  }

  async createNewGuestSession() {
    const response = await this.getData(
      'https://api.themoviedb.org/3/authentication/guest_session/new?api_key=71964362e6f4b8cb55e7d1ffd26051f0'
    )

    return response.guest_session_id
  }

  async getMoviesGenres() {
    const response = await this.getData(
      'https://api.themoviedb.org/3/genre/movie/list?api_key=71964362e6f4b8cb55e7d1ffd26051f0&language=en-US'
    )

    return response
  }

  async rateMovie(id, guestSessionId, rating) {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value: rating }),
    }
    const url = `https://api.themoviedb.org/3/movie/${id}/rating?api_key=71964362e6f4b8cb55e7d1ffd26051f0&guest_session_id=${guestSessionId}`
    const answer = await fetch(url, requestOptions)

    if (!answer.ok) {
      throw new Error(`Could not fetch ${url}, received ${answer.status}`)
    }

    const result = await answer.json()

    return result
  }

  async getRatedMovies(guestSessionId) {
    const response = await this.getData(
      `https://api.themoviedb.org/3/guest_session/${guestSessionId}/rated/movies?api_key=71964362e6f4b8cb55e7d1ffd26051f0`
    )

    return response
  }

  async getImage(imgLink) {
    const url = `https://image.tmdb.org/t/p/w400${imgLink}`
    const answer = await fetch(url)

    if (!answer.ok) {
      throw new Error(`Could not fetch ${url}, received ${answer.status}`)
    }
    return answer
  }
}
