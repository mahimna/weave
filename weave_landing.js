document.addEventListener('DOMContentLoaded', function() {
let url = window.location.href;
if (url.includes("#subscribed")) {

  document.getElementById("mc-embedded-subscribe").style.display = "none";
  document.getElementById("subscribed-container").style.display = "inline-block";

  gtag('config', 'UA-120442635-1', {
    'page_location' : window.location.href
  });
}
});