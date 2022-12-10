export default function renderMarkup(hits) {
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
}