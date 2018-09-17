$(document)
  .ready(function() {
    // create sidebar and attach to menu open
    $('.ui.sidebar')
      .sidebar('attach events', '.toc.item')
    ;
    $('.main').hide()
;
  })

//Toggle Modal
$(document).on('click', '.food .item', function() {
  $('.longer.modal')
  .modal('toggle');
})


//login modal
$(document).on('click', '.hLogin', function() {
  $('#loginModal')
  .modal('toggle');
})


//logout modal
$(document).on('click', '.hLogout', function() {
  let str = localStorage.getItem('user_data').split(',')
  $('.logoutModalHeader').html(`${str[0]}, Logging Out? We Hope To See You Soon!`)
  $('#logoutModal')
  .modal('toggle');
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
              console.log('here2')
              $('#loginModal #form1').form('add errors', {
                email: 'Password field is empty',
              })
            }else{
              if(snapshot.val().password === password){
                  localStorage.setItem('user_data', `${username},${password},${snapshot.val().name}`)
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

$(document).on('click', '#register', function() {
  let username = $('#rusername').val().trim()
  let password = $('#rpassword').val().trim()
  let name = $('#rname').val().trim()
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
      if(issues > 0){
        $('#loginModal #form2').form('add errors', issuekp)
      }else{
        localStorage.setItem('user_data', `${username},${password},${name}`)
        $('#loginModal ').modal('hide')
        user.addUser(username, password, name)
        user.login()
      }
  })
})


//Nutritients Search Eventlistener
$(document).on('click', 'div.nutritionSearch', function() {
  let str = ($(this).find('a.header').text())
  nutObj.getItem(str)
  google.charts.load('current', {'packages':['corechart']});
  google.charts.setOnLoadCallback(drawChart);
})

//Nutritients Search Item Modal Eventlistener
$(document).on('keyup', '#servingQty', function() {
  console.log('here0' + $('#servingQty').val())
  if($('#servingQty').val()){
    console.log('here ' + $('#servingQty').val())
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
  $('.brand').animate({
    margin: "20px 0px 20px 0px"
  }, 1000)
})
$(document).on('keyup', '#search', search)

//Search Function
function search() {
  $('.main').show()
  let str = $(this).val().trim()
  console.log(str)
  nutObj.getItemList(str)
}
//Draw Chart
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
            console.log(response)
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

            drawChart(proteinCal, carbsCal, fatCal)
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
            for (let i = 0; i < 4; i++) {
            $('#commonFoods').append(`
            <div class="nutritionSearch item">
                <img class="ui avatar image" src="${response.common[i].photo.thumb}">
                <div class="content">
                    <a data-id="${response.common[i].tag_id}" class="header">${response.common[i].food_name}</a>
                </div>
            </div>
            `)
            $('#brandedFoods').append(`
            <div class="nutritionSearch item">
                <img class="ui avatar image" src="${response.branded[i].photo.thumb}">
                <div class="content">
                    <a data-id="${response.branded[i].nix_item_id}" class="header">${response.branded[i].brand_name_item_name}</a>
                </div>
            </div>
            `)
            }
        })
    },
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
      console.log("GHELFWFL")
      return false
    }
    let user = localStorage.getItem('user_data').split(',')
    this.checkDB(user[0],user[1])
  },
  // checks db to see if user exists, if so return true, else false
  checkDB (username, password) {
      db.ref('/user/' + username).once('value', function(snapshot){
          if(snapshot.val()){                
              if(snapshot.val().password === password){
                  console.log("CheckDB: password matches")
                  $('.pushable a').eq(4).addClass('hLogout')
                  user.login()
                  return true
              }else{
                  console.log("CheckDB: password doesnt match")
                  $('.pushable a').eq(4).addClass('hLogin')
                  return false
              }
          }else{
              alert("FATAL: user does not exist, cannot verify")
              $('.pushable a').eq(4).addClass('hLogin')
          }
      })
  },
  
  // get name of user's name by searching db for username
  getName(){
      let str = localStorage.getItem('user_data').split(',')
      console.log('str[0] is ' + str[0])
      db.ref('/user/' + str[0]).once('value', function(snapshot){
          if(snapshot.val().name === str[2]){
              return snapshot.val().name
          }
      })
  },
  getUser(){
      let str = localStorage.getItem('user_data').split(',')
      console.log(str[0])
      return str[0]
  }
}

let fb = {
  // gets an item by id
  getItem(item_id){
    itemRef.on("value", function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        var childData = childSnapshot.val()
        if(childData.id === item_id){
          return childData
        }
      })
    })
  },
  // gets all user items
  getUserItems(d){
    let str = localStorage.getItem('user_data').split(',')
    let username = str[0]
    var user_item = []
    itemRef.on("value", function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        var childData = childSnapshot.val()
        if(childData.username === username){
          //if date doesnt exist we push everything for that logged in user, 
          //else we push specified date
          if(!d){
            user_item.push(childData.name)
          }else if(childData.date === d){
            user_item.push(childData.name)
          }
        }
      })
    })
    return user_item
  },
  addItem(itemname){
      var today = moment().format("MM/DD/YYYY")
      itemRef.push({
          date: today,
          username: user.getUser(),
          name: itemname
      })
  }
}

//always run to determine if user is logged in on every page
$( document ).ready(function() {
  user.authUser()
})
