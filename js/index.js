var LogoAnimation = function() {

  const $logo = $('#mev-logo-animation'),
        $play = $('#play-animation-button'),
        $overlay = $('#mev-logo-animation .overlay');

  const checkIfLogoPlayed = function() {
    if ( isVisible($logo, 85, 80) && neverPlayed() ) {
      animateLogo();
      $logo.addClass('played-on-scroll');
    }
    return;
  };

  const animateLogo = function() {
    $play.addClass('hide');
    $logo.addClass('animate');
    $overlay.addClass('hide-overlay');

    setTimeout( function() {
      $play.removeClass('hide');
      $logo.removeClass('animate');
      $overlay.removeClass('hide-overlay');
    }, 6000);

    return;
  };

  const isVisible = function(targetElement, offsetTop, offsetBottom) {
    const gridTop = offsetTop,
          gridBottom = window.innerHeight - offsetBottom,
          elementTop = Global.getTopPosition(targetElement),
          elementBottom = Global.getBottomPosition(targetElement);

    if ( elementTop < gridTop || elementBottom < gridBottom ) {
      return true;
    } else {
      return false;
    }
  };

  const neverPlayed = function() {
    if ( $logo.hasClass('played-on-scroll') ) {
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
  LogoAnimation.checkIfLogoPlayed();
  Parallax.applyParallax($('#hero'), 0.75);
  return;
});
