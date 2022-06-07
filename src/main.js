

const api = axios.create({
    baseURL: URL_API,
    headers: {
        'Content-Type': 'application/json;charset=utf-8',
    },
    params: {
        'api_key': API_KEY,
    }
})


// Utils

const lazyLoading = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const target = entry.target;
            const url = target.getAttribute('data-src')
            /* console.log(entry.target) */
            entry.target.setAttribute('src', url)
            lazyLoading.unobserve(target);
        }

        /* console.log({ entry }) */
    })
})
function createMovies(movies, container) {
    container.innerHTML = '';

    movies.forEach(movie => {

        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');
        movieContainer.addEventListener('click', () => {
            location.hash = '#movie=' + movie.id
        })
        const movieImg = document.createElement('img');
        movieImg.classList.add('movie-img');
        /* movieImg.addEventListener('error', console.log); */
        movieImg.setAttribute('alt', movie.title);
        movieImg.setAttribute('data-src', 'https://image.tmdb.org/t/p/w300' + movie.poster_path);

        movieImg.addEventListener('error', () => {
            movieImg.setAttribute(
                'src',
                'https://static.platzi.com/static/images/error/img404.png',
            );
        })

        lazyLoading.observe(movieImg);
        movieContainer.appendChild(movieImg);
        container.appendChild(movieContainer);

        // lazyLoading(movieImg);

    });
}

function createCategories(categories, container) {
    container.innerHTML = '';
    categories.forEach(category => {

        const categoryContainer = document.createElement('div');
        categoryContainer.classList.add('category-container')

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

}
// Llamados a la API
async function getTrendingMoviesPreview() {
    const { data } = await api(`trending/movie/day`);
    const movies = data.results;

    console.log({ data, movies });

    createMovies(movies, trendingMoviesPreviewList)

}


async function getCategoriesPreview() {
    const { data } = await api(`genre/movie/list`);
    const categories = data.genres;
    console.log('categoties ', categories)

    createCategories(categories, categoriesPreviewList);



}

async function getMoviesByCategory(id) {

    const { data } = await api(`discover/movie`, {
        params: {
            with_genres: id,
        }
    });
    const movies = data.results;
    console.log('with_genres')
    console.log({ data, movies });

    createMovies(movies, genericSection);
}

async function getMoviesBySearch(query) {
    const { data } = await api('search/movie', {
        params: {
            query,
        },
    });
    const movies = data.results;
    createMovies(movies, genericSection);
}


async function getTrendingMovies() {
    const { data } = await api(`trending/movie/day`);
    const movies = data.results;

    console.log({ data, movies });

    createMovies(movies, genericSection)

}


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