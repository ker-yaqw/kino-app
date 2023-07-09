
const moduleApi = () => {
   const API_KEY = 'c81adf28-7d3b-4eb4-a78b-c92c8c829d71';
   const API_URL_POPULAR = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_100_POPULAR_FILMS&page=1';
   const API_URL_SEARCH = 'https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=';

   getMovie(API_URL_POPULAR);

   async function getMovie(url) {
      const response = await fetch(url, {
         method: 'GET',
         headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': API_KEY,
         },
      });
      const responseData = await response.json();
      showMovies(responseData);
   }

   function showMovies (data) {
      const wrapperElement  = document.querySelector('.content__wrapper');

      //очищяем предыдущие фильмы
      document.querySelector('.content__wrapper').innerHTML = '';

      data.films.forEach(movie => {
         const movieElement = document.createElement('div');
         movieElement.classList.add('content-item');
         movieElement.innerHTML = `
         <div class="content-item">
            <div class="content-item__cover">
                <img class="content-item__image" src="${movie.posterUrlPreview}" alt="${movie.nameRu}">
            </div>
            <div class="content-item__info">
               <div class="content-item__info-title">${movie.nameRu}</div>
               <div class="content-item__info-genres">${movie.genres.map((genre) => ` ${genre.genre}`)}</div>
               <div class="content-item__info-average">${parseFloat(movie.rating)}</div>
            </div>
         </div>
         `;
         wrapperElement.appendChild(movieElement);
      });
   }

   const form = document.querySelector('.header-content__form');
   const search = document.querySelector('.header-content__form-input');

   form.addEventListener('submit', (e) => {
      e.preventDefault();

      const apiSearchUrl  = `${API_URL_SEARCH}${search.value}`;
      if (search.value) {
         getMovie(apiSearchUrl);
         search.value = '';
      }
   });


}

export default moduleApi;