import {
    productsData
} from "./Product.js";
const toggle = document.querySelector('[data-toggle]');
const sidebar = document.querySelector('[data-menu]');
const cartBtn = document.querySelector('.fa-cart-shopping');
const closeModal = document.querySelector('[data-closemodal]');
const modalWrapper = document.querySelector('.modal-wrapper');
const container = document.querySelector('.container');
const cartBadge = document.querySelector('.badge');
const modalContent = document.querySelector('.modal-content');
const totalPrice = document.querySelectorAll('.total-price p')[1];
const claerModal = document.querySelector('[data-clear]');
let buttonsDom = [];
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
function fadeOut() {
    modalWrapper.classList.remove('modalMotion');
    closeModal.classList.remove('showModal');
}

class Product {
    //1- get product from api or json file
    getProducts() {
        return productsData;
    }
}
let cart = [];
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
        /*  viewCartItems(product, id) {
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
    BtnAddToCart() {
        const buttons = [...document.querySelectorAll('.buy-btn')];
        buttonsDom = buttons;
        buttons.forEach(btn => {
            const id = btn.dataset.id;
            // check id exist in cart or no?
            const isIncart = cart.find((item) => item.id == id);
            if (isIncart) {
                btn.textContent = 'موجود در سبد';
                btn.disabled = true;
            }
            btn.addEventListener('click', (e) => {
                e.target.textContent = 'موجود در سبد';
                e.target.disabled = true;
                // create new object width add quntity
                const addToLocal = {
                    ...Storage.getProduct(id),
                    quantity: 1
                };
                //update cart 
                cart = [...cart, addToLocal];
                this.setCartValue(cart);
                Storage.saveToLocal(cart);
                this.viewCartItems(addToLocal);

            });
        });
    }
    setCartValue(cart) {
        //1 counter cart
        //2 get total of product in cart
        let cartCounter = 0;
        const cartTotal = cart.reduce((acc, curr) => {
            cartCounter += curr.quantity;
            return acc + curr.quantity * curr.price;
        }, 0);
        cartBadge.textContent = cartCounter;
        totalPrice.textContent = `${cartTotal}000 هزارتومان`;
    }
    viewCartItems(cartItem) {
            let result;
            result = ` <div class="modal-items">
                             <div class="image-items">
                                 <img src=${cartItem.url} alt="ia">
                             </div>
                             <div class="info-items">
                                 <p>${cartItem.title}</p>
                                 <p>${cartItem.price} هزارتومان</p>
                             </div>
                             <div class="counter-items">
                                 <i class="fa-solid fa-plus"data-id=${cartItem.id}></i>
                                 <p>${cartItem.quantity}</p>
                                 <i class="fa-solid fa-minus"data-id=${cartItem.id}></i>
                             </div>
                             <i class="fa-solid fa-trash remove-items" data-id=${cartItem.id}></i>
                         </div>`;
            modalContent.innerHTML += result;

        }
        //load items in cart on local storag
    loadOfLocal() {
        cart = Storage.getOfLocal() || [];
        cart.forEach((cartItem) => {
            this.viewCartItems(cartItem);
        });
        this.setCartValue(cart);
    }
    logicOpCart() {
        claerModal.addEventListener('click', () => {
            this.clearCart();
        });
        modalContent.addEventListener('click', (e) => {
            const target = e.target;
            const id = e.target.dataset.id;
            const className = [...e.target.classList][1];
            const matchCart = cart.find((item) => item.id === parseInt(id));
            switch (className) {
                case 'fa-trash':
                    this.removeCartItem(matchCart.id);
                    this.setCartValue(cart);
                    Storage.saveToLocal(cart);
                    target.parentElement.remove();
                    break;
                case 'fa-plus':
                    matchCart.quantity++;
                    this.setCartValue(cart);
                    Storage.saveToLocal(cart);
                    target.nextElementSibling.textContent = matchCart.quantity;
                    break;
                case 'fa-minus':
                    if (matchCart.quantity > 0) {
                        matchCart.quantity--;
                        target.previousElementSibling.textContent = matchCart.quantity;
                    }
                    if (matchCart.quantity === 0) {
                        this.removeCartItem(matchCart.id);
                        target.parentElement.parentElement.remove();
                    }
                    this.setCartValue(cart);
                    Storage.saveToLocal(cart);
                    break;
            }
        });
    }
    clearCart() {
        cart.forEach(item => this.removeCartItem(item.id));
        while (modalContent.children.length) {
            modalContent.removeChild(modalContent.children[0]);
        }
        fadeOut();
    }
    removeCartItem(id) {
        //filter items id is not equal id fo delet
        cart = cart.filter((item) => item.id !== parseInt(id));
        //1-update total Price
        this.setCartValue(cart);
        //2-save new carts to local
        Storage.saveToLocal(cart);
        const button = this.changeBtnValue(id);
        button.textContent = 'افزودن به سبد';
        button.disabled = false;
    }
    changeBtnValue(id) {
        return buttonsDom.find((btn) => parseInt(btn.dataset.id) === parseInt(id));
    }
}
class Storage {
    static saveProduct(product) {
            localStorage.setItem('products', JSON.stringify(product));
        }
        // get object of data data-id ==id
    static getProduct(id) {
        const _Product = JSON.parse(localStorage.getItem('products'));
        return _Product.find(item => item.id == parseInt(id));
    }
    static saveToLocal(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
    }
    static getOfLocal() {
        return JSON.parse(localStorage.getItem('cart'));
    }
}
toggle.addEventListener('click', toggler);
cartBtn.addEventListener('click', fadeIn);
closeModal.addEventListener('click', (e) => {
    if (e.target.matches('.modal-cart')) {
        fadeOut();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    //1.save product on localStorage when load doc
    const product = new Product();
    const getProduct = product.getProducts(); // add productdata to 
    // 2.show produc
    const ViewProducts = new ViewProduct();
    ViewProducts.view(getProduct);
    ViewProducts.BtnAddToCart(getProduct);
    ViewProducts.loadOfLocal();
    ViewProducts.logicOpCart();
    //3.
    Storage.saveProduct(getProduct);
});