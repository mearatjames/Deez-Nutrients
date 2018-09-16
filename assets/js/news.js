$(document)
  .ready(function() {
      $('.news').hide()
  })

$(document).on('click', '.category', function() {
    var categoryId = $(this).attr('data-id')
    searchNews(categoryId)
})
//Nutrients News API
let searchNews = function(categoryId) {
    let queryURL = "https://healthfinder.gov/FreeContent/Developer/Search.json?api_key=juxvvslophcumodn&CategoryID=" + categoryId
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
    $('.newsContent').append(`
    <div class="sixteen wide tablet six wide computer column">
        <div class="ui fluid centered card">
            <div class="content">
                <img class="ui small fluid right floated image" src="${response.Result.Tools[i].ImageUrl}">
                <a class="header" href="#">${response.Result.Tools[i].Title}</a>
                <p>${response.Result.Tools[i].LastUpdated}</p>
            </div>
        </div>
    </div>
    `)
    }
    for (let i = 0; i < response.Result.Topics.length; i++) {
        $('.newsContent').append(`
        <div class="sixteen wide tablet six wide computer column">
            <div class="ui fluid centered card">
                <div class="content">
                    <img class="ui small fluid right floated image" src="${response.Result.Topics[i].ImageUrl}">
                    <a class="header" href="#">${response.Result.Topics[i].Title}</a>
                    <p>${response.Result.Topics[i].LastUpdate}</p>
                </div>
            </div>
        </div>
        `)
    $('.hideItems').hide()
    $('.news').show()
    $('.ui.sticky').sticky({})
}
}