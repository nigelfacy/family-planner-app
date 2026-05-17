importScripts('https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/12.13.0/firebase-messaging.js');

firebase.initializeApp({
  apiKey: "AIzaSyAEL60CjebAqB-mXf3dH6DOE1vCZUib878",
  projectId: "family-planner-5ed4a",
  messagingSenderId: "879804127563",
  appId: "1:879804127563:web:7321260d1efbb85dba70ce"
});

const messaging = firebase.messaging();