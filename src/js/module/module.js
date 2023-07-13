const module = () => {
   const API_KEY = 'c81adf28-7d3b-4eb4-a78b-c92c8c829d71';
   const API_URL_POPULAR = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_100_POPULAR_FILMS&page=1';
   const API_URL_SEARCH = 'https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=';
   const API_URL_MOVIE_DETAILS = "https://kinopoiskapiunofficial.tech/api/v2.2/films/";
   
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
      console.log(responseData);
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
               <div class="content-item__info-genres">${movie.countries.map((country) => ` ${country.country}`)}</div>
               <div class="content-item__info-average">${parseFloat(movie.rating)}</div>
            </div>
         </div>
         `;
         movieElement.addEventListener('click', () => openModal(movie.filmId))
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

   //create Modal 

   const modal = document.querySelector('.modal');

   async function openModal(id) {
      const resp = await fetch(API_URL_MOVIE_DETAILS + id, {
         headers: {
           "Content-Type": "application/json",
           "X-API-KEY": API_KEY,
         },
       });
       const respData = await resp.json();

      modal.classList.add('modal--show');
      document.body.style.overflow = 'hidden';
      
      modal.innerHTML =  `
         <div class="modal-content">
            <img class="modal-content__image" src="${respData.posterUrl}" alt="${respData.nameRu}">
            <div class = "modal-content__wrapper">
               <span class="modal-content__title">${respData.nameRu}</span>
               <span class="modal-content__release-year"> - ${respData.year}</span>
            </div>
            <ul class="modal-content__list">
               <div class="loader"></div>
               <li class="modal-content__item">Жанр : ${respData.genres.map((el) => `<span>${el.genre}</span>`)}</li>
               ${respData.filmLength ? `<li class="modal-content__item">Время : ${respData.filmLength} минут</li>` : ''}
               ${respData.description ? `<li class="modal-content__item">Описание : ${respData.description}</li>` : '' }
            </ul>
            <div class="modal-content__close">&times;</div>
         </div>
      `;
      const buttonClose = document.querySelector('.modal-content__close');
      buttonClose.addEventListener('click', () => closeModal());
   }

   function closeModal() {
      modal.classList.remove("modal--show");
      document.body.style.overflow = '';
   }

   window.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeModal();
      }
    })
    
    window.addEventListener("keydown", (e) => {
      if (e.code === "Escape") {
        closeModal();
      }
    });
}

export default module;