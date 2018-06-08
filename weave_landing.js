let firebase_config = {
    apiKey: "AIzaSyDwzxqQpjlqDpk1blXeoRGINhtM3VpgYro",
    authDomain: "weave-1525633453271.firebaseapp.com",
    databaseURL: "https://weave-1525633453271.firebaseio.com",
    projectId: "weave-1525633453271",
};
  
firebase.initializeApp(firebase_config);
let db = firebase.firestore();
const settings = {/* your settings... */ timestampsInSnapshots: true};
db.settings(settings);

let ip = '';
let ip_location = {};
let subs = 0;

$.get("https://ipinfo.io", function(response) {
  ip = response.ip;
  ip_location = {
    city: response.city,
    region: response.region,
    country: response.country
  }
  let viewersRef = db.collection("viewers").doc(ip);

  viewersRef.get()
    .then((docSnapshot) => {
      if (docSnapshot.exists) {
        let viewerData = docSnapshot.data();
        subs = viewerData.subscribers;
        viewersRef.set({
          num_views: viewerData.num_views + 1,
          ip_location: ip_location
        }, { merge: true }).catch((error) => {
          console.error("Error adding document: ", error);
        });
      } else {
        viewersRef.set({
          num_views: 1,
          ip_location: ip_location,
          subscribers: subs
        }, { merge: true }).catch((error) => {
          console.error("Error adding document: ", error);
        });
      }
    })
}, "jsonp");

function scrollToItem(item) {
  var diff=(item.offsetTop-window.scrollY)/8
  if (Math.abs(diff)>1) {
      window.scrollTo(0, (window.scrollY+diff))
      clearTimeout(window._TO)
      window._TO=setTimeout(scrollToItem, 30, item)
  } else {
      window.scrollTo(0, item.offsetTop)
  }
}

document.addEventListener('DOMContentLoaded', function() {
  let url = window.location.href;
  if (url.includes("#subscribed")) {

    document.getElementById("mc-embedded-subscribe").style.display = "none";
    document.getElementById("subscribed-container").style.display = "inline-block";

    gtag('config', 'UA-120442635-1', {
      'page_location' : window.location.href
    });
  }

  document.getElementById("header-form-subscribe").addEventListener("click", function(){

    const name = document.getElementById("header-form-name").value;
    const email = document.getElementById("header-form-email").value;

    if (!email) {
      alert("Please enter an email! :)");
    } else {
      let subscribers = db.collection("subscribers");
      subscribers.add({
        type: "header",
        name: name,
        email: email,
        ip: ip,
        ip_location: ip_location
      }).then((docRef) => {
        db.collection("viewers").doc(ip).set({
          subscribers: subs + 1
        }, { merge: true });
        window.location.href = "subscribed.html";
      }).catch((error) => {
        console.error("Error adding document: ", error);
      });
    }
  });

  document.getElementById("footer-form-subscribe").addEventListener("click", function(){

    const name = document.getElementById("footer-form-name").value;
    const email = document.getElementById("footer-form-email").value;

    if (!email) {
      alert("Please enter an email! :)");
    } else {
      let subscribers = db.collection('subscribers');
      subscribers.add({
        type: "footer",
        name: name,
        email: email,
        ip: ip,
        ip_location: ip_location
      }).then((docRef) => {
        db.collection("viewers").doc(ip).set({
          subscribers: subs + 1
        }, { merge: true });
        window.location.href = "subscribed.html";
      }).catch((error) => {
        console.error("Error adding document: ", error);
      });
    }
  });

  document.getElementById("scroll-arrow").addEventListener("click", function(){
    scrollToItem(document.getElementById("page-1"));
  });

});
