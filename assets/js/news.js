$(document)
  .ready(function() {
    $('.ui.grid').hide()
    searchNews()
;
  })
//Nutrients News API
let searchNews = function() {
    let queryURL = "https://healthfinder.gov/FreeContent/Developer/Search.json?api_key=juxvvslophcumodn&CategoryID=16"
    $.ajax({
      url: queryURL,
      method: "GET"
    }).done(function(response) {
      display(response)
    });
  }

function display(response) {
    console.log(response.Result)
    $('img.tools1').attr('src', response.Result.Tools[0].ImageUrl)
    $('.tools1.header').text(response.Result.Tools[0].Title)
    $('.meta.tools1').text(response.Result.Tools[0].LastUpdated)
    $('.ui.grid').show()
}