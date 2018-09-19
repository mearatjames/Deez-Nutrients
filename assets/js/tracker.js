let tracker = {
    setAvatar(){
      let user = localStorage.getItem('user_data').split(',')
      $('#avatar').attr('src', `assets/images/${user[3]}.png`)
    }
  }
  //always run to determine if user is logged in on every page
  $( document ).ready(function() {
    tracker.setAvatar()
  })