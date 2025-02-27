function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.get(name)
  }
  
  function showLoading() {
    const loadingScreen = document.querySelector(".loading-screen")
    loadingScreen.classList.remove("hidden")
  }
  
  function hideLoading() {
    const loadingScreen = document.querySelector(".loading-screen")
    loadingScreen.classList.add("hidden")
  }
  
  function loadMovieDetails() {
    showLoading()
    const movieId = getQueryParam("id")
  
    if (!movieId) {
      hideLoading()
      showError("Movie ID not found!")
      return
    }
  
    const xhr = new XMLHttpRequest()
    xhr.open("GET", "movies.xml", true)
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        hideLoading()
        if (xhr.status === 200 && xhr.responseXML) {
          const movie = getMovieById(xhr.responseXML, movieId)
          if (movie) {
            displayMovieDetails(movie)
          } else {
            showError("Movie not found!")
          }
        } else {
          showError("Error loading movie data!")
        }
      }
    }
    xhr.send()
  }
  
  function getMovieById(xml, movieId) {
    const movieNodes = xml.getElementsByTagName("movie")
    for (let i = 0; i < movieNodes.length; i++) {
      const id = movieNodes[i].getAttribute("id")
      if (id === movieId) {
        return {
          id,
          title: movieNodes[i].getElementsByTagName("title")[0].textContent,
          genre: movieNodes[i].getElementsByTagName("genre")[0].textContent,
          image: movieNodes[i].getElementsByTagName("image")[0].textContent,
          actors: movieNodes[i].getElementsByTagName("actors")[0].textContent,
          description: movieNodes[i].getElementsByTagName("description")[0].textContent,
          trailer: movieNodes[i].getElementsByTagName("trailer")[0].textContent,
          year: movieNodes[i].getElementsByTagName("year")?.[0]?.textContent || "N/A",
          rating: movieNodes[i].getElementsByTagName("rating")?.[0]?.textContent || "N/A",
        }
      }
    }
    return null
  }
  
  function displayMovieDetails(movie) {
    const movieDetailsContainer = document.getElementById("movieDetails")
  
    const content = `
          <div class="movie-details">
              <div class="poster-container">
                  <img 
                      src="${movie.image}" 
                      alt="${movie.title}" 
                      class="movie-poster"
                      loading="lazy"
                      onerror="this.src='placeholder.jpg'"
                  >
              </div>
              <div class="movie-info">
                  <div>
                      <h1 class="movie-title">${movie.title}</h1>
                      <div class="movie-meta">
                          <span class="genre-tag">${movie.genre}</span>
                          ${movie.year !== "N/A" ? `<span>${movie.year}</span>` : ""}
                          ${movie.rating !== "N/A" ? `<span>⭐ ${movie.rating}</span>` : ""}
                      </div>
                  </div>
                  
                  <p class="movie-description">${movie.description}</p>
                  
                  <div class="cast-section">
                      <h3 class="section-title">Cast</h3>
                      <p class="cast-list">${movie.actors}</p>
                  </div>
                  
                  <div class="trailer-container">
                      <iframe 
                          src="${movie.trailer}" 
                          frameborder="0" 
                          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" 
                          allowfullscreen
                      ></iframe>
                  </div>
              </div>
          </div>
      `
  
    movieDetailsContainer.innerHTML = content
  

    const videoBackground = document.getElementById("video-background")
    try {
    
      const videoId = movie.trailer.split("/").pop()
    
      videoBackground.src = `https://www.youtube.com/v/${videoId}`
    } catch (error) {
      console.error("Error setting up background video:", error)
      
    }
  }
  
  function showError(message) {
    const movieDetailsContainer = document.getElementById("movieDetails")
    movieDetailsContainer.innerHTML = `
          <div class="error-message">
              <h2>${message}</h2>
              <p>Please try again or return to the home page.</p>
          </div>
      `
  }
  
  document.addEventListener("DOMContentLoaded", loadMovieDetails)
  
  