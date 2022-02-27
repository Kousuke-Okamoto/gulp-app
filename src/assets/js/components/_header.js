// _header.js

export function header() {
    //カレント位置
    let navLink = document.getElementsByClassName('l-header-navLink');
    for (let i = 0; i < navLink.length; i++) {
        if (navLink[i].getAttribute('href') === location.pathname) {
            navLink[i].classList.add('is-current');
        }
    }
    //メニューオープン
    const spBtn = document.querySelector('.l-header-spBtn');
    const body = document.body;
    spBtn.addEventListener('click', () => {
        body.classList.toggle('is-menu-open')
    });
}