'use strict';

function RealtimeNotification() {
  this.checkSetup()

  firebase.auth().signInAnonymously().catch(function (error) {
    // Handle Errors here.
    var errorCode = error.code
    var errorMessage = error.message
    console.log(errorCode, errorMessage)
  })

  this.database = firebase.database()
  this.newItems = false

  this.messageForm = document.getElementById('message-form')
  this.messageInput = document.getElementById('message')
  this.submitButton = document.getElementById('submit')
  this.messageForm.addEventListener('submit', this.saveMessage.bind(this))

  var buttonTogglingHandler = this.toggleButton.bind(this)
  this.messageInput.addEventListener('keyup', buttonTogglingHandler)
  this.messageInput.addEventListener('change', buttonTogglingHandler)

  this.loadMessages()
}

// Listen to the change of firebase database
RealtimeNotification.prototype.loadMessages = function() {
  this.messagesRef = this.database.ref('messages')
  this.messagesRef.off()

  let setMessage = function (data) {
    if (!this.newItems) return
    let message = data.val()
    alert(message.text)
  }.bind(this)

  this.messagesRef.on('child_added', setMessage)
  this.messagesRef.on('value', function(messages) {
    this.newItems = true
  }.bind(this))
};

// Push notification to firebase database
RealtimeNotification.prototype.saveMessage = function(e) {
  e.preventDefault()
  if (this.messageInput.value) {
    this.messagesRef.push({
      text: this.messageInput.value,
    }).then(function() {
      this.messageInput.value = ''
      this.toggleButton()
    }.bind(this)).catch(function(error) {
      console.error('Error writing new message to Firebase Database', error)
    })
  }
};

// Only enable submit button whenever input field not empty
RealtimeNotification.prototype.toggleButton = function() {
  if (this.messageInput.value) {
    this.submitButton.removeAttribute('disabled')
  } else {
    this.submitButton.setAttribute('disabled', 'true')
  }
};

// Checks that the Firebase SDK has been correctly setup and configured.
RealtimeNotification.prototype.checkSetup = function() {
  if (!window.firebase || !(firebase.app instanceof Function) || !window.config) {
    window.alert('You have not configured and imported the Firebase SDK. ' +
        'Make sure you go through the codelab setup instructions.')
  } else if (config.storageBucket === '') {
    window.alert('Your Firebase Storage bucket has not been enabled. Sorry about that. This is ' +
        'actually a Firebase bug that occurs rarely. ' +
        'Please go and re-generate the Firebase initialisation snippet (step 4 of the codelab) ' +
        'and make sure the storageBucket attribute is not empty. ' +
        'You may also need to visit the Storage tab and paste the name of your bucket which is ' +
        'displayed there.')
  }
};

window.onload = function() {
  window.RealtimeNotification = new RealtimeNotification()
};
