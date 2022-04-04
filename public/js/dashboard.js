const toggleButton = document.getElementsByClassName('toggle-button')[0]
const navbarLinks = document.getElementsByClassName('navbar-links')[0]
const createParty = document.querySelector('.create-party-modal');
const searchParty = document.querySelector('.search-party-modal');
const searchModal = document.querySelector('#search-modal');
const searchClose = document.querySelector('#search-delete');
const modalClose = document.querySelector('.delete');
const modalBackground = document.querySelector('.modal-background');
const searchModalBackground = document.querySelector('.search-modal-background');
const modal= document.querySelector('.modal');

toggleButton.addEventListener('click', () => {
navbarLinks.classList.toggle('active')
});

createParty.addEventListener('click', () => {
    modal.classList.add('is-active')
    modalBackground.classList.add('is-active');
});

modalClose.addEventListener('click', () => {
    modal.classList.remove('is-active');
});

searchParty.addEventListener('click', () => {
    console.log('button clicked!')
    searchModal.classList.add('is-active')
    searchModalBackground.classList.add('is-active');
});

searchClose.addEventListener('click', () => {
    searchModal.classList.remove('is-active');
});