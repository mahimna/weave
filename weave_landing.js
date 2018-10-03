
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
let click_type = '';
let consent_given_time = null;

// Function that gets the ip and respective location of the user - it is called on DOM load
function createViewer() {
  $.get("https://ipinfo.io", function(response) {
    ip = response.ip;
    ip_location = {
      city: response.city,
      region: response.region,
      country: response.country
    }
    page_type = document.getElementById("page-type").textContent;
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

// Function to 
function removeConsentError() {
  var signup_form = document.getElementById("form-error");
  signup_form.style.display = "none";
}

// Function to show the privacy policy error
function showConsentError() {
  var signup_form = document.getElementById("form-error");
  signup_form.style.display = "inherit";
  signup_form.innerHTML = "Please adhere to our privacy policy";
}

document.addEventListener('DOMContentLoaded', function() {

  // Function that gets called when the subscribe (Create) button is clicked
  document.getElementById("subscribe-button").addEventListener("click", function(){

    const name = document.getElementById("name-input").value;
    const email = document.getElementById("email-input").value;
    page_type = document.getElementById("page-type").textContent;

    // Only proceed if consent is given by the user
    if (consent_given_time) {
      if (!email) {
        alert("Please enter an email! :)");
      } else if (viewer_id) {
        let subscribers = db.collection("subscribers");
        subscribers.doc(viewer_id).set({
          type: click_type,
          name: name,
          email: email,
          ip: ip,
          ip_location: ip_location,
          page_type: page_type,
          created_at: new Date(),
          consent_given: true,
          consent_given_time: consent_given_time,
        }).then((docRef) => {
          // Google analytics event for clicking subscribe
          gtag('event', 'subscribe', {
            'event_category' : 'engagement',
            'event_label' : 'header',
            'value' : page_type,
          });
          // Facebook analytics event for clicking subscribe
          fbq('track', 'Lead');
          window.location.href = "subscribed.html";
        }).catch((error) => {
          console.error("Error adding document: ", error);
        });
      } else {
        alert("Please try again :)");
      }
    } else {
      showConsentError();
    }
  });

  // Function that gets called when the header explore button is clicked. It sets the pop up form to be visible. 
  document.getElementById("explore-header").addEventListener("click", function(){

    click_type = "header";
    var signup_form = document.getElementById("signup-form");
    signup_form.style.display = "inherit";

    // If user click outsides modal, then hide the sign up form
    window.onclick = function(event) {
      if (event.target == signup_form) {
        signup_form.style.display = "none";
        removeConsentError();
      }
    }
  });

  // Function that gets called when the footer explore button is clicked. It sets the pop up form to be visible. 
  document.getElementById("explore-footer").addEventListener("click", function(){

    click_type = "footer";
    var signup_form = document.getElementById("signup-form");
    signup_form.style.display = "inherit";

    // If user click outsides modal, then hide the sign up form
    window.onclick = function(event) {
      if (event.target == signup_form) {
        signup_form.style.display = "none";
        removeConsentError();
      }
    }
  });

  // Function that gets called when the consent checkbox is either checked or unchecked. 
  document.getElementById("consent-checkbox").addEventListener("click", function() {
    if (document.getElementById("consent-checkbox").checked) {
      consent_given_time = new Date();
      removeConsentError();
    } else {
      consent_given_time = null;
    }
  });

  // Function that gets called when the cross is clicked in the subsrcibe form
  document.getElementById("close-form-pop").addEventListener("click", function() {
    var signup_form = document.getElementById("signup-form");
    signup_form.style.display = "none";
    removeConsentError();
  });

  // Function that gets called when the FAQ button is clicked in the navigation
  document.getElementById("faq-nav-item").addEventListener("click", function() {
    $('html, body').animate({
      scrollTop: $("div#page-faq").offset().top
    }, 1000);
  });

  // Function that gets called when the Return to Top link is clicked in the footer
  document.getElementById("return-to-top-link").addEventListener("click", function() {
    $('html, body').animate({
      scrollTop: $("div#page-home").offset().top
    }, 1000);
  });

  createViewer();
});