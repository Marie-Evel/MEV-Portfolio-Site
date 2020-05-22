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

var Parallax = function() {
  const $container = $('#hero'),
        $img = $container.find('img')

  const applyParallax = function (strength = 0.5) {
    // strength must be between 0 and 1:
    // 0: no parallax effect; image moves with its container
    // 1: full parallax effect; image doesn't move at all (looks like it's
    //    pinned to the background behind the text)

    if ( strength < 0 ) {
      strength = 0;
    } else if ( strength > 1 ) {
      strength = 1;
    }

    let windowTop = Global.getScrollPosition(),
          windowBottom = windowTop + window.innerHeight,
          containerTopY = $container.offset().top,
          containerHeight = $container.innerHeight(),
          containerBottomY = containerTopY + containerHeight;

    if ( containerTopY < windowBottom && containerBottomY > windowTop ) {
      let newTop = 100 * windowTop / containerHeight,
            vertOffset = (strength - 1) * newTop;
      $img.css({
        top: newTop + '%',
        transform: 'translateY(' + vertOffset + '%)'
      });
    }
  };

  return {
    applyParallax: applyParallax
  }

} ();


window.addEventListener('scroll', function() {
  LogoAnimation.checkIfLogoPlayed();
  Parallax.applyParallax(0.5);
  return;
});
