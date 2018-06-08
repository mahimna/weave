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
let page_type = '';
let viewer_id = '';

function createViewer() {
  $.get("https://ipinfo.io", function(response) {
    ip = response.ip;
    ip_location = {
      city: response.city,
      region: response.region,
      country: response.country
    }
    let viewers = db.collection("viewers");

    viewers.add({
      ip: ip,
      ip_location: ip_location,
      created_at: new Date(),
      page_type: page_type
    }).then((viewerRef) => {
      viewer_id = viewerRef.id;
    }).catch((error) => {
      console.error("Error adding document: ", error);
    });
  }, "jsonp");
}

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
  page_type = document.getElementById("page-type").textContent;
  createViewer();

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
    } else if (viewer_id) {
      let subscribers = db.collection("subscribers");
      subscribers.doc(viewer_id).set({
        type: "header",
        name: name,
        email: email,
        ip: ip,
        ip_location: ip_location,
        page_type: page_type,
        created_at: new Date(),
      }).then((docRef) => {
        gtag('event', 'subscribe', {
          'event_category' : 'engagement',
          'event_label' : 'header',
          'value' : page_type,
        });
        window.location.href = "subscribed.html";
      }).catch((error) => {
        console.error("Error adding document: ", error);
      });
    } else {
      alert("Please try again :)");
    }
  });

  document.getElementById("footer-form-subscribe").addEventListener("click", function(){

    const name = document.getElementById("footer-form-name").value;
    const email = document.getElementById("footer-form-email").value;

    if (!email) {
      alert("Please enter an email! :)");
    } else if (viewer_id) {
      let subscribers = db.collection("subscribers");
      subscribers.doc(viewer_id).set({
        type: "footer",
        name: name,
        email: email,
        ip: ip,
        ip_location: ip_location,
        page_type: page_type,
        created_at: new Date(),
      }).then((docRef) => {
        gtag('event', 'subscribe', {
          'event_category' : 'engagement',
          'event_label' : 'footer',
          'value' : page_type,
        });
        // window.location.href = "subscribed.html";
      }).catch((error) => {
        console.error("Error adding document: ", error);
      });
    } else {
      alert("Please try again :)");
    }
  });

  document.getElementById("scroll-arrow").addEventListener("click", function(){
    scrollToItem(document.getElementById("page-1"));
  });

});
