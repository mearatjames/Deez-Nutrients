$(document)
  .ready(function() {
    $('.ui.grid').hide()
    searchNews()
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
    for (let i = 0; i < response.Result.Tools.length; i++) {
    $('img.tools'+ (i+1)).attr('src', response.Result.Tools[i].ImageUrl)
    $('.header.tools'+ (i+1)).text(response.Result.Tools[i].Title)
    $('.meta.tools'+ (i+1)).text(response.Result.Tools[i].LastUpdated)
    }
    $('.ui.grid').show()
}
