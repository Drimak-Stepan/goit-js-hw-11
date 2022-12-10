import axios from 'axios';

export default class FetchSearchImages {
  constructor() {
    this.URL = 'https://pixabay.com/api/';
    this.API_KEY = '31875092-4ca87b45adc611ce19a4a031b';
    this.searchQuery = '';
    this.page = 1;
    this.perPage = 40;
    this.addPages = 0;
  }
  async getImages() {
    const promise = await axios
      .get(
        `${this.URL}?key=${this.API_KEY}&q=${this.searchQuery}&image_type=photo&safesearch=true&orientation=horizontal&page=${this.page}&per_ page=${this.perPage}`
      )
      .then(({ data }) => data);

    this.incrementPage();

    return promise;
  }

  incrementPage() {
    this.page += 1;
    this.addPages += this.perPage;
  }

  resetPage() {
    this.page = 1;
    this.addPages = 0;
  }
  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
