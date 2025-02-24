let movies = [];

function loadMovies() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'movies.xml', true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            parseXML(xhr.responseXML);
        }
    };
    xhr.send();
}
w
function parseXML(xml) {
    const movieNodes = xml.getElementsByTagName('movie');
    movies = [];

    for (let i = 0; i < movieNodes.length; i++) {
        const title = movieNodes[i].getElementsByTagName('title')[0].textContent;
        const genre = movieNodes[i].getElementsByTagName('genre')[0].textContent;
        const image = movieNodes[i].getElementsByTagName('image')[0].textContent;
        const actors = movieNodes[i].getElementsByTagName('actors')[0].textContent;
        const description = movieNodes[i].getElementsByTagName('description')[0].textContent;
        const trailer = movieNodes[i].getElementsByTagName('trailer')[0].textContent;

        movies.push({ title, genre, image, actors, description, trailer });
    }

    displayMovies(movies); 
}

function filterByType() {
    const genreFilter = document.getElementById('genreFilter').value;
    const searchQuery = document.getElementById('searchBar').value.toLowerCase();

    const filteredMovies = movies.filter(movie => {
        const matchesGenre = genreFilter === 'all' || movie.genre === genreFilter;
        const matchesSearch = movie.title.toLowerCase().includes(searchQuery);
        return matchesGenre && matchesSearch;
    });

    displayMovies(filteredMovies);
}

function displayMovies(filteredMovies) {
    const movieContainer = document.getElementById('movieContainer');
    movieContainer.innerHTML = ''; 

    filteredMovies.forEach((movie, index) => {
        const movieElement = document.createElement('div');
        movieElement.className = 'movie-box';
        
    
        movieElement.onclick = function() {
            window.location.href = `film.html?id=${index}`; 
        };

        const imgElement = document.createElement('img');
        imgElement.src = movie.image; 
        imgElement.alt = movie.title; 
        imgElement.className = 'movie-image'; 

        const titleElement = document.createElement('h3');
        titleElement.innerText = movie.title; 

        movieElement.appendChild(imgElement);
        movieElement.appendChild(titleElement);
        movieContainer.appendChild(movieElement);
    });
}

function filterMovies() {
    filterByType(); 
}

function scrollMovies(direction) {
    const movieContainer = document.getElementById('movieContainer');
    const scrollAmount = 200; 

    if (direction === 'left') {
        movieContainer.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
        movieContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
}

window.onload = loadMovies;