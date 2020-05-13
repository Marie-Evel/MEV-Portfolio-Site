var LogoAnimation = function() {

  const logo = document.getElementById('mev-logo-animation'),
        play = document.getElementById('play-animation-button'),
        overlay = logo.getElementsByClassName('overlay')[0],
        mevStudy = document.getElementById('branding-case-study'),

  checkIfLogoPlayed = function() {
    if ( isVisible(mevStudy, 250, 85, 80) && neverPlayed() ) {
      animateLogo();
      logo.classList.add('played-on-scroll');
    };
    return;
  },

  animateLogo = function() {
    play.classList.add('hide');
    logo.classList.add('animate');
    overlay.classList.add('hide-overlay');

    setTimeout( function() {
      play.classList.remove('hide');
      logo.classList.remove('animate');
      overlay.classList.remove('hide-overlay');
    }, 6000);

    return;
  },

  isVisible = function(targetElement, elementHeight, offsetTop, offsetBottom) {
    const gridTop = offsetTop,
          gridBottom = window.innerHeight - offsetBottom,
          elementTop = targetElement.getBoundingClientRect().top,
          elementBottom = targetElement.getBoundingClientRect().bottom;

    if ( elementTop < gridTop || elementBottom < gridBottom ) {
      return true;
    } else {
      return false;
    }
  },

  neverPlayed = function() {
    if ( logo.classList.contains('played-on-scroll') ) {
      return false;
    } else {
      return true;
    }
  };

  return {
    checkIfLogoPlayed: checkIfLogoPlayed,
    animateLogo: animateLogo
  };

} ();

window.addEventListener('scroll', function() {
  MainNav.didScroll = true;
  MainNav.refreshTopChevron();
  LogoAnimation.checkIfLogoPlayed()
  return;
});

$(document).ready(function() {
  $('.nav-background.current').eq(0).animate({ width: '100%'}, "slow");
  MainNav.refreshTopChevron();
  $('#reveal-page').fadeOut();
  return;
});
