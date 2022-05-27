async function getTrendingMoviesPreview() {
    const answer = await fetch(`${URL_API}${API_KEY}`);
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

getTrendingMoviesPreview(); 