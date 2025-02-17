let scrollPosition = 0; 
const boxWidth = 300; 
const gap = 20; 

function scrollMovies(direction) {
    const container = document.getElementById('movieContainer');
    const containerWidth = container.offsetWidth;
    const totalScrollableWidth = container.scrollWidth - containerWidth;

    if (direction === 'left') {
      
        scrollPosition = Math.max(scrollPosition - (boxWidth + gap), 0);
    } else if (direction === 'right') {
    
        scrollPosition = Math.min(scrollPosition + (boxWidth + gap), totalScrollableWidth);
    }

    container.style.transform = `translateX(-${scrollPosition}px)`;
}
function filterByType() {
    const genreFilter = document.getElementById('genreFilter').value.toLowerCase();
    const movieBoxes = document.querySelectorAll('.movie-box');

    movieBoxes.forEach(box => {
        const type = box.querySelector('p strong').innerText.toLowerCase(); 
        box.style.display = type.includes(genreFilter) || genreFilter === '' ? '' : 'none';
    });
}
function filterMovies() {
    const searchBar = document.getElementById('searchBar');
    const genreFilter = document.getElementById('genreFilter').value.toLowerCase();
    const filter = searchBar.value.toLowerCase().trim();
    const movieBoxes = document.querySelectorAll('.movie-box');

    movieBoxes.forEach(box => {
        const title = box.querySelector('h3').innerText.toLowerCase();
        const type = box.querySelector('p strong').innerText.toLowerCase();

       
        const matchesTitle = title.includes(filter);
        const matchesType = type.includes(genreFilter) || genreFilter === '';

        box.style.display = matchesTitle && matchesType ? '' : 'none';
    });
}


async function loadMovies() {
    try {
        const response = await fetch('peliculas.xml');
        if (!response.ok) throw new Error('No se pudo cargar el archivo XML.');
        const xmlText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "text/xml");
        const movies = xmlDoc.getElementsByTagName('pelicula');
        const movieContainer = document.getElementById('movieContainer');
        movieContainer.innerHTML = ''; 

       
        const genres = new Set();
        for (let movie of movies) {
            const type = movie.getElementsByTagName('type')[0]?.textContent || 'Género no especificado';
            type.split(',').forEach(genre => genres.add(genre.trim()));
        }


        const genreFilter = document.getElementById('genreFilter');
        genreFilter.innerHTML = '<option value="">Todos</option>';
        genres.forEach(genre => {
            const option = document.createElement('option');
            option.value = genre;
            option.textContent = genre;
            genreFilter.appendChild(option);
        });

       
        for (let movie of movies) {
            const title = movie.getElementsByTagName('titulo')[0]?.textContent || 'Título no disponible';
            const type = movie.getElementsByTagName('type')[0]?.textContent || 'Género no especificado';
            const description = movie.getElementsByTagName('descripcion')[0]?.textContent || 'Sin descripción';
            const actors = Array.from(movie.getElementsByTagName('actor') || []).map(actor => actor.textContent).join(', ') || 'Actores no disponibles';
            const year = movie.getElementsByTagName('anio')[0]?.textContent || 'Año desconocido';
            const image = movie.getElementsByTagName('imagen')[0]?.textContent || 'https://via.placeholder.com/300';

            const movieId = title.replace(/\s+/g, '-').toLowerCase();
            const movieBox = document.createElement('div');
            movieBox.className = 'movie-box';
            movieBox.innerHTML = `
                <img src="${image}" alt="${title}" class="movie-image">
                <h3>${title} (${year})</h3>
                <p><strong>Género:</strong> ${type}</p>
            `;

            const movieLink = document.createElement('a');
            movieLink.href = `movie-details.html?id=${movieId}`;
            movieLink.appendChild(movieBox);

            movieContainer.appendChild(movieLink);
        }
    } catch (error) {
        console.error('Error loading XML:', error);
        showError('Ocurrió un error al cargar las películas. Por favor, inténtalo de nuevo.');
    }
}
 

function showError(message) {
    const movieContainer = document.getElementById('movieContainer');
    movieContainer.innerHTML = `<p style="color: red; text-align: center;">${message}</p>`;
}


window.onload = () => {
    const movieContainer = document.getElementById('movieContainer');
    movieContainer.innerHTML = '<p style="text-align: center;">Cargando películas...</p>';
    loadMovies();
};