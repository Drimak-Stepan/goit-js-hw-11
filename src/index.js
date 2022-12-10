import './css/styles.css';
import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import FetchSearchImages from './JS/fetch';
import smoothScroll from './JS/scroll';
import renderMarkup from './JS/render';

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

async function onSearch(e) {
  e.preventDefault();
  api.query = e.target.elements.searchQuery.value;
  api.resetPage();
  try {
    await api.getImages().then(({ hits, totalHits }) => {
      console.log(totalHits);
      refs.gallery.innerHTML = '';
      if (hits.length === 0) {
        return Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.',
          { clickToClose: true }
        );
      }
      renderMarkup(hits);
      refs.loadMore.classList.add('visible');
      gallery.refresh();
      Notify.info(`Hooray! We found ${totalHits} images.`, {
        clickToClose: true,
      });
    });
  } catch (error) {
    console.log(error);
  }
}

async function onLoadMore() {
  try {
    await api.getImages().then(({ hits, totalHits }) => {
      console.log(hits);
      if (api.addPages > totalHits) {
        gallery.refresh();
        return Notify.warning(
          "We're sorry, but you've reached the end of search results."
        );
      }
      renderMarkup(hits);
      gallery.refresh();
      smoothScroll();
    });
  } catch (error) {
    console.log(error);
  }
}

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMore.addEventListener('click', onLoadMore);
