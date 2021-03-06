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
const searchBox = document.querySelector('[data-search]');
const filter = document.querySelector('#filter');
let buttonsDom = [];
let cart = [];
//search object varible
const searchItem = {
    value: ''
};
const url = " http://localhost:3000/items";
let allProduct = [];
class Product {
    //1- get product from api or json file
    getProducts() {
        return productsData;
    }
}
class ViewProduct {
    view(Product) {
        let result = '';
        Product.forEach(item => {
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
                this.upDate_Bage_Totals(cart);
                Storage.saveToLocal(cart);
                this.showCartItems(addToLocal);

            });
        });
    }
    upDate_Bage_Totals(cart) {
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
    showCartItems(cartItem) {
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
        //check btn is in cart after load? yes==disable card
    checkBtn() {
            buttonsDom.forEach(btn => {
                const id = btn.dataset.id;
                // check id exist in cart or no?
                const isIncart = cart.find((item) => item.id == id);
                if (isIncart) {
                    btn.textContent = 'موجود در سبد';
                    btn.disabled = true;
                }
            });
        }
        //load items in cart on local storag
    loadOfLocal() {
            cart = Storage.getOfLocal() || [];
            cart.forEach((cartItem) => {
                this.showCartItems(cartItem);
            });
            this.upDate_Bage_Totals(cart);
            this.checkBtn();
        }
        // logic cart operation section
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
                    this.upDate_Bage_Totals(cart);
                    Storage.saveToLocal(cart);
                    target.parentElement.remove();
                    break;
                case 'fa-plus':
                    matchCart.quantity++;
                    this.upDate_Bage_Totals(cart);
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
                    this.upDate_Bage_Totals(cart);
                    Storage.saveToLocal(cart);
                    break;
            }
        });
    }
    clearCart() {
        // remove one by one shopping cart
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
        this.upDate_Bage_Totals(cart);
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
    static searchOfLocal() {
        return JSON.parse(localStorage.getItem('products'));
    }
}
class Search extends ViewProduct {
    view(product) {
        super.view(product);
    }
    searchProduct(searchItem) {
        const result = Storage.searchOfLocal().filter(item => item.title.includes(searchItem.value));
        container.innerHTML = "";
        this.view(result);
    }
    filterProduct(filterItem) {
        let result;
        if (filterItem == 'همه') {
            result = Storage.searchOfLocal();
            container.innerHTML = "";
            this.view(result);
        } else {
            result = Storage.searchOfLocal().filter(item => item.title.includes(filterItem));
            container.innerHTML = "";
            this.view(result);
        }
    }

}
const search = new Search();
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
//get search input value
function getSearchValue() {
    searchItem.value = `${searchBox.value}`;
    search.searchProduct(searchItem);
}
toggle.addEventListener('click', toggler);
cartBtn.addEventListener('click', fadeIn);
closeModal.addEventListener('click', (e) => {
    if (e.target.matches('.modal-cart')) {
        fadeOut();
    }
});
searchBox.addEventListener('input', getSearchValue);

filter.addEventListener(`change`, (e) => {
    const select = e.target;
    const text = select.selectedOptions[0].text;
    search.filterProduct(text);
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
    //4.test: get Porduct data form json-server
    axios.get(url)
        .then(response => {
            // const data = response.data;
            // data.forEach(item => allProduct.push(item));
            allProduct = response.data;
            console.log(allProduct);
        });

});
console.log(allProduct);