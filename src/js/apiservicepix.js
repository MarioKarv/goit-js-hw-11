import axios from "axios";

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '34884356-6ab63fddabd0592c676cde3fe';

export default class PicturesApiService {
  constructor() {
    this.inputData = '';
    this.page = 1;
    this.per_page_value = 40;
  }
  async fetchGallery() {
    const options = {
      method: 'get',
      url: BASE_URL,
      params: {
        key: API_KEY,
        q: `${this.inputData}`,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: `${this.page}`,
        per_page: `${this.per_page_value}`,
      },
    };
    try {
      const response = await axios(options);
      const result = response.data;
      this.pageGain();
      return result;
    } catch (e) {
      console.log(e);
    }
  }
  pageGain() {
    this.page += 1;
  }

  toTheStartNumber() {
    this.page = 1;
  }

  resetEndOfHits() {
    this.endOfHits = false;
  }

  get inputValue() {
    return this.inputData;
  }

  set inputValue(newInputData) {
    this.inputData = newInputData;
  }
}

