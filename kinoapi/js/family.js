

//---------------------------------API---------------------------------
const API_KEY = "f95ccb8e-0ba0-4ac0-9abd-72a7768173f7"
const API_URL_TOP_POPULAR = "https://kinopoiskapiunofficial.tech/api/v2.2/films/collections?type=FAMILY&page=1"
const API_URL_SEARCH = "https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword="
const API_URL_MOVIE_DETAILS = "https://kinopoiskapiunofficial.tech/api/v2.2/films/"
getMovies(API_URL_TOP_POPULAR)




//---------------------------------movie card---------------------------------
async function getMovies(url) {
    const response = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            "X-API-KEY": API_KEY,
        },
    });

    const responseData = await response.json()
    showMovies(responseData)
}

function getClassByRate(rate) {
    if (rate >= 7) {
        return "green"
    }
    else if (rate > 5) {
        return "orange"
    }
    else { return "red" }
}

function showMovies(data) {
    const moviesEl = document.querySelector(".movies");

    document.querySelector(".movies").innerHTML = "";

    data.items.forEach((movie) => {
        const movieEl = document.createElement("div");
        movieEl.classList.add("movie");
        movieEl.innerHTML = `
        <div class="movie">
        <div class="movie_cover-inner">
            <img class="movier-cover"
                src="${movie.posterUrlPreview}"
                alt="${movie.nameEn}">
            <div class="movie_cover-darkened"></div>
        </div>
        <div class="movie-info">
            <div class="movie-title">${movie.nameRu}</div>
            <div class="movie-category">${movie.genres.map(
            (genre) => ` ${genre.genre}`
        )}</div>

        ${movie.ratingKinopoisk &&
            `
          <div class="movie-average movie-colour--${getClassByRate(
                movie.ratingKinopoisk
            )}">${movie.ratingKinopoisk}</div>
          `
            }
        </div>
          `;



        movieEl.addEventListener("click", () => openModal(movie.kinopoiskId))
        moviesEl.appendChild(movieEl);
    });
}


const form = document.querySelector("form")
const search = document.querySelector(".header-search")

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const apiSearchUrl = `${API_URL_SEARCH}${search.value}`;
    if (search.value) {
        getMovies(apiSearchUrl);

        search.value = "";
    }
});



//---------------------------------MODAL---------------------------------

const modalEl = document.querySelector(".modal")

async function openModal(id) {
    const response = await fetch(API_URL_MOVIE_DETAILS + id, {
        headers: {
            "Content-Type": "application/json",
            "X-API-KEY": API_KEY,
        },
    });
    const modalInfo = await response.json()





    modalEl.classList.add("modal-show");
    document.body.classList.add("stop-scrolling")

    modalEl.innerHTML = `
<div class="modal-card">
        <img class="modal-movie-backdrop" src="${modalInfo.posterUrl}" alt="">
        
        <h2>
            <span class="modal-movie-title">${modalInfo.nameRu} - ${modalInfo.year}</span>
        </h2>

        <ul class="modal-movie-info">
            <div class="loader"></div>
            <li class="modal-movie-genre">Жанр: ${modalInfo.genres.map((el) => `<span>${el.genre}</span>`)}</li>
            ${modalInfo.filmLength ? `<li class="modal-movie-runtime">Продолжительность фильма: ${modalInfo.filmLength} минут</li>` : ''}
            <li>Смотреть: <a class="modal-movie-site" href="${modalInfo.webUrl}">${modalInfo.webUrl}</a></li>
           <span class="discription">Описание</span>
            <li class="modal-movie-overview">${modalInfo.description}</li>
        </ul>

        <button type="button" class="modal-button-close">Закрыть</button>
    </div>
`
    const btnClose = document.querySelector(".modal-button-close")
    btnClose.addEventListener("click", () => closeModal())
}


function closeModal() {
    modalEl.classList.remove("modal-show");
    document.body.classList.remove("stop-scrolling")
}

window.addEventListener("click", (e) => {
    if (e.target === modalEl) {
        closeModal()
    }
})

window.addEventListener('keydown', (e) => {
    if (e.keyCode === 27) {
        closeModal()
    }
})



