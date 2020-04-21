function toggleMenu() {
  var nav = document.getElementById('menu-container');
  var icon = document.getElementById('nav-icon');

  if (nav.className === 'show-menu') {
    nav.className = '';
    icon.className = 'hamburger';
  } else {
    nav.className = 'show-menu';
    icon.className = 'close';
  }

}
