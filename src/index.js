import './css/styles.css';

import Notiflix from 'notiflix';
// Описаний в документації
import SimpleLightbox from 'simplelightbox';
// Додатковий імпорт стилів
import 'simplelightbox/dist/simple-lightbox.min.css';

import FetchSearchImages from './fetchSearchImages';

const refs = {
  searchForm: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  loadMore: document.querySelector('.load-more'),
};

let gallery = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

const api = new FetchSearchImages();

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMore.addEventListener('click', onLoadMore);

async function onSearch(e) {
  e.preventDefault();

  try {
    api.query = e.target.elements.searchQuery.value;
    api.resetPage();
    showLoading();
    await api.getImages().then(resp => {
      const data = resp.data;
      clearMarkup();
      if (data.hits.length === 0) {
        return Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.',
          { clickToClose: true }
        );
      }
      renderMarkup(data);
      gallery.refresh();
      Notiflix.Notify.info(`Hooray! We found ${data.totalHits} images.`, {
        clickToClose: true,
      });
    });
  } catch (error) {
    console.log(error);
  }
}

function showLoading() {
  refs.loadMore.classList.add('visible');
  onLoadMore();
}

async function onLoadMore() {
  try {
    await api.getImages().then(resp => {
      const data = resp.data;
      if (api.loadPages > data.totalHits) {
        renderMarkup(data);
        gallery.refresh();
        refs.loadMore.classList.remove('visible');
        return Notiflix.Notify.warning(
          "We're sorry, but you've reached the end of search results."
        );
      }
      renderMarkup(data);
      gallery.refresh();
    });
  } catch (error) {
    console.log(error);
  }
}

function renderMarkup({ hits }) {
  const markup = hits
    .map(
      ({
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
        largeImageURL,
      }) => {
        return `
      <div class="photo-card">
    <a class='photo-card__link' href='${largeImageURL}'><img src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
    <div class="info">
      <p class="info-item">
        <b>Likes</b>
        <b>${likes}</b>
      </p>
      <p class="info-item">
        <b>Views</b>
        <b>${views}</b>
      </p>
      <p class="info-item">
        <b>Comments</b>
        <b>${comments}</b>
      </p>
      <p class="info-item">
        <b>Downloads</b>
        <b>${downloads}</b>
      </p>
    </div>
  </div>`;
      }
    )
    .join('');

  refs.gallery.insertAdjacentHTML('beforeend', markup);
  refs.loadMore.classList.remove('visible');
}

function clearMarkup() {
  refs.gallery.innerHTML = '';
}
