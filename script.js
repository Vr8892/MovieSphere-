const movies = [
    {
        name: "Avatar",
        image: "https://via.placeholder.com/200x300?text=Avatar"
    },
    {
        name: "Avengers",
        image: "https://via.placeholder.com/200x300?text=Avengers"
    },
    {
        name: "Joker",
        image: "https://via.placeholder.com/200x300?text=Joker"
    },
    {
        name: "Titanic",
        image: "https://via.placeholder.com/200x300?text=Titanic"
    }
];

const container = document.getElementById("movie-container");
const search = document.getElementById("search");

function displayMovies(movieList){
    container.innerHTML="";

    movieList.forEach(movie=>{
        container.innerHTML += `
            <div class="movie-card" onclick="showPopup('${movie.name}')">
                <img src="${movie.image}">
                <h3>${movie.name}</h3>
            </div>
        `;
    });
}

displayMovies(movies);

search.addEventListener("keyup",()=>{
    const filtered = movies.filter(movie =>
        movie.name.toLowerCase().includes(search.value.toLowerCase())
    );

    displayMovies(filtered);
});

function showPopup(movieName){
    document.getElementById("popup").classList.remove("hidden");
    document.getElementById("popup-title").innerText = movieName;
}

function closePopup(){
    document.getElementById("popup").classList.add("hidden");
}

window.addEventListener("scroll",()=>{
    const nav=document.querySelector("nav");

    if(window.scrollY>50){
        nav.style.background="black";
    }else{
        nav.style.background="transparent";
    }
});

const heroImages = [
    "https://wallpaperaccess.com/full/2703652.png",
    "https://wallpaperaccess.com/full/329583.jpg",
    "https://wallpaperaccess.com/full/1567677.jpg"
];

let index = 0;

setInterval(()=>{
    index=(index+1)%heroImages.length;

    document.querySelector(".hero").style.backgroundImage=
    `url(${heroImages[index]})`;

},3000);