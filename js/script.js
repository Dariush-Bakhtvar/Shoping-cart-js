import {
    productsData
} from "./Product.js";
const toggle = document.querySelector('[data-toggle]');
const sidebar = document.querySelector('[data-menu]');
const cart = document.querySelector('.fa-cart-shopping');
const closeModal = document.querySelector('[data-closemodal]');
const modalWrapper = document.querySelector('.modal-wrapper');
const container = document.querySelector('.container');
const cartBadge = document.querySelector('.badge');
const modalContent = document.querySelector('.modal-content');
const totalPrice = document.querySelector('.total-price');
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

class Product {
    //1- get product from api or json file
    getProducts() {
        return productsData;
    }
}
let card = [];
class ViewProduct {
    view(product) {
            let result = '';
            product.forEach(item => {
                result += `<div class="card">
                <header class="card__title">
                    <p>${item.title}</p>
                </header>
                <img src=${item.url} alt="product">
                <div class="card-content">
                    <p class="caption">${item.caption}</p>
                    <div class="price">
                        <p>قیمت</p>
                        <p>${item.price} هزار</p>
                    </div>
                    <button class="buy-btn" data-id=${item.id}>افزودن به سبد</button>
                </div>
            </div>`;
                container.innerHTML = result;
            });
        }
        /*  viewOnCart(product, id) {
             let result;
             product.forEach(item => {
                 if (item.id == id) {
                     saveToLoacal(item);
                     result = ` <div class="modal-items">
                             <div class="image-items">
                                 <img src=${item.url} alt="ia">
                             </div>
                             <div class="info-items">
                                 <p>${item.title}</p>
                                 <p>${item.price} هزارتومان</p>
                             </div>
                             <div class="counter-items">
                                 <i class="fa-solid fa-plus"></i>
                                 <p>1</p>
                                 <i class="fa-solid fa-minus"></i>
                             </div>
                             <button class="remove-items"><i class="fa-solid fa-trash"></i></button>
                         </div>`;
                     modalContent.innerHTML += result;
                 }
             });
         } */
    viewAddToCart() {
        const buttons = document.querySelectorAll('.buy-btn');
        const addToCartBtns = [...buttons];
        addToCartBtns.forEach(btn => {
            const id = btn.dataset.id;
            // check id exist in cart or no?
            const isInCard = card.find((item) => item.id == id);
            if (isInCard) {
                btn.textContent = 'موجود در سبد';
                btn.disabled = true;
            }
            btn.addEventListener('click', (e) => {
                e.target.textContent = 'موجود در سبد';
                e.target.disabled = true;
                const addToLocal = Storage.getOfLocals(id);
                // console.log(addToLocal);
                card = [...card, {
                    ...addToLocal,
                    quantity: 1
                }];
                this.setCartValue(card);
                Storage.saveToLocal(card);
            });
        });
    }
    setCartValue(card) {
        //1 counter cart
        //2 get total of product in cart
        let cartCounter = 0;
        const cartTotal = card.reduce((acc, curr) => {
            cartCounter += curr.quantity;
            return acc + curr.quantity * curr.price;
        }, 0);
        cartBadge.textContent = cartCounter;
        totalPrice.textContent = `${cartTotal}000 هزارتومان`;
    }
    viewOnCard() {

    }
}
class Storage {
    static saveProduct(product) {
            localStorage.setItem('products', JSON.stringify(product));
        }
        // get object of data data-id ==id
    static getOfLocals(id) {
        const _Product = JSON.parse(localStorage.getItem('products'));
        return _Product.find(item => item.id == parseInt(id));
    }
    static saveToLocal(card) {
        localStorage.setItem('card', JSON.stringify(card));

    }

}
toggle.addEventListener('click', toggler);
cart.addEventListener('click', fadeIn);
closeModal.addEventListener('click', fadeOut);
document.addEventListener('DOMContentLoaded', () => {
    const product = new Product();
    const getProduct = product.getProducts();
    const ViewProducts = new ViewProduct();
    ViewProducts.view(getProduct);
    ViewProducts.viewAddToCart(getProduct);
    Storage.saveProduct(getProduct);
});