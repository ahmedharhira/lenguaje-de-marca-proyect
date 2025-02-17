
async function loadMovieDetails() {
    try {
       
        const params = new URLSearchParams(window.location.search);
        const movieId = params.get('id');

        if (!movieId) {
            throw new Error('ID de película no encontrado.');
        }

     
        const response = await fetch('peliculas.xml');
        if (!response.ok) throw new Error('No se pudo cargar el archivo XML.');
        const xmlText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "text/xml");
        const movies = xmlDoc.getElementsByTagName('pelicula');

        let selectedMovie = null;

      
        for (let movie of movies) {
            const title = movie.getElementsByTagName('titulo')[0]?.textContent || 'Título no disponible';
            const movieSlug = title.replace(/\s+/g, '-').toLowerCase();

            if (movieSlug === movieId) {
                selectedMovie = movie;
                break;
            }
        }

        if (!selectedMovie) {
            throw new Error('Película no encontrada.');
        }

      
        const title = selectedMovie.getElementsByTagName('titulo')[0]?.textContent || 'Título no disponible';
        const type = selectedMovie.getElementsByTagName('type')[0]?.textContent || 'Género no especificado';
        const description = selectedMovie.getElementsByTagName('descripcion')[0]?.textContent || 'Sin descripción';
        const actors = Array.from(selectedMovie.getElementsByTagName('actor') || []).map(actor => actor.textContent).join(', ') || 'Actores no disponibles';
        const year = selectedMovie.getElementsByTagName('anio')[0]?.textContent || 'Año desconocido';
        const image = selectedMovie.getElementsByTagName('imagen')[0]?.textContent || 'https://via.placeholder.com/300';

      
        const movieDetails = document.getElementById('movieDetails');
        movieDetails.innerHTML = `
            <section class="movie-detail-container">
                <img src="${image}" alt="${title}" class="movie-detail-image">
                <div class="movie-detail-info">
                    <h1>${title} (${year})</h1>
                    <p><strong>Género:</strong> ${type}</p>
                    <p><strong>Descripción:</strong> ${description}</p>
                    <p><strong>Actores:</strong> ${actors}</p>
                </div>
            </section>
        `;
    } catch (error) {
        console.error('Error loading movie details:', error);
        const movieDetails = document.getElementById('movieDetails');
        movieDetails.innerHTML = `<p style="color: red;">Ocurrió un error al cargar los detalles de la película.</p>`;
    } finally {
      
        const loadingIndicator = document.querySelector('.loading-indicator');
        if (loadingIndicator) loadingIndicator.remove();
    }
}


window.onload = loadMovieDetails;