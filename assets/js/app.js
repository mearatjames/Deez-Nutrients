$(document)
  .ready(function() {
    // create sidebar and attach to menu open
    $('.ui.sidebar')
      .sidebar('attach events', '.toc.item')
    ;
    $('.main').hide()
  })

//Toggle Modal
$(document).on('click', '.food .item', function() {
  $('.longer.modal')
  .modal('toggle');
})

$(document).on('click', '#hLogin', function() {
  $('#loginModal')
  .modal('toggle');
})



//Search Eventlistener
$(document).on('click', '#search', function() {
  $('.brand').animate({
    margin: "20px 0px 10px 0px"
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

// Initialize Firebase

var config = {
apiKey: "AIzaSyC6z6KejFb66xYspFuNS9nZ8lHbDop_luI",
authDomain: "vitamind-b6c3c.firebaseapp.com",
databaseURL: "https://vitamind-b6c3c.firebaseio.com",
projectId: "vitamind-b6c3c",
storageBucket: "vitamind-b6c3c.appspot.com",
messagingSenderId: "870980303877"
};
firebase.initializeApp(config);

const db = firebase.database()
const userRef = db.ref('user')
const itemRef = db.ref('item')

    

let nutObj = {
    // retrieves a singular item from the nutrionix api
    getItem (str) {
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
            data: '{"query":"hamburger"}'
            }

        $.ajax(settings).done(function (response) {
            console.log(response)
            return response
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
            <div class="item">
                <img class="ui avatar image" src="${response.common[i].photo.thumb}">
                <div class="content">
                    <a class="header">${response.common[i].food_name}</a>
                </div>
            </div>
            `);
            $('#brandedFoods').append(`
            <div class="item">
                <img class="ui avatar image" src="${response.branded[i].photo.thumb}">
                <div class="content">
                    <a class="header">${response.branded[i].brand_name_item_name}</a>
                </div>
            </div>
            `)
            }
        })
    }
}

let user = {
  addUser (uname, pwd, n) {
      userRef.once('value', function(snapshot) {
          if (snapshot.hasChild(uname)) {
            alert('your user name exists. this alert needs to be refactored into on page textbox validation');
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
      return false
    }
    let user = localStorage.getItem('user_data').split(',')
    return this.checkDB(user[0],user[1])
  },

  // validates user on login page
  validateUser () {
      let username = $('#username').val().trim()
      let password = $('#password').val().trim()
      db.ref('/user/' + username).once('value', function(snapshot){
          if(snapshot.val()){                
              if(snapshot.val().password === password){
                  localStorage.setItem('user_data', `${username},${password}`)
                  console.log("Logging in, valid username and password")
              }else{
                  console.log("CheckDB: password doesnt match")
                  alert("Password is incorrect")
              }
          }else{
              alert("Username is not found")
          }
      })
  },
  // checks db to see if user exists, if so return true, else false
  checkDB (username, password) {
      db.ref('/user/' + username).once('value', function(snapshot){
          if(snapshot.val()){                
              if(snapshot.val().password === password){
                  console.log("CheckDB: password matches")
                  return true
              }else{
                  console.log("CheckDB: password doesnt match")
                  return false
              }
          }else{
              alert("FATAL: user does not exist, cannot verify")
          }
      })
  },
  
  // get name of user's name by searching db for username
  getName(){
      let str = localStorage.getItem('user_data').split(',')
      console.log('str[0] is ' + str[0])
      db.ref('/user/' + str[0]).once('value', function(snapshot){
          console.log(str[0])
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
        var childData = childSnapshot.val();
        if(childData.id === item_id){
          return childData
        }
      })
    })
  },
  // gets all user items
  getUserItems(){
    let str = localStorage.getItem('user_data').split(',')
    let username = str[0]
    var user_item = []
    itemRef.on("value", function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        var childData = childSnapshot.val();
        if(childData.username === username){
          user_item.push(childData.name)
        }
      })
    })
    return user_item
  },
  addItem(itemname){
      itemRef.push({
          username: user.getUser(),
          name: itemname
      })
  }
}