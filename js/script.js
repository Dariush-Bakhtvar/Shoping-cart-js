const toggle = document.querySelector('[data-toggle]');
const sidebar = document.querySelector('[data-menu]');
const cart = document.querySelector('.fa-cart-shopping');
const closeModal = document.querySelector('[data-closemodal]');
const modalWrapper = document.querySelector('.modal-wrapper');

//toggle menu function
function toggler() {
    toggle.classList.toggle('activeToggle');
    sidebar.classList.toggle('activeMenu');
}
//fade-in modal
function fadeIn() {
    closeModal.classList.add('showModal');
    modalWrapper.classList.add('modalMotion');

}
//fade-out Modal
function fadeOut(e) {
    if (e.target.matches('.modal-cart')) {
        modalWrapper.classList.remove('modalMotion');
        closeModal.classList.remove('showModal');
    }
}
toggle.addEventListener('click', toggler);
cart.addEventListener('click', fadeIn);
closeModal.addEventListener('click', fadeOut);