async function getTrendingMoviesPreview() {
    const answer = await fetch(`${URL_API}trending/movie/day?${API_KEY}`);
    const data = await answer.json();

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
    const answer = await fetch(`${URL_API}genre/movie/list?${API_KEY}`);
    const data = await answer.json();

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