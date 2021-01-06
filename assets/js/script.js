$(document).ready(function () {
  var apikey = "trilogy";
  var movie;
  var movieUrl;

  $("#search").on("click", function (e) {
    //e.preventDefault();
    movie = $("#name").val();
    console.log(movie);
    getGiphy(movie);
    movieUrl = "http://www.omdbapi.com/?apikey=" + apikey + "&s=" + movie;

    $.ajax({
      url: movieUrl,
      method: "GET",
    }).then(function (data) {
      //console.log(data);
      //console.log(data.Search[0].Poster);
      $("#imageSrc").attr("src",data.Search[0].Poster);
      getDetails(data.Search[0].imdbID);
      displayMovie(data);


    });
  });

  function displayMovie(movies)
  {
    var $movieDisplay = $("#movieDisplay");
    var movieTitles = movies.Search;

    for(var i = 1; i < movieTitles.length; i++){
      var $moviePoster = $("<img>");
      $moviePoster.attr("src", movieTitles[i].Poster);
      $movieDisplay.append($moviePoster);
    }

  }
  function getDetails(imdb){
    var movieDetUrl = "http://www.omdbapi.com/?apikey=" + apikey + "&i=" +imdb;

    $.ajax({
      url: movieDetUrl,
      method: "GET",
    }).then(function (data) {
      console.log(data);
      $("#title").text(data.Title);
      $("#ratings").text(data.imdbRating);
      $("#genres").text(data.Genre);
      $("#years").text(data.Year);
      $("#plot").text(data.Plot);
      //console.log(data.Search[0].Poster);
     
    });

  }
  //pass in movie name from users input
function getGiphy(movie)
{
    $("#giphy-slideshow").text("");
    var apiKey = "fResjSx9H2AXyanjzikBjzfnRcPYD8B5";
    
    var urlQuery = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${movie}&limit=9&offset=0&rating=pg&lang=en`
    $.ajax({
        url: urlQuery,
        method: "GET"   
    }).then(renderGiphy); //calls function to render the giphy
}

//render giphy in a slide show
function renderGiphy(response){
    for(var i=0; i<response.data.length; i++){
        var image = $("<img>");
        image.attr("src", response.data[i].images.original.url);
        UIkit.cover(image);
        var imageli = $("<li>");
        // imageli.addClass("uk-cover");
        imageli.append(image);
        $("#giphy-slideshow").append(imageli);
        $("#giphy").css("display","block");
    }
}

});
