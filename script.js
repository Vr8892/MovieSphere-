const movies = [
    {
        name: "Avatar",
        image: "https://via.placeholder.com/200x300?text=Avatar",
        description: "A paraplegic Marine dispatched to the moon Pandora on a unique mission becomes torn between following his orders and protecting the world he feels is his home."
    },
    {
        name: "Avengers",
        image: "https://via.placeholder.com/200x300?text=Avengers",
        description: "Earth's mightiest heroes must come together and learn to fight as a team if they are to stop the mischievous Loki and his alien army from enslaving humanity."
    },
    {
        name: "Joker",
        image: "https://via.placeholder.com/200x300?text=Joker",
        description: "In Gotham City, mentally troubled comedian Arthur Fleck is disregarded and mistreated by society. He then embarks on a downward spiral of revolution and bloody crime."
    },
    {
        name: "Titanic",
        image: "https://via.placeholder.com/200x300?text=Titanic",
        description: "A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the luxurious, ill-fated R.M.S. Titanic."
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
    const movie = movies.find(m => m.name === movieName);
    document.getElementById("popup").classList.remove("hidden");
    document.getElementById("popup-title").innerText = movie.name;
    document.querySelector(".popup-content p").innerText = movie.description;
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