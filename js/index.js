var LogoAnimation = function() {

  const logo = $('#mev-logo-animation'),
        play = $('#play-animation-button'),
        overlay = $('#mev-logo-animation .overlay'),
        mevStudy = $('#branding-case-study'),

  checkIfLogoPlayed = function() {
    if ( isVisible(mevStudy, 250, 85, 80) && neverPlayed() ) {
      animateLogo();
      logo.addClass('played-on-scroll');
    };
    return;
  },

  animateLogo = function() {
    play.addClass('hide');
    logo.addClass('animate');
    overlay.addClass('hide-overlay');

    setTimeout( function() {
      play.removeClass('hide');
      logo.removeClass('animate');
      overlay.removeClass('hide-overlay');
    }, 6000);

    return;
  },

  isVisible = function(targetElement, elementHeight, offsetTop, offsetBottom) {
    const gridTop = offsetTop,
          gridBottom = window.innerHeight - offsetBottom,
          elementTop = Global.getTopPosition(targetElement),
          elementBottom = Global.getTopPosition(targetElement);
          // elementTop = targetElement.getBoundingClientRect().top,
          // elementBottom = targetElement.getBoundingClientRect().bottom;

    if ( elementTop < gridTop || elementBottom < gridBottom ) {
      return true;
    } else {
      return false;
    }
  },

  neverPlayed = function() {
    if ( logo.hasClass('played-on-scroll') ) {
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
  LogoAnimation.checkIfLogoPlayed()
  return;
});
