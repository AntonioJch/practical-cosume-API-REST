

const api = axios.create({
    baseURL: URL_API,
    headers: {
        'Content-Type': 'application/json;charset=utf-8',
    },
    params: {
        'api_key': API_KEY,
    }
})

async function getTrendingMoviesPreview() {
    const { data } = await api(`trending/movie/day`);
    const movies = data.results;

    console.log({ data, movies });
    movies.forEach(movie => {
        const trendingPreviewMovieListContainer = document.querySelector('#trendingPreview .trendingPreview-movieList');
        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');

        const movieImg = document.createElement('img');
        movieImg.classList.add('movie-img');
        movieImg.setAttribute('alt', movie.title);
        movieImg.setAttribute('src', 'https://image.tmdb.org/t/p/w300' + movie.poster_path);


        movieContainer.appendChild(movieImg);
        trendingPreviewMovieListContainer.appendChild(movieContainer);

    });

}


async function getCategoriesPreview() {
    const { data } = await api(`genre/movie/list`);
    const categories = data.genres;

    console.log('categoties ', categories)
    categories.forEach(category => {
        const categoriesPreviewContainer = document.querySelector('#categoriesPreview .categoriesPreview-list')

        const categoryContainer = document.createElement('div');
        categoryContainer.classList.add('category-container')

        const categoryTitle = document.createElement('h3');
        categoryTitle.classList.add('category-title');
        categoryTitle.setAttribute('id', 'id' + category.id)
        const categoryTitleText = document.createTextNode(category.name);

        categoryTitle.appendChild(categoryTitleText);
        categoryContainer.appendChild(categoryTitle);
        categoriesPreviewContainer.appendChild(categoryContainer);


    })
}

getCategoriesPreview()

getTrendingMoviesPreview(); 