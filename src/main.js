
//Data
const api = axios.create({
    baseURL: URL_API,
    headers: {
        'Content-Type': 'application/json;charset=utf-8',
    },
    params: {
        'api_key': API_KEY,
    }
});

function likedMoviesList() {

    const item = JSON.parse(localStorage.getItem('liked_movies'));
    let movies;

    if (item) {
        movies = item;
    } else {
        movies = {};
    }

    return movies;
};

function likeMovie(movie) {
    const likedMovies = likedMoviesList();
    console.log(likedMovies)

    if (likedMovies[movie.id]) {

        /* console.log('The movie was already in LS, we should delete it'); */
        likedMovies[movie.id] = undefined;

    } else {

        /* console.log('The movie was not in LS, we should add it'); */
        likedMovies[movie.id] = movie;

    };

    localStorage.setItem('liked_movies', JSON.stringify(likedMovies));

    if (location.hash == '') {
        homePage();
    }
};

// Utils

const lazyLoading = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const target = entry.target;
            const url = target.getAttribute('data-src')
            /* console.log(entry.target) */
            target.setAttribute('src', url)
            lazyLoading.unobserve(target);
        }

        /* console.log({ entry }) */
    })
});
function createMovies(movies, container, clean = true) {

    if (clean) { container.innerHTML = ''; };


    movies.forEach(movie => {

        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');
        /* headerCategorytitle.innerText = `${movie.title}`; */
        const movieImg = document.createElement('img');
        movieImg.classList.add('movie-img');
        /* movieImg.addEventListener('error', console.log); */
        movieImg.setAttribute('alt', movie.title);
        movieImg.setAttribute('data-src', 'https://image.tmdb.org/t/p/w300' + movie.poster_path);
        movieImg.addEventListener('click', () => {
            location.hash = '#movie=' + movie.id
        })
        movieImg.addEventListener('error', () => {
            movieImg.setAttribute(
                'src',
                'https://static.platzi.com/static/images/error/img404.png',
            );
        });

        const movieBtn = document.createElement('button');
        movieBtn.classList.add('movie-btn');
        likedMoviesList()[movie.id] && movieBtn.classList.add('movie-btn--liked');
        movieBtn.addEventListener('click', () => {
            /* getLikeMovies(); */
            movieBtn.classList.toggle('movie-btn--liked');
            likeMovie(movie);

        });

        lazyLoading.observe(movieImg);
        movieContainer.appendChild(movieImg);
        movieContainer.appendChild(movieBtn);
        container.appendChild(movieContainer);

        // lazyLoading(movieImg);

    });
    const containerButton = document.querySelector('.boton-load');
    const btnReloadMore = document.createElement('button');
    btnReloadMore.classList.add('active')
    btnReloadMore.innerText = 'Load More...';

    if (!document.body.querySelector('.active')) {
        containerButton.appendChild(btnReloadMore);
        btnReloadMore.addEventListener('click', () => {

            btnReloadMore.remove();

            getPaginatedTrendingMovies();

        });
    } else {
        console.log('button ready')
    }

};

function createCategories(categories, container) {
    container.innerHTML = '';
    categories.forEach(category => {

        const categoryContainer = document.createElement('div');
        categoryContainer.classList.add('category-container')
        /* headerCategorytitle.innerText = `${category.name}`; */
        const categoryTitle = document.createElement('h3');
        categoryTitle.classList.add('category-title');
        categoryTitle.setAttribute('id', 'id' + category.id)
        categoryTitle.addEventListener('click', () => {
            location.hash = '#category=' + category.id + '-' + category.name;
        })
        const categoryTitleText = document.createTextNode(category.name);

        categoryTitle.appendChild(categoryTitleText);
        categoryContainer.appendChild(categoryTitle);
        container.appendChild(categoryContainer);


    })

};
// Llamados a la API
async function getTrendingMoviesPreview() {
    const { data } = await api(`trending/movie/day`);
    const movies = data.results;

    console.log({ data, movies });

    createMovies(movies, trendingMoviesPreviewList)

};


async function getCategoriesPreview() {
    const { data } = await api(`genre/movie/list`);
    const categories = data.genres;
    console.log('categoties ', categories)

    createCategories(categories, categoriesPreviewList);



};

async function getMoviesByCategory(id) {

    const { data } = await api(`discover/movie`, {
        params: {
            with_genres: id,
        }
    });
    const movies = data.results;
    maxPage = data.total_pages;
    console.log(maxPage)
    console.log('with_genres')
    console.log({ data, movies });

    createMovies(movies, genericSection);
};

function getPaginatedMoviesByCategory(id) {

    return async function () {
        const { scrollTop, clientHeight, scrollHeight } = document.documentElement;

        const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15)
        const pageIsNotMax = page < maxPage;
        console.log(maxPage + ' ' + pageIsNotMax)

        if (scrollIsBottom && pageIsNotMax) {

            page++;
            console.log('paginacion: ' + page)
            const { data } = await api(`discover/movie`, {
                params: {
                    with_genres: id,
                    page,
                }
            });
            const movies = data.results;

            createMovies(movies, genericSection, clean = false);
        }

    }

};

async function getMoviesBySearch(query) {
    const { data } = await api('search/movie', {
        params: {
            query,
        },
    });
    const movies = data.results;
    maxPage = data.total_pages;
    console.log(maxPage)
    createMovies(movies, genericSection);
};

function getPaginatedMoviesBySearch(query) {

    return async function () {
        const { scrollTop, clientHeight, scrollHeight } = document.documentElement;

        const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15)
        const pageIsNotMax = page < maxPage;
        console.log('500' + pageIsNotMax)

        if (scrollIsBottom && pageIsNotMax) {

            page++;
            console.log('paginacion: ' + page)
            const { data } = await api('search/movie', {
                params: {
                    query,
                    page,
                },
            });
            const movies = data.results;

            createMovies(movies, genericSection, clean = false);
        }

    }

};

async function getTrendingMovies() {
    const { data } = await api(`trending/movie/day`);
    const movies = data.results;

    maxPage = data.total_pages;

    createMovies(movies, genericSection, clean = true)


};



async function getPaginatedTrendingMovies() {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;

    const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15)
    const pageIsNotMax = page < maxPage;
    console.log('100' + pageIsNotMax)

    if (scrollIsBottom && pageIsNotMax) {

        page++;
        console.log('paginacion: ' + page)
        const { data } = await api(`trending/movie/day`, {
            params: {
                page,
            },
        });

        const movies = data.results;

        createMovies(movies, genericSection, clean = false);
    };
};

async function getMovieById(id) {
    const { data: movie } = await api(`movie/${id}`);

    const movieImageUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    console.log(movieImageUrl);
    headerSection.style.background = ` 
    linear-gradient(
        180deg,
         rgba(0, 0, 0, 0.35) 19.27%, 
         rgba(0, 0, 0, 0) 29.17%
         ), 
         url(${movieImageUrl})`;

    movieDetailTitle.textContent = movie.title;
    movieDetailDescription.textContent = movie.overview;
    movieDetailScore.textContent = movie.vote_average;

    createCategories(movie.genres, movieDetailCategoriesList);
    getMoviesRelatedById(id);
};

async function getMoviesRelatedById(id) {
    const { data } = await api(`/movie/${id}/recommendations`);
    const relatedMovies = data.results;

    createMovies(relatedMovies, relatedMoviesContainer);
};


function getLikeMovies() {
    const likedMovies = likedMoviesList();

    const moviesArray = Object.values(likedMovies);
    console.log(moviesArray);

    createMovies(moviesArray, likedMovieArticle, true);
}