$(document).ready(function () {
  var apikey = "trilogy";
  var movie;
  var year;
  var movieUrl;
  var movies;

  //load local storage data if avalable
  loadData();
  //When the search button is clicked it gets the giphy and the movies
  $("#search").on("click", function (e) {
    //e.preventDefault();
    year = $("#year").val().toLowerCase().trim();
    movie = $("#name").val().toLowerCase().trim();


    getGiphy(movie);
    if(parseInt(year))
    {
      movieUrl = "https://www.omdbapi.com/?apikey=" + apikey + "&s=" + movie + "&y=" + year;
    }else{
      movieUrl = "https://www.omdbapi.com/?apikey=" + apikey + "&s=" + movie;
    }e;

    $.ajax({
      url: movieUrl,
      method: "GET",
    }).then(function (data) {
      getDetails(data.Search[0].imdbID);
      displayMovie(data);
      saveData(movie);
      renderRcentSearch();
    });
  });

  // display the movie
  function displayMovie(movies) {
    var $movieDisplay = $("#movieDisplay");
    $movieDisplay.text("");
    var movieTitles = movies.Search;

    for (var i = 0; i < movieTitles.length; i++) {
      var $movieSection = $("<section>");

      var $moviePoster = $("<img>");
      $moviePoster.attr("src", movieTitles[i].Poster);
      $moviePoster.attr("alt", movieTitles[i].Title);

      var $movieImdbId = $("<span>");
      $movieImdbId.text(movieTitles[i].imdbID);

      $movieSection.append($moviePoster);
      $movieSection.append($movieImdbId);

      $movieDisplay.append($movieSection);
    }
  }

  // When any movie is clicked get the details of that movie
  $("#movieDisplay").on("click", function (e) {
    console.log(e.target);
    var targets = e.target;
    var imdbValue = targets.nextElementSibling.textContent;
    getDetails(imdbValue);
    window.location.href = "#welcome";
  });

  // The details of the movie is been displayed
  function getDetails(imdb) {
    var movieDetUrl = "https://www.omdbapi.com/?apikey=" + apikey + "&i=" + imdb;

    $.ajax({
      url: movieDetUrl,
      method: "GET",
    }).then(function (data) {
      //console.log(data);
      $("#imageSrc").attr("src", data.Poster);
      $("#title").text(data.Title);
      $("#ratings").text(data.imdbRating);
      $("#genres").text(data.Genre);
      $("#years").text(data.Year);
      $("#plot").text(data.Plot);
    });
  }
  //pass in movie name from users input
  function getGiphy(movie) {
    $("#giphy-slideshow").text("");
    var apiKey = "fResjSx9H2AXyanjzikBjzfnRcPYD8B5";

    var urlQuery = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${movie}&limit=9&offset=0&rating=pg&lang=en`;
    $.ajax({
      url: urlQuery,
      method: "GET",
    }).then(renderGiphy); //calls function to render the giphy
  }

  //render giphy in a slide show
  function renderGiphy(response) {
    for (var i = 0; i < response.data.length; i++) {
      var image = $("<img>");
      image.attr("src", response.data[i].images.original.url);
      UIkit.cover(image);
      var imageli = $("<li>");
      // imageli.addClass("uk-cover");
      imageli.append(image);
      $("#giphy-slideshow").append(imageli);
      $("#giphy").css("display", "block");
    }
  }
  //   saves data to local storage
  function saveData(movie) {
    movies.unshift(movie);
    localStorage.setItem("movies", JSON.stringify(movies));
  }
  //loads data from local storage
  function loadData() {
    movies = JSON.parse(localStorage.getItem("movies"));
    if (movies === null || movies === "") {
      movies = [];
      $("#recent-search").text("no history...");
      return;
    }
    renderRcentSearch(movies);
  }
  //render movie search
  function renderRcentSearch() {
    $("#recent-search").text("");
    for (var i = 0; i < movies.length; i++) {
      var movie = $("<p>");
      movie.text(movies[i]);
      movie.addClass("recent-movie");
      $("#recent-search").append(movie);
    }
  }
});
