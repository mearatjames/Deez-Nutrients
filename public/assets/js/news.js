$(document)
  .ready(function() {
      $('.news').hide()
  })

//Search News
$(document).on('click', '.category', function() {
    let id = "CategoryID=" + $(this).attr('data-id')
    searchNews(id)
})

//Nutrients News API
let searchNews = function(id) {
    let queryURL = "https://healthfinder.gov/FreeContent/Developer/Search.json?api_key=juxvvslophcumodn&" + id
    $.ajax({
      url: queryURL,
      method: "GET"
    }).done(function(response) {
      display(response)
    });
  }

function display(response) {
    console.log(response.Result)
        topics(response)
        tools(response)
        $('.hideItems').hide()
        $('.news').show()
}

function topics(response) {
    console.log(moment(response.Result.Topics[0].LastUpdate).format("MMM Do YYYY"))
    for (let i = 0; i < response.Result.Topics.length; i++) {
        $('.newsContent').append(`
        <div class="sixteen wide tablet six wide computer column">
            <div class="ui fluid centered card">
                <div class="content">
                    <img class="ui small fluid right floated image" src="${response.Result.Topics[i].ImageUrl}">
                    <a data-id="TopicID=${response.Result.Topics[i].Id}" class="header readNews" href="#">${response.Result.Topics[i].Title}</a>
                    <p>${moment(response.Result.Topics[0].LastUpdate).format("MMM Do YYYY")}</p>
                </div>
            </div>
        </div>
        `)
    }
}
function tools(response) {
    if(response.Result.Tools == undefined) {
        return false 
    } else {
        for (let i = 0; i < response.Result.Tools.length; i++) {
        $('.newsContent').append(`
        <div class="sixteen wide tablet six wide computer column">
            <div class="ui fluid centered card">
                <div class="content">
                    <img class="ui small fluid right floated image" src="${response.Result.Tools[i].ImageUrl}">
                    <a data-id="ToolID=${response.Result.Tools[i].Id}" class="header readNews" href="#">${response.Result.Tools[i].Title}</a>
                    <p>${moment(response.Result.Tools[0].LastUpdated).format("MMM Do YYYY")}</p>
                </div>
            </div>
        </div>
        `)
        }
    }
}

//Back Btn Function
$(document).on('click', '#backBtn', function() {
    $('.newsContent').empty()
    $('.news').hide()
    $('.hideItems').show()
})

//Read News
$(document).on('click', '.readNews', function() {
    console.log("Clicked")
    let id = $(this).attr('data-id')
    readNews(id)
})

let readNews = function(id) {
    let queryURL = "https://healthfinder.gov/FreeContent/Developer/Search.json?api_key=juxvvslophcumodn&" + id
    $.ajax({
      url: queryURL,
      method: "GET"
    }).done(function(response) {
      read(response)
    });
  }

function read(response) {
    console.log(response)
    $('.newsContent').empty()
    if(response.Result.Tools == undefined) { 
        let content = response.Result.Topics
        console.log(content)
        $('.newsContent').append(`
            <div class="sixteen wide column">
                    <div class="content">
                        <img class="ui small fluid right floated image" src="${content.ImageUrl}">
                        <h1 class="newsTitle">${content.Title}</h1>
                        <p>${moment(content.LastUpdate).format("MMM Do YYYY")}</p>
                    </div>
            </div>
            `)
        content.Sections.forEach(element => {
            $('.newsContent').append(`
            <div class="ui vertical left aligned segment">
            <h1>${element.Title}</h1>
            <h3>${element.Description}</h3>
            <div>${element.Content}</div>
            </div>`)
        });
        $('.newsContent').append(`
        <div class="sixteen wide column right aligned">
        <a href="${content.HealthfinderUrl}">
        <span>Source</span>
        <img class="ui small right floated image" src="${content.HealthfinderLogo}"></a> 
        </div>
        `)
    } else {
        let content = response.Result.Tools
        console.log(content)
        $('.newsContent').append(`
            <div class="sixteen wide column">
                    <div class="content">
                        <img class="ui small fluid right floated image" src="${content.ImageUrl}">
                        <h1 class="newsTitle">${content.Title}</h1>
                        <p>${moment(content.LastUpdated).format("MMM Do YYYY")}</p>
                    </div>
            </div>
            <div class="ui vertical left aligned segment">
            <div>${content.Contents}</div>
            </div>
            <div class="sixteen wide column right aligned">
            <a href="${content.HealthfinderUrl}">
            <span>Source</span>
            <img class="ui small right floated image" src="${content.HealthfinderLogo}"></a> 
            </div>
            `) 
    }
}