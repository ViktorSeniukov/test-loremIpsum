const menuButton = document.querySelector('.menu-button');
const menuList = document.querySelector('.navigation__list');

function closeIfOut(evt) {
  evt.stopPropagation();
  if (
      !evt.target.classList.contains('navigation__list') &&
      !evt.target.classList.contains('navigation__item') &&
      !evt.target.classList.contains('navigation__link') &&
      !evt.target.classList.contains('menu-button')) {
    menuList.classList.remove('navigation__list--open')
    menuButton.classList.remove('menu-button--open-menu');
    document.removeEventListener('click', closeIfOut);
  }
}

export default function burgerMenu() {
  menuButton.addEventListener('click', (evt) => {
    evt.stopPropagation();
    if (menuList.classList.contains('navigation__list--open')) {
      menuList.classList.remove('navigation__list--open');
      menuButton.classList.remove('menu-button--open-menu');
      document.removeEventListener('click', closeIfOut);
    } else {
      menuList.classList.add('navigation__list--open');
      menuButton.classList.add('menu-button--open-menu');
      document.addEventListener('click', closeIfOut);
    }
  })
}