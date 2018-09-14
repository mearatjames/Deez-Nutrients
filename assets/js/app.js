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
            url: 'https://trackapi.nutritionix.com/v2/search/instant?common=true&query=banana',
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
            console.log(response.common)
            return response.common
        })
    }
}

let user = {
    addUser (uname, pwd, n) {
        userRef.once('value', function(snapshot) {
            if (snapshot.hasChild(uname)) {
              alert('exists');
            }else{
                userRef.child(uname).set({
                    password: pwd
                })
            }
        })
    },
    // checks local storage for a user and password
    authUser () {
      if(!localStorage.getItem('user_data')) {
        return false
      }
      let str = localStorage.getItem('user_data').split(',')
      return this.checkDB(user[0],user[1])
    },

    // validates user on login page
    validateUser () {
      let username = $('#username').val().trim()
      let password = $('#password').val().trim()
      if(!this.checkDB(username,password)) {
        return false
      }    
      localStorage.setItem('user_data', `${username},${password}`)
      return true
    },
    // checks db to see if user exists, if so return true, else false
    checkDB (username, password) {
      userRef.on("value", function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
          var childData = childSnapshot.val();
          if(childData.username === username){
            if(childData.password === password){
              return true
            }
          }
        })
      })
      return false
    },
    
    // get name of user's name by searching db for username
    getName(){
      let str = localStorage.getItem('user_data').split(',').trim()
      let username = str[0]
      userRef.on("value", function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
          var childData = childSnapshot.val();
          if(childData.username === username){
            return childData.name
          }
        })
      })
      return false
    },
    getId(){
      let str = localStorage.getItem('user_data').split(',').trim()
      let username = str[0]
      userRef.on("value", function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
          var childData = childSnapshot.val();
          if(childData.username === username){
            return childData.id
          }
        })
      })
      return false
    }
  }

let nutrients = {
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
    if(!user.authUser){
      return false
    }
    var user_item = []
    itemRef.on("value", function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        var childData = childSnapshot.val();
        if(childData.user_id === user.getId()){
          user_item.push(childData.id)
        }
      })
    })
    return user_item
  },
  addUserItem(itemid){
    if(!user.authUser){
      return false
    }
    userItemsRef.push({
        name: document.querySelector('#tname-input').value,
        destination : document.querySelector('#destination-input').value,
        start_time: document.querySelector('#time-input').value,
        frequency: document.querySelector('#frequency-input').value
    })
    return false
  }
}



let n = nutObj.getItemList('hamburger')

user.addUser('bunrith','a','c')
//user.addUser('bunrith','b','d')
// console.log(user.authUser())
// console.log(n)