const API_KEY = "4b9a9e35676d60f35e055a44621936e8";

const IMAGE = "https://image.tmdb.org/t/p/w500";

async function loadMovies(url, containerId){

    const response = await fetch(url);

    const data = await response.json();

    const container = document.getElementById(containerId);

    data.results.forEach(movie=>{

        container.innerHTML += `

        <div class="movie-card"
        onclick="showMovie(${movie.id})">

            <img src="${IMAGE}${movie.poster_path}">

            <div class="movie-info">

                <h3>${movie.title}</h3>

                <p>⭐ ${movie.vote_average.toFixed(1)}</p>

            </div>

        </div>

        `;

    });

}

loadMovies(
`https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`,
"trending");

loadMovies(
`https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}`,
"toprated");

loadMovies(
`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=35`,
"comedy");

loadMovies(
`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=27`,
"horror");

loadMovies(
`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=28`,
"action");

// Movie Details Popup
async function showMovie(id){

const response=await fetch(
`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`);

const movie=await response.json();

document.getElementById("popup").classList.remove("hidden");

document.getElementById("popup-title").innerHTML=movie.title;

document.querySelector(".popup-content p").innerHTML=

`
⭐ Rating : ${movie.vote_average}

<br><br>

📅 Release : ${movie.release_date}

<br><br>

${movie.overview}

`;

}

function closePopup(){

document.getElementById("popup").classList.add("hidden");

}