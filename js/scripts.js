var nav = document.getElementById('menu-container');
var icon = document.getElementById('nav-icon');

function toggleMenu() {

  if (nav.className === 'show-menu') {
    nav.className = '';
    icon.className = 'hamburger';
  } else {
    nav.className = 'show-menu';
    icon.className = 'close';
  }

}

var logo = document.getElementById('mev-logo-animation');
var play = document.getElementById('play-animation-button');
var overlay = logo.getElementsByClassName('overlay')[0];

function animateLogo() {
  play.classList.add('hide');
  logo.classList.add('animate');
  overlay.classList.add('hide-overlay');

  setTimeout( function() {
    play.classList.remove('hide');
    logo.classList.remove('animate');
    overlay.classList.remove('hide-overlay');
  }, 6000);
}

function isVisible(targetElement) {
  var gridTop = 85;
  var gridBottom = window.innerHeight - 75;
  var elementTop = targetElement.getBoundingClientRect().top;
  var elementBottom = elementTop + 250;

  if ( elementTop > gridTop && elementBottom < gridBottom ) {
    return true;
  } else {
    return false;
  }
}

function neverPlayed() {
  if ( logo.classList.contains('played-on-scroll') ) {
    return false;
  } else {
    return true;
  }
}

var mevStudy = document.getElementById('branding-case-study');

window.addEventListener('scroll', function() {

  if ( isVisible(mevStudy) && neverPlayed() ) {
    animateLogo()
    logo.classList.add('played-on-scroll');
  };
})
