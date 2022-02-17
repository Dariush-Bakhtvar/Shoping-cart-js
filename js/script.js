const toggle = document.querySelector('[data-toggle]');
const sidebar = document.querySelector('[data-menu]');

function toggler() {
    toggle.classList.toggle('activeToggle');
    sidebar.classList.toggle('activeMenu');
}
toggle.addEventListener('click', toggler);