function main() {
  const toggle = document.querySelector('.header-dropdown-menu-toggle');
  toggle && toggle.addEventListener('click', toggleDropdown);
}

function toggleDropdown() {
  const classList = document.querySelector('.header-dropdown-menu-toggle .icon').classList;
  const menu = document.querySelector('.header-dropdown-menu');
  if (classList.contains('icon-bars')) {
    classList.remove('icon-bars');
    classList.add('icon-times');
    menu.classList.add('open');
  } else {
    classList.remove('icon-times');
    classList.add('icon-bars');
    menu.classList.remove('open');
  }
}

void main();
