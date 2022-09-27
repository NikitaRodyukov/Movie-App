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
}
