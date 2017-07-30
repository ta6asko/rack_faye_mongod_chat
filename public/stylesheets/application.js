var client = new Faye.Client('http://localhost:9292/faye');
var username = 'User_' + Math.floor((Math.random()*1000)+1);

SetUsername = {
 outgoing: function(message, callback) {
   if (message['channel'] == '/meta/disconnect'){
      message['username'] = window.username;
   };
   callback(message);
 }
};

client.addExtension(SetUsername);
client.publish('/new_user', {username: username});
client.subscribe('/new_user', function(message) {
  appendToMessageBox(message['username'], 'connected');
});
client.subscribe('/chat', function(message) {
  appendToMessageBox(message['username'], message['message']);
});
client.subscribe('/disconnection', function(message) {
  appendToMessageBox(message['username'], 'disconnected');
});

document.forms['new-message'].onsubmit = function(){
  var messageText = document.getElementById('new-message-content');

  if(messageText.value != ''){
    var newMessage = { 'username': username, 'message': messageText.value };
    client.publish('/chat',newMessage);
    messageText.value ='';
  }
  return false;
}

function appendToMessageBox(name, message){
  var newContent = document.createElement('h4');
  var nameLabel = document.createElement('span');
  var labelClass = 'label label-';

  if(message == 'connected'){
    labelClass += 'success';
  }else if(message == 'disconnected'){
    labelClass += 'danger';
  }else{
    labelClass += 'primary';
  }

  nameLabel.className = labelClass;
  nameLabel.innerHTML = name;

  var messageContent = document.createElement('span');
  messageContent.className = 'submited-message'
  messageContent.innerHTML = message;

  newContent.appendChild(nameLabel)
  newContent.appendChild(messageContent)

  var messageBox = document.getElementById('message-box');
  messageBox.appendChild(newContent);
  messageBox.scrollTop = messageBox.scrollHeight;
}
