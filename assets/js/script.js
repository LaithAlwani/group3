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
