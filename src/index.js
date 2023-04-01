import './sass/index.scss'
import { lightbox } from './js/simplelightbox';
import { Notify } from 'notiflix';
import PicturesApiService from './js/apiservicepix';

const searchForm = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('.load-more');

let shownPictures = 0;

const picturesApiService = new PicturesApiService();

searchForm.addEventListener('submit', onSearchForm);
loadMoreButton.addEventListener('click', onLoadMore);

const options = {
  rootMargin: '50px',
  root: null,
  threshold: 1.0,
};

const observer = new IntersectionObserver(onLoadMore, options);

function onSearchForm(event) {
    event.preventDefault();
    gallery.innerHTML = '';
    picturesApiService.inputValue = event.currentTarget.elements.searchQuery.value.trim();
    picturesApiService.toTheStartNumber();
    
    if (picturesApiService.inputValue === '') {
        return Notify.warning('Please, fill the field');
    }

    shownPictures = 0;
    fetchGallery();
    renderGallery();
}


function onLoadMore() {
    picturesApiService.pageGain();
    fetchGallery();
}

async function fetchGallery() {
    loadMoreButton.classList.add('is-hidden');

    const responseInit = await picturesApiService.fetchGallery();
    const { hits, total } = responseInit;
    shownPictures += hits.length;

    if (!hits.length) {
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        loadMoreButton.classList.add('is-hidden');
        return;
    }

    renderGallery(hits);
    shownPictures += hits.length;

    if (shownPictures < total) {
        Notify.success(`Hooray! We found ${total} images.`);
        loadMoreButton.classList.remove('is-hidden');
    }

    if (shownPictures >= total) {
      Notify.info("We're sorry, but you've reached the end of search results.");
    }
}

function renderGallery(elem) {
    const markup = elem
      .map(
        ({
          webformatURL,
          largeImageURL,
          tags,
          likes,
          views,
          comments,
          downloads,
        }) => {
          return `<div class="photo-card">
    <a href="${largeImageURL}">
      <img class="photo-img" src="${webformatURL}" alt="${tags}" loading="lazy" />
    </a>
    <div class="info">
      <p class="info-item">
        <b>Likes</b>
        ${likes}
      </p>
      <p class="info-item">
        <b>Views</b>
        ${views}
      </p>
      <p class="info-item">
        <b>Comments</b>
        ${comments}
      </p>
      <p class="info-item">
        <b>Downloads</b>
        ${downloads}
      </p>
    </div>
    </div>`;
        }
      )
      .join('');
  gallery.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
}