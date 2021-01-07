$(document).ready(function () {
  var apikey = "trilogy";
  var movie;
  var movieUrl;

  //When the search button is clicked it gets the giphy and the movies
  $("#search").on("click", function (e) {
    //e.preventDefault();
    movie = $("#name").val();

    getGiphy(movie);
    movieUrl = "http://www.omdbapi.com/?apikey=" + apikey + "&s=" + movie;

    $.ajax({
      url: movieUrl,
      method: "GET",
    }).then(function (data) {
      getDetails(data.Search[0].imdbID);
      displayMovie(data);
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
    var movieDetUrl = "http://www.omdbapi.com/?apikey=" + apikey + "&i=" + imdb;

    $.ajax({
      url: movieDetUrl,
      method: "GET",
    }).then(function (data) {
      console.log(data);
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
    console.log(response);
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
});
