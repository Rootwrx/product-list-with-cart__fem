import DOMUpdater from "../lib/domUpdater";
import { CA } from "../utils/config";
import { formatPrice } from "../utils/helpers";

class DessertView {
  _parentElement = document.querySelector(".hero");
  _desserts = this._parentElement.querySelector(".desserts");
  _data = null;

  render(cartItems, data) {
    this._data = data;
    this._parentElement.insertAdjacentHTML(
      "afterbegin",
      this._generateMarkUp(cartItems)
    );
  }

  update(cartItems) {
    const newMarkup = this._generateMarkUp(cartItems);
    DOMUpdater.update(
      this._parentElement.querySelector(".desserts"),
      newMarkup,
      { ignore: [".dessert-image"] }
    );

    // desset img use lazy-loaded and that will update them will set the old  structure that contains data-src... , and we don't want to load an img already loaded by lazyloader
  }

  _generateItemMarkup(item, cartItems) {
    const isInCart = cartItems.find((el) => el.id == item?.id);

    item.quantity = isInCart?.quantity || 0;
    item.id = isInCart?.id || item.id;
    return `
<article class="dessert ${item.quantity != 0 && "in-cart"}" data-id="${
      item.id
    }" data-quantity="${item.quantity}">
<span class="loader"></span>           
<div class="dessert-image">
  <img 
  class="lazy"
  data-src="${item.image.mobile}"
  data-srcset="${item.image.mobile} 599w,${item.image.tablet} 799w,
  ${item.image.desktop} 800w" data-sizes="(min-width: 800px) 800px,
  (min-width: 600px) 600px,100vw"
  alt="${item.name}">
</div>

<div class="dessert-actions" aria-label="Dessert actions">

  <button class="addtocart " aria-label="Add to cart">
    <img src="icons/icon-add-to-cart.svg" alt="" aria-hidden="true"/>
    <span> Add to Cart </span>
  </button>

  <div class="dessert-quantity-controls">
    <button class="decrease"  aria-label="Decrease quantity">
      <img
        src="icons/icon-decrement-quantity.svg" alt="" aria-hidden="true"
      />
    </button>

    <span aria-live="polite"
      ><span class="dessert-quantity">${item.quantity}</span>x</span
    >

    <button class="increase" aria-label="increase quantity">
      <img src="icons/icon-increment-quantity.svg" alt="" aria-hidden="true"/>
    </button>

  </div>
</div>

<div class="dessert-details">
  <h2 class="dessert-category">${item.category}</h2>
  <h3 class="dessert-name">${item.name}</h3>
  <h4 class="dessert-price">$${formatPrice(item.price)}</h4>
</div>

</article>

  `;
  }

  _generateMarkUp(cartItems) {
    // loading for updating and for first render  based on cart data

    return `
    <article class="desserts">

   ${this._data.map((el) => this._generateItemMarkup(el, cartItems)).join("")}
    </article>
    `;
  }

  removeLoader() {
    document.querySelector(".page-loader").remove();
  }

  _handleClick(e, handler) {
    const { target } = e;
    const dessert = target.closest(".dessert");
    if (!dessert) return;

    const { id, quantity } = dessert.dataset;
    let action;

    if (target.closest(".addtocart")) action = CA.addToCart;
    if (target.closest(".decrease")) action = CA.decrease;
    if (target.closest(".increase")) action = CA.increase;

    if (action) handler({ id, quantity, action });
  }

  addHandler(handler) {
    this._parentElement.addEventListener("click", (e) => {
      this._handleClick(e, handler);
    });
  }
}

export default new DessertView();
