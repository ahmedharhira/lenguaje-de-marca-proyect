let movies = []

function loadMovies() {
  const xhr = new XMLHttpRequest()
  xhr.open("GET", "movies.xml", true)
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
      if (xhr.status === 200 && xhr.responseXML) {
        parseXML(xhr.responseXML)
      } else {
        console.error("Error loading XML file")
      }
    }
  }
  xhr.send()
}

function parseXML(xml) {
  const movieNodes = xml.getElementsByTagName("movie")
  movies = []

  for (let i = 0; i < movieNodes.length; i++) {
    const id = movieNodes[i].getAttribute("id")
    const title = movieNodes[i].getElementsByTagName("title")[0].textContent
    const genre = movieNodes[i].getElementsByTagName("genre")[0].textContent
    const image = movieNodes[i].getElementsByTagName("image")[0].textContent
    const actors = movieNodes[i].getElementsByTagName("actors")[0].textContent
    const description = movieNodes[i].getElementsByTagName("description")[0].textContent
    const trailer = movieNodes[i].getElementsByTagName("trailer")[0].textContent

    movies.push({ id, title, genre, image, actors, description, trailer })
  }

  displayMovies(movies)
}

function filterMovies() {
  const genreFilter = document.getElementById("genreFilter").value
  const searchQuery = document.getElementById("searchBar").value.toLowerCase()

  const filteredMovies = movies.filter((movie) => {
    const matchesGenre = genreFilter === "all" || movie.genre === genreFilter
    const matchesSearch = movie.title.toLowerCase().includes(searchQuery)
    return matchesGenre && matchesSearch
  })

  displayMovies(filteredMovies)
}

function displayMovies(filteredMovies) {
  const movieContainer = document.getElementById("movieContainer")
  movieContainer.innerHTML = ""

  filteredMovies.forEach((movie) => {
    const movieElement = document.createElement("div")
    movieElement.className = "movie-box"

    movieElement.onclick = () => {
      window.location.href = `movie-details.html?id=${movie.id}`
    }

    // Create image container to maintain aspect ratio
    const imageContainer = document.createElement("div")
    imageContainer.className = "movie-image-container"

    const imgElement = document.createElement("img")
    imgElement.src = movie.image
    imgElement.alt = movie.title
    imgElement.className = "movie-poster"

    // Add error handling for images
    imgElement.onerror = function () {
      this.src = "placeholder.jpg" // Fallback image
      console.log(`Failed to load image for ${movie.title}`)
    }

    const titleElement = document.createElement("h3")
    titleElement.innerText = movie.title

    const genreElement = document.createElement("p")
    genreElement.className = "movie-genre"
    genreElement.innerText = movie.genre

    imageContainer.appendChild(imgElement)
    movieElement.appendChild(imageContainer)
    movieElement.appendChild(titleElement)
    movieElement.appendChild(genreElement)
    movieContainer.appendChild(movieElement)
  })
}

function scrollMovies(direction) {
  const movieContainer = document.getElementById("movieContainer")
  const scrollAmount = 300 // Increased for better scrolling

  if (direction === "left") {
    movieContainer.scrollBy({ left: -scrollAmount, behavior: "smooth" })
  } else {
    movieContainer.scrollBy({ left: scrollAmount, behavior: "smooth" })
  }
}

function loadMovieDetails() {
  const urlParams = new URLSearchParams(window.location.search)
  const movieId = urlParams.get("id")

  if (!movieId) {
    console.error("Movie ID not found in the URL")
    document.getElementById("movie-details-container").innerHTML = "<p>Movie not found</p>"
    return
  }

  // If movies array is empty, we need to load the XML first
  if (movies.length === 0) {
    const xhr = new XMLHttpRequest()
    xhr.open("GET", "movies.xml", true)
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200 && xhr.responseXML) {
          parseXML(xhr.responseXML)
          displayMovieDetails(movieId)
        } else {
          console.error("Error loading XML file")
        }
      }
    }
    xhr.send()
  } else {
    displayMovieDetails(movieId)
  }
}

function displayMovieDetails(movieId) {
  const movie = movies.find((movie) => movie.id === movieId)

  if (movie) {
    document.getElementById("movie-title").textContent = movie.title
    document.getElementById("movie-genre").textContent = movie.genre
    document.getElementById("movie-actors").textContent = movie.actors
    document.getElementById("movie-description").textContent = movie.description

    const movieImage = document.getElementById("movie-image")
    movieImage.src = movie.image
    movieImage.alt = movie.title
    movieImage.className = "movie-poster-large"

    // Add error handling for the image
    movieImage.onerror = function () {
      this.src = "placeholder.jpg" // Fallback image
      console.log(`Failed to load image for ${movie.title}`)
    }

    // Set up the trailer iframe
    const trailerFrame = document.getElementById("movie-trailer")
    if (trailerFrame && movie.trailer) {
      trailerFrame.src = movie.trailer
    }
  } else {
    console.error("Movie not found")
    document.getElementById("movie-details-container").innerHTML = "<p>Movie not found</p>"
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Set up event listeners for filter and search
  const genreFilter = document.getElementById("genreFilter")
  const searchBar = document.getElementById("searchBar")

  if (genreFilter) {
    genreFilter.addEventListener("change", filterMovies)
  }

  if (searchBar) {
    searchBar.addEventListener("input", filterMovies)
  }

  // Load movies on the main page
  if (window.location.pathname.includes("index.html") || !window.location.pathname.includes("movie-details.html")) {
    loadMovies()

    // Set up scroll buttons
    const leftButton = document.getElementById("scrollLeft")
    const rightButton = document.getElementById("scrollRight")

    if (leftButton) {
      leftButton.addEventListener("click", () => {
        scrollMovies("left")
      })
    }

    if (rightButton) {
      rightButton.addEventListener("click", () => {
        scrollMovies("right")
      })
    }
  }

  // Load movie details on the details page
  if (window.location.pathname.includes("movie-details.html")) {
    loadMovieDetails()
  }
})

