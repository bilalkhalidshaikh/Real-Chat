var firebaseConfig = {
  apiKey: "AIzaSyB09iAv6m89RXlGWx-Y6p8Kjx6M9-1JN10",
  authDomain: "real-chat-web.firebaseapp.com",
  databaseURL: "https://real-chat-web.firebaseio.com",
  projectId: "real-chat-web",
  storageBucket: "real-chat-web.appspot.com",
  messagingSenderId: "455560950167",
  appId: "1:455560950167:web:ddab87f126985f9250d4d2",
  measurementId: "G-BSVPEBEH6Y",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
AOS.init();
// Initialize Firebase

// VAriables
const mainView = document.getElementById("main");
const loginView = document.getElementById("view");
const Facebook = document.getElementById("facebook");
const Google = document.getElementById("google");
const signOut = document.getElementById("signout");
const userAvatar = document.getElementById("avatar");
const navAvatar = document.getElementById("navavatar");
const userName = document.getElementById("username");
const navUserName = document.getElementById("userName");
const userProfile = document.getElementById("myprofile");
const user2Profile = document.getElementById("userprofile");
const sendImage = document.getElementById("sendimage");
const sendAudio = document.getElementById("sendaudio");
const sendVideo = document.getElementById("sendvideo");
const messageTone = new Audio("./images/light_notification.mp3");
const changeBackImage = document.getElementById("changeimg");
// VAriables

// Styles
mainView.style.display = "none";
loginView.style.display = "block";

// Styles

// Facebook Auth
Facebook.onclick = () => {
  var provider = new firebase.auth.FacebookAuthProvider();
  firebase.auth().useDeviceLanguage();
  firebase
    .auth()
    .signInWithPopup(provider)
    .then(function (result) {
      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      console.log(user);
      // ...
    })
    .catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      console.log(errorMessage);
      // ...
    });
};
// Facebook Auth

// Google Auth
Google.onclick = () => {
  var provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().useDeviceLanguage();
  firebase
    .auth()
    .signInWithPopup(provider)
    .then(function (result) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      console.log(user);
      // ...
    })
    .catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      console.log(errorMessage);
      // ...
      Swal.fire({
        title: "Error",
        text: errorMessage,
        icon: "error",
        confirmbutton: "Ok",
      });
    });
};
// Google Auth

// Manage User
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    // User is signed in.
    firebase.auth().currentUser;
    loginView.style.display = "none";
    mainView.style.display = "block";
    userAvatar.setAttribute("src", `${user.photoURL}`);
    navAvatar.setAttribute("src", `${user.photoURL}`);
    userName.innerText = user.displayName;
    navUserName.innerText = user.displayName;
  } else {
    // No user is signed in.

    loginView.style.display = "block";
    mainView.style.display = "none";
  }
});
signOut.onclick = () => {
  firebase.auth().signOut();
};
userProfile.onclick = () => {
  let currentUser = firebase.auth().currentUser;
  Swal.fire({
    title: `<strong>${currentUser.displayName}</strong>`,
    imageUrl: `${currentUser.photoURL}`,
    imageWidth: 320,
    imageHeight: 280,
    imageAlt: `${currentUser.displayName}`,
    html: `Email Address: ${currentUser.email}`,
    showCloseButton: true,
    showCancelButton: true,
    focusConfirm: false,
    confirmButtonText: '<i class="fa fa-thumbs-up"></i> Great!',
    confirmButtonAriaLabel: "Thumbs up, great!",
    cancelButtonText: '<i class="fa fa-thumbs-down"></i>',
    cancelButtonAriaLabel: "Thumbs down",
  });
};
// Manage User

// Manage Chat
let messageList = document.getElementById("msglist");
messageList.className = "messagelist";
let sendMessage = document.getElementById("sendmessage");
let message = document.getElementById("message");
let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
let dayName = days[new Date().getDay()];
let date = new Date();
let hour = date.getHours();
let minute = date.getMinutes();
let second = date.getSeconds();
if (hour === 0) {
  hour = 12;
}
hour = hour < 10 ? "0" + hour : hour;
minute = minute < 10 ? "0" + minute : minute;
second = second < 10 ? "0" + second : second;
let time = `  ${hour}:${minute} `;
console.log(time, dayName);

sendMessage.onclick = () => {
  const msgRef = firebase
    .database()
    .ref("Real Chat/" + firebase.auth().currentUser.displayName)
    .child("Messages/");
  const key = msgRef.push().key;
  let dbData = {
    Name: firebase.auth().currentUser.displayName,
    Avatar: firebase.auth().currentUser.photoURL,
    email: firebase.auth().currentUser.email,
    Uid: firebase.auth().currentUser.uid,
    Key: key,
    Message: message.value,
  };
  msgRef.push(dbData);
  console.log(dbData);
  console.log(key);
  msgRef.once("child_added", (data) => {
    console.log("Receive=> ", data.val());
    let img = document.createElement("img");
    img.src = `${firebase.auth().currentUser.photoURL}`;
    img.className = "rounded-circle chat-avatar";
    let li = document.createElement("li");
    li.className =
      data.val().Uid === firebase.auth().currentUser.uid ? "sent" : "received";
    let span = document.createElement("span");
    let today = document.createElement("span");
    today.className = "today";
    today.innerHTML = dayName;
    let mainMessage = document.createTextNode(data.val().Message);
    console.log(messageList);
    li.appendChild(img);
    li.appendChild(mainMessage);
    messageList.appendChild(li);
    li.appendChild(span);
    li.appendChild(today);
    span.className = "time";
    span.innerHTML = time;
  });

  messageTone.play();
  message.value = " ";
};

sendImage.onclick = () => {
  let file = document.getElementById("imagefile");
  file.onchange = (e) => {
    messageTone.play();
    let url = URL.createObjectURL(e.target.files[0]);
    const imageRef = firebase
      .database()
      .ref("Real Chat/" + firebase.auth().currentUser.displayName)
      .child("Images/");
    const key = imageRef.push().key;
    let dbData = {
      Name: firebase.auth().currentUser.displayName,
      Avatar: firebase.auth().currentUser.photoURL,
      email: firebase.auth().currentUser.email,
      Uid: firebase.auth().currentUser.uid,
      Key: key,
      Image: url,
    };
    imageRef.push(dbData);
    imageRef.once("child_added", (data) => {
      console.log(data.val());
      let img = document.createElement("img");
      img.className = "chatimg img-thumbnail";
      img.src = data.val().Image;
      img.onload = () => {
        URL.revokeObjectURL(img.src);
        messageList.appendChild(img);
      };
    });
  };
};
sendAudio.onclick = () => {
  let audioFile = document.getElementById("audiofile");
  audioFile.onchange = (e) => {
    messageTone.play();
    let url = URL.createObjectURL(e.target.files[0]);
    const audioRef = firebase
      .database()
      .ref("Real Chat/" + firebase.auth().currentUser.displayName)
      .child("Audios/");
    const key = audioRef.push().key;
    let dbData = {
      Name: firebase.auth().currentUser.displayName,
      Avatar: firebase.auth().currentUser.photoURL,
      email: firebase.auth().currentUser.email,
      Uid: firebase.auth().currentUser.uid,
      Key: key,
      Audio: url,
    };
    audioRef.push(dbData);
    audioRef.once("child_added", (data) => {
      console.log("Audio Data=>", data.val());
      let audio = document.createElement("audio");
      audio.setAttribute("controls", "controls");
      let audiourl = data.val().Audio;
      audio.src = audiourl;
      messageList.appendChild(audio);
      audio.onload = () => {
        URL.revokeObjectURL(audio.src);
      };
    });
  };
};
sendVideo.onclick = () => {
  let file = document.getElementById("videofile");
  file.onchange = (e) => {
    let url = URL.createObjectURL(e.target.files[0]);
    const videoRef = firebase
      .database()
      .ref("Real Chat/" + firebase.auth().currentUser.displayName)
      .child("Videos/");
    const key = videoRef.push().key;
    let dbData = {
      Name: firebase.auth().currentUser.displayName,
      Avatar: firebase.auth().currentUser.photoURL,
      email: firebase.auth().currentUser.email,
      Uid: firebase.auth().currentUser.uid,
      Key: key,
      Video: url,
    };
    videoRef.push(dbData);
    messageTone.play();
    videoRef.once("child_added", (data) => {
      console.log("Video Data=>", data.val());
      let video = document.createElement("video");
      video.controls = true;
      video.className = "video";
      let videourl = data.val().Video;
      video.src = videourl;
      video.onload = () => {
        URL.revokeObjectURL(video.src);
      };
      messageList.appendChild(video);
    });
  };
};

document.addEventListener("keypress", (e) => {
  if (e.keyCode === 13) {
    sendMessage.onclick();
    window.stop();
  }
});

// Manage Chat
