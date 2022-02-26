// _header.js

//カレント位置
export function header() {
    let navLink = document.getElementsByClassName('l-header-navLink');
    for (let i = 0; i < navLink.length; i++) {
        if (navLink[i].getAttribute('href') === location.pathname) {
            navLink[i].classList.add('is-current');
        }
    }
    const spBtn = document.querySelector('.l-header-spBtn');
    const body = document.body;
    spBtn.addEventListener('click', () => {
        body.classList.toggle('is-menu-open')
    });
}