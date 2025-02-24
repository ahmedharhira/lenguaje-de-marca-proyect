document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get("id");

    if (movieId) {
        fetch("movies.xml")
            .then(response => response.text())
            .then(data => {
                const parser = new DOMParser();
                const xml = parser.parseFromString(data, "application/xml");
                const movies = xml.getElementsByTagName("movie");

                for (let movie of movies) {
                    if (movie.getAttribute("id") === movieId) {
                        document.getElementById("movieTitle").textContent = movie.getElementsByTagName("title")[0].textContent;
                        document.getElementById("movieDescription").textContent = movie.getElementsByTagName("description")[0].textContent;
                        document.getElementById("movieTrailer").src = movie.getElementsByTagName("trailer")[0].textContent;
                        break;
                    }
                }
            })
            .catch(error => console.error("Error loading XML data:", error));
    }

    document.getElementById("likeButton").addEventListener("click", function () {
        alert("You liked this movie!");
    });
});
