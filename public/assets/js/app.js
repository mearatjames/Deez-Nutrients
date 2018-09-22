function on() {
  document.getElementById("overlay").style.display = "block";
}

function off() {
  document.getElementById("overlay").style.display = "none";
}

$(document).on('click', '.sidebar a', function() {
  window.location.replace("$(this).attr('href')")
})

$(document).ready(function() {
    // create sidebar and attach to menu open
    $('.ui.sidebar')
      .sidebar('attach events', '.toc.item')
    ;
    $('.main').hide()
;
  })

//Toggle Modal
$(document).on('click', '.food .item', function() {
  $('#nutritionModal')
  .modal('toggle');
})


$(document).on('click','#adduserItem', function() {
  $('.nutError').remove()
  if($('#foodName').text() === ''){
    ('#nutritionModal .actions').append(`
        <div class="ui error message nutError">An Error has occured, please close this modal and retry.</div>
      `)
  }else{
    if($('#addUserItem').hasClass('red')){
      $('#loginModal').modal('show')
    }else{
      if($('#servingQty').val()){
        //addItem(
          // itemname,
          // serving_unit
          // serving_qty, 
          // calories, 
          // total_fat, 
          // total_carbs, 
          // protein
        //)
        fb.addItem(
          $('#foodName').text(),
          $('#servingQty').val(), 
          $('#servingUnit').text(),
          $('#calories').text(), 
          $('#totalFat').text(),
          $('#totalCarbs').text(),
          $('#protein').text()
        )
        $('.longer.modal').modal('hide')
      }else{
        $('#nutritionModal .actions').append(`
          <div class="ui error message nutError">Serving Size input is required.</div>
        `)
      }
    }
  }
})

//login modal
$(document).on('click', '.hLogin', function() {
  $('#loginModal').modal('toggle')
})


//logout modal
$(document).on('click', '.hLogout', function() {
  let str = localStorage.getItem('user_data').split(',')
  $('.logoutModalHeader').html(`${str[2]}, Logging Out? We Hope To See You Soon!`)
  $('#logoutModal').modal('toggle')
})

$(document).on('click', '#login', function() {
  let username = $('#username').val().trim()
  let password = $('#password').val().trim()
  $('#form1 .message').empty()

  if(!username){
    $('#loginModal #form1').form('add errors', {
      email: 'Username field is empty',
    })
  }else{
      db.ref('/user/' + username).once('value', function(snapshot){
          if(snapshot.val()){ 
            if(!password){
              $('#loginModal #form1').form('add errors', {
                email: 'Password field is empty',
              })
            }else{
              if(snapshot.val().password === password){
                  localStorage.setItem('user_data', `${username},${password},${snapshot.val().name}, ${snapshot.val().avatar}`)
                  $('#loginModal ').modal('hide');
                  user.login()
              }else{
                $('#loginModal #form1').form('add errors', {
                  email: 'Password is incorrect',
                })
              }
            }
          }else{
            $('#loginModal #form1').form('add errors', {
              email: 'Username does not exist',
            })
          }
      })
    }
})

$('#loginModal #form1').form({
  on: 'change',
  fields: {
    username: {
      identifier: 'username',
      rules: [
        {
          type: 'empty',
          prompt: 'Username can not be empty'
        }
      ]
    },
    password: {
      identifier: 'password',
      rules: [
        {
          type: 'empty',
          prompt: 'Password can not be empty'
        }
      ]
    }
  }
})

$('#loginModal #form2').form({
  on: 'change',
  fields: {
    rusername: {
      identifier: 'rusername',
      rules: [
        {
          type: 'empty',
          prompt: 'Username can not be empty'
        }
      ]
    },
    rpassword: {
      identifier: 'rpassword',
      rules: [
        {
          type: 'empty',
          prompt: 'Password can not be empty'
        }
      ]
    },
    name: {
      identifier: 'rname',
      rules: [
        {
          type: 'empty',
          prompt: 'Name can not be empty'
        }
      ]
    }
  }
})

$('#avatar').dropdown()

$(document).on('click', '#register', function() {
  let username = $('#rusername').val().trim()
  let password = $('#rpassword').val().trim()
  let name = $('#rname').val().trim()
  let avatar = $( "#chosenone" ).val()
  $('#form2 .message').empty()

  userRef.once('value', function(snapshot) {
      let issues = 0
      let issuekp = {}
      if(!username){
        issuekp.uname1 = 'Username field is empty'
        issues++
      }else if(snapshot.hasChild(username)) {
        issuekp.uname2 = `Username "${username}" is already taken.`
        issues++
      }
      if(!password){
        issuekp.pwd1 = 'Password field is empty'
        issues++
      }
      if(!name){
        issuekp.name1 = 'Name field is empty'
        issues++
      }
      if($( "#chosenone" ).val() === ''){
        issuekp.avatar = 'Choose an avatar'
        issues++
      }
      if(issues > 0){
        $('#loginModal #form2').form('add errors', issuekp)
      }else{
        localStorage.setItem('user_data', `${username},${password},${name}, ${avatar}`)
        $('#loginModal ').modal('hide')
        user.addUser(username, password, name, avatar)
        user.login()
      }
  })
})


//Nutritients Search Eventlistener
$(document).on('click', 'div.nutritionSearch', function() {
  let str = ($(this).find('a.header').text())
  nutObj.getItem(str)
})

//Nutritients Search Item Modal Eventlistener
$(document).on('keyup', '#servingQty', function() {
  if($('#servingQty').val()){
    nutObj.getItem($('#foodName').text(), $('#servingQty').val())
  }else{
    $('#servingQty').attr('value', '')
    $('#servingUnit').text('')
    $('#servingWeightGrams').text('')
    $('#calories').text('')
    $('#fatCal').text('')
    $('#totalFat').text('')
    $('#totalFatPercent').text('')
    $('#satFat').text('')
    $('#satFatPercent').text('')
    $('#transFat').text('')
    $('#cholesterol').text('')
    $('#cholesterolPercent').text('')
    $('#sodium').text('')
    $('#sodiumPercent').text('')
    $('#totalCarbs').text('')
    $('#totalCarbsPercent').text('')
    $('#fiber').text('')
    $('#fiberPercent').text('')
    $('#sugar').text('')
    $('#protein').text('')
  }
})


//Search List Eventlistener
$(document).on('click', '#search', function() {
  $('#myVideo').remove()
  $(".brand img").fadeTo(1,1, function() {
    $(".brand img").attr("src","assets/images/logoo.png")
  }).fadeTo(10000,1);
  $('.brand').animate({
    margin: "14px 0px 20px 0px"
  }, 1000)
  $('.brand h1').animate({
    color: '#000'
  }, 1000)
  $('.brand h1').animate({
    color: '#000'
  }, 1000)
  $( "#overlay" ).fadeOut( "highlight" )

  let url = 'assets/images/sushi.jpg'
  $('.bgfood').css('background', 'url('+ url +')')
  $('.bgfood').addClass('boxshadow')
  $('#spacerabovethefooter').css('background', 'url('+ url +')')
})
$(document).on('keyup', '#search', search)

//Search Function
function search() {
  $('.main').show()
  let str = $(this).val().trim()
  nutObj.getItemList(str)
}

//If user login, then display info in tracker.html and draw chart
function displayTracker() {
  $('#trackerContent').show()
  let user = localStorage.getItem('user_data').split(',')
  $('#trackerUser').text(user[2])
  fb.getUserItems()

}

//Draw Stacked Column Chart Still testing
function drawColumnChart(columnArr) {
  var data = google.visualization.arrayToDataTable([
    ['Calories Source', 'Protein', 'Carbs', 'Fat'],
    columnArr[0],
    columnArr[1],
    columnArr[2],
    columnArr[3],
    columnArr[4],
    columnArr[5],
    columnArr[6],
  ]);

  var options = {
    animation: {
      startup: true,
      duration: 1000,
      easing: 'out',
    },
    legend: { position: 'top', maxLines: 3 },
    bar: { groupWidth: '75%' },
    vAxis: {
      title: 'Total Calories'
    },
    isStacked: true,
  };
  var chart = new google.visualization.ColumnChart(document.getElementById('columnChart'));
  chart.draw(data, options)
}

//Draw Pie Chart
function drawChart(proteinCal, carbsCal, fatCal) {
        var data = google.visualization.arrayToDataTable([
          ['Source', 'Percentage'],
          ['Protein',  proteinCal],
          ['Carbs',  carbsCal],
          ['Fat',  fatCal],
        ]);

        var options = {
          title: 'Source of Calories',
        };

        var chart = new google.visualization.PieChart(document.getElementById('piechart'));

        chart.draw(data, options);
}
// Initialize Firebase

var config = {
apiKey: "AIzaSyC6z6KejFb66xYspFuNS9nZ8lHbDop_luI",
authDomain: "vitamind-b6c3c.firebaseapp.com",
databaseURL: "https://vitamind-b6c3c.firebaseio.com",
projectId: "vitamind-b6c3c",
storageBucket: "vitamind-b6c3c.appspot.com",
messagingSenderId: "870980303877"
}
firebase.initializeApp(config)

const db = firebase.database()
const userRef = db.ref('user')
const itemRef = db.ref('item')

let nutObj = {
    // retrieves a singular item from the nutrionix api
    getItem (str, size) {
        if (!size){
          size = 1
        }
        var settings = {
            url: 'https://trackapi.nutritionix.com/v2/natural/nutrients',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'x-app-id': '09072860',
                'x-app-key': 'ac0d861ef12c1bea37ed77506c777e83',
                'x-remote-user-id': '1'
            },
            processData: false,
            data: `{
              "query": "${size} ${str}"
            }`
        }
        $.ajax(settings).done(function (response) {
            let foodName = response.foods[0].food_name
            let protein = Math.round(response.foods[0].nf_protein)
            let totalFat = Math.round(response.foods[0].nf_total_fat)
            let totalCarbs = Math.round(response.foods[0].nf_total_carbohydrate)
            let sodium = Math.round(response.foods[0].nf_sodium)
            let sugar = Math.round(response.foods[0].nf_sugars)
            let cholesterol = Math.round(response.foods[0].nf_cholesterol)
            let calories = Math.round(response.foods[0].nf_calories)
            let fiber = Math.round(response.foods[0].nf_dietary_fiber)
            let satFat = Math.round(response.foods[0].nf_saturated_fat)
            let transFat
            function attr_id() {
                for (let i = 0; i < response.foods[0].full_nutrients.length; i++) {
                    if (response.foods[0].full_nutrients[i].attr_id == 605) {
                        transFat = Math.round(response.foods[0].full_nutrients[i].value)
                        return transFat
                    } else {
                        return transFat = 0
                    }
                }
            }
            attr_id()
            let proteinCal = protein * 4
            let fatCal = totalFat * 9
            let carbsCal = totalCarbs * 4
            
            $('#foodName').text(foodName.charAt(0).toUpperCase() + foodName.slice(1))
            $('#servingQty').attr('value', response.foods[0].serving_qty)
            $('#servingUnit').text(response.foods[0].serving_unit)
            $('#servingWeightGrams').text(response.foods[0].serving_weight_grams)
            $('#calories').text(calories)
            $('#fatCal').text(fatCal)
            $('#totalFat').text(totalFat)
            $('#totalFatPercent').text(Math.round((totalFat / 65)*100))
            $('#satFat').text(satFat)
            $('#satFatPercent').text(Math.round((satFat / 20)*100))
            $('#transFat').text(transFat)
            $('#cholesterol').text(cholesterol)
            $('#cholesterolPercent').text(Math.round((cholesterol / 300)*100))
            $('#sodium').text(sodium)
            $('#sodiumPercent').text(Math.round((sodium / 2400)*100))
            $('#totalCarbs').text(totalCarbs)
            $('#totalCarbsPercent').text(Math.round((totalCarbs / 300)*100))
            $('#fiber').text(fiber)
            $('#fiberPercent').text(Math.round((fiber / 25)*100))
            $('#sugar').text(sugar)
            $('#protein').text(protein)
            google.charts.load('current', {'packages':['corechart']});
            google.charts.setOnLoadCallback(function() {
              drawChart(proteinCal, carbsCal, fatCal)
            });
        })
    },
    // retrieves a list of related items to keyword from the nutrionix api
    // might not have specifics so you might need to use getItem(str) with the string found
    getItemList(str) {
        var settings2 = {
            url: 'https://trackapi.nutritionix.com/v2/search/instant?query=' + str,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'x-app-id': '09072860',
                'x-app-key': 'ac0d861ef12c1bea37ed77506c777e83',
            },
            processData: false
            }

        $.ajax(settings2).done(function (response) {
          $('#commonFoods').empty()
          $('#brandedFoods').empty()
          let clist = []        
          let i = 0
          let iindex = 0
          let photo

          while(i < 4 && iindex < 20) {
              if((clist.indexOf(response.common[iindex].tag_id) === -1)){
                photo = response.common[iindex].photo.thumb ? response.common[iindex].photo.thumb : 'assets/images/thumbnail.png'
                $('#commonFoods').append(`
                <div class="nutritionSearch item">
                    <img class="ui avatar image" src="${photo}">
                    <div class="content">
                        <a data-id="${response.common[iindex].tag_id}" class="header">${response.common[iindex].food_name.charAt(0).toUpperCase() + response.common[iindex].food_name.slice(1)}</a>
                    </div>
                </div>
                `)
                clist.push(response.common[iindex].tag_id)
                i++
              }
              iindex++
          }

          for (let i = 0; i < 4; i++) {
            photo = response.branded[i].photo.thumb ? response.branded[i].photo.thumb : 'assets/images/thumbnail.png'
            $('#brandedFoods').append(`
            <div class="nutritionSearch item">
                <img class="ui avatar image" src="${photo}">
                <div class="content">
                    <a data-id="${response.branded[i].nix_item_id}" class="header">${response.branded[i].brand_name_item_name.charAt(0).toUpperCase() + response.branded[i].brand_name_item_name.slice(1)}</a>
                </div>
            </div>
            `)
          }
        })
    }
}

let user = {
  login () {
    $('.hLogin').html('Logout')
    $('.hLogin').addClass('hLogout')
    $('.hLogin').removeClass('hLogin')


    $('.sidebar').removeClass('uncover visible')
    $('.pusher').removeClass('dimmed')
    $('.pushable a').eq(4).addClass('hLogout')
    $('.pushable a').eq(4).removeClass('hLogin')
    $('.pushable a').eq(4).html('Logout')

    $('#adduserItem').removeClass('red')
    $('#adduserItem').addClass('green')
    $('#adduserItem').html(`Add
    <i class="checkmark icon"></i>`)
    //For Tracker.html
    displayTracker()
  },
  logout () {
    $('.hLogout').html('Login / Sign Up')
    $('.hLogout').addClass('hLogin')
    $('.hLogout').removeClass('hLogout')

    $('.sidebar').removeClass('uncover visible')
    $('.pusher').removeClass('dimmed')
    $('.pushable a').eq(4).addClass('hLogin')
    $('.pushable a').eq(4).removeClass('hLogout')
    $('.pushable a').eq(4).html('Login / Sign Up')

    $('#adduserItem').addClass('red')
    $('#adduserItem').removeClass('green')
    $('#adduserItem').html(`Login to Add to Your Tracker
    <i class="user icon"></i>`)
  //Show LoginRequired Message and hide content
    $('#loginRequired').modal('show')
    $('#trackerContent').hide()

    localStorage.setItem('user_data', ``)
  },
  addUser (uname, pwd, n) {
      userRef.once('value', function(snapshot) {
          if (snapshot.hasChild(uname)) {
            alert('your user name exists. this alert needs to be refactored into on page textbox validation')
          }else{
              userRef.child(uname).set({
                  password: pwd,
                  name: n
              })
          }
      })
  },
  // checks local storage for a user and password str = 'user,pwd'
  authUser () {
    if(!localStorage.getItem('user_data')) {
      $('.pushable a').eq(4).addClass('hLogin')
      user.logout()
      return false
    }else{
      let user = localStorage.getItem('user_data').split(',')
      this.checkDB(user[0],user[1])
    }
  },
  // checks db to see if user exists, if so return true, else false
  checkDB (username, password) {
      db.ref('/user/' + username).once('value', function(snapshot){
          if(snapshot.val()){                
              if(snapshot.val().password === password){
                  $('.pushable a').eq(4).addClass('hLogout')
                  user.login()
                  return true
              }else{
                  $('.pushable a').eq(4).addClass('hLogin')
                  user.logout()
                  return false
              }
          }else{
              alert("FATAL: user does not exist, cannot verify")
              user.logout()
              $('.pushable a').eq(4).addClass('hLogin')
          }
      })
  },
  
  // get name of user's name by searching db for username
  getName(){
      let str = localStorage.getItem('user_data').split(',')
      return str[2]
  },
  getUser(){
      let str = localStorage.getItem('user_data').split(',')
      return str[0]
  }
}

let fb = {
  // gets all user items; d is in the format: "YYYY/MM/DD A hh:mm"
  getUserItems(d){
    let str = localStorage.getItem('user_data').split(',')
    let username = str[0]
    
    itemRef.orderByChild('date')
      .once("value", function(snapshot) {
        let user_items = []
        snapshot.forEach(function(childSnapshot) {
          var childData = childSnapshot.val()
          if(childData.username === username){
            //if date doesnt exist we push everything for that logged in user, 
            //else we push specified date
            if(!d){
              user_items.push(childData)
            }else if(childData.date === d){
              user_items.push(childData)
            }
          }
        })
        displayItem(user_items)
      })
  },
  addItem(itemname, serving_qty, serving_unit, calories, total_fat, total_carbs, protein){
      var today = moment().format("YYYY/MM/DD A hh:mm")
      itemRef.push({
          date: today,
          username: user.getUser(),
          name: itemname,
          servings: serving_qty,
          serving_unit: serving_unit,
          calories: calories,
          fat: total_fat,
          carbs: total_carbs,
          protein: protein
      })
  }
}

//Display Items to tracker
function displayItem(user_items) {
  let columnArr = []
  for (let i = 0; i < 7; i++) {
    let totalArr = []
    let dayArr = []
    let dailyCal = 0
    let appendDate = false

    for (let j = 0; j < user_items.length; j++) {
      let eatenDate = moment(user_items[j].date, "YYYY/MM/DD A hh:mm").format("MM/DD/YYYY")
      if (eatenDate == moment().subtract(i, 'days').format("MM/DD/YYYY")) {
        dailyCal += parseInt(user_items[j].calories)
        if(!appendDate){
          appendDate = true
          let dateStr = moment(eatenDate).format("dddd, MM/DD/YYYY")
          if (i == 0) {
            dateStr = "Today"
          }
          $('#detailList').append(`
          <div class="ui center aligned header">
            <div style="height: 20px"></div>
            <h3 id="#day${i}">${dateStr}</h3>
            <p class="dailyCal2 day${i}"></p>
          </div>
          `)
        }
        $(`.dailyCal2.day${i}`).html("Total Calories: " + dailyCal)
        $('#detailList').append(`
        <div class='ui sixteen wide column card'>
        <div class='content'>
          <div class='header'>${user_items[j].servings} ${user_items[j].serving_unit} of ${user_items[j].name}</div>
          <div class='meta'>${user_items[j].calories} calories</div>
          <div class='description'>
          ${moment(user_items[j].date, "YYYY/MM/DD A hh:mm").format("MM/DD/YYYY hh:mm A")}
          </div>
        </div>
      </div>
        `)
        totalArr.unshift(user_items[j])  
      }
    }
    let totalFat = 0
    let totalCarbs = 0
    let totalProtein = 0
    for (let k = 0; k < totalArr.length; k++) {
    totalFat += parseInt(totalArr[k].fat)
    totalCarbs += parseInt(totalArr[k].carbs)
    totalProtein += parseInt(totalArr[k].protein)
    dailyCal += parseInt(totalArr[k].calories)
    }
    
    dayArr.push(moment().subtract(i, 'days').format("ddd"), totalFat * 9, totalCarbs * 4, totalProtein * 4)
    columnArr.unshift(dayArr)
  }

  
 
  let todayCal = columnArr[6][1] + columnArr[6][2] + columnArr[6][3]
  $('.dailyCal').text(todayCal)
 

  //If there's a #columnChart, then draw the chart (prevent google draw chart to run on other page)
  let columnChart = document.getElementById('columnChart')
  if (columnChart) {
  google.charts.load("current", {packages: ["corechart"]});
  google.charts.setOnLoadCallback(function() {
    drawColumnChart(columnArr)
  });
}

}

//always run to determine if user is logged in on every page
$( document ).ready(function() {
  user.authUser()
})