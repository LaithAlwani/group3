$(document).ready(function () {
  var apikey = "trilogy";
  var movie;
  var year;
  var movieUrl;
  var movies;
  var searchBar = $("#search-bar");

  //load local storage data if avalable
  loadData();
  //When the search button is clicked it gets the giphy and the movies
  $("#search").on("click", function (e) {
    //e.preventDefault();
    year = $("#year").val().toLowerCase().trim();
    movie = $("#name").val().toLowerCase().trim();
    if(movie !=""){
      // UIkit.offcanvas(searchBar).hide();
    }

    getMovie(movie, year);

    
  });

  function getMovie(movie, year){
    if(parseInt(year))
    {
      movieUrl = "https://www.omdbapi.com/?apikey=" + apikey + "&s=" + movie + "&y=" + year;
    }else{
      movieUrl = "https://www.omdbapi.com/?apikey=" + apikey + "&s=" + movie;
    };

    $.ajax({
      url: movieUrl,
      method: "GET",
    }).then(function (data) {
      getDetails(data.Search[0].imdbID);
      displayMovie(data);
      getGiphy(movie);
      saveData(movie);
      renderRcentSearch();
    });
  }

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
      $("#related-movies").css("display", "block");
    }
  }

  // When any movie is clicked get the details of that movie
  $("#movieDisplay").on("click", function (e) {
    var targets = e.target;
    var imdbValue = targets.nextElementSibling.textContent;
    getDetails(imdbValue);
    window.location.href = "#movie-info";
  });

  // The details of the movie is been displayed
  function getDetails(imdb) {
    var movieDetUrl = "https://www.omdbapi.com/?apikey=" + apikey + "&i=" + imdb;

    $.ajax({
      url: movieDetUrl,
      method: "GET",
    }).then(function (data) {
      $("#imageSrc").attr("src", data.Poster);
      $("#title").text(data.Title);
      $("#ratings").text(data.imdbRating);
      $("#genres").text(data.Genre);
      $("#years").text(data.Year);
      $("#plot").text(data.Plot);
      $("#movie-info").css("display", "flex");
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
    for(var i=0;i <movies.length; i++){
        if(movie === movies[i]){
            movies.splice (i, 1);
        }
    }
    movies.unshift(movie);
    localStorage.setItem("movies", JSON.stringify(movies));
  }
  //loads data from local storage
  function loadData() {
    movies = JSON.parse(localStorage.getItem("movies"));
    if (movies === null || movies === "") {
      movies = [];
      $("#movie-info").css("display", "none");
      $("#related-movies").css("display", "none");
      $("#recent-search").text("no history...");
      return;
    }
    $("#welcome").css("display" , "none");
    renderRcentSearch();
    getMovie(movies[0]);
  }
  //render movie search
  function renderRcentSearch() {
    $("#recent-search").text("");
    if(movies.length>5){
        movies.length = 5;
    }
    for (var i = 0; i < movies.length; i++) {
      var movie = $("<a>");
      movie.text(movies[i]);
      movie.addClass("recent-movie");
      $("#recent-search").append(movie);
    }
  }

  $("#recent-search").click(function(e){
      getMovie(e.target.textContent);
      UIkit.offcanvas(searchBar).hide()
  })

  $("#name").click(function(){
    $("#name").val("");
  })
});
