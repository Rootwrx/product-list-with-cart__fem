import BaseView from "../core/BaseView";
import { CA } from "../utils/config";
import { formatPrice } from "../utils/helpers";

class DessertView extends BaseView {
  _parentElement = document.querySelector(".desserts-items");


  update(data) {
    super.update(data, {
      ignore: [".dessert-image"],
    });
  }

  _generateMarkup() {
    return `
        ${this._data.desserts
          .map((item) => this._generateItemMarkup(item))
          .join("")}
    `;
  }

  _generateItemMarkup(item) {
    const cartItem = this._data.cartItems.find((el) => el.id == item?.id);
    const quantity = cartItem?.quantity || 0;
    const inCart = quantity !== 0;

    return `
      <article class="dessert ${inCart ? "in-cart" : ""}" data-id="${
      item.id
    }" data-quantity="${quantity}">
        <span class="loader"></span>
        ${this._generateDessertImage(item)}
        ${this._generateDessertActions(quantity)}
        ${this._generateDessertDetails(item)}
      </article>
    `;
  }

  _generateDessertImage(item) {
    return `
      <div class="dessert-image">
        <img 
          class="lazy"
          data-src="${item.image.mobile}"
          data-srcset="${item.image.mobile} 599w, ${item.image.tablet} 799w, ${item.image.desktop} 800w"
          data-sizes="(min-width: 800px) 800px, (min-width: 600px) 600px, 100vw"
          alt="${item.name}">
      </div>
    `;
  }

  _generateDessertActions(quantity) {
    return `
      <div class="dessert-actions" aria-label="Dessert actions">
        <button class="addtocart" aria-label="Add to cart">
          <img src="icons/icon-add-to-cart.svg" alt="" aria-hidden="true"/>
          <span>Add to Cart</span>
        </button>
        <div class="dessert-quantity-controls">
          <button class="decrease" aria-label="Decrease quantity">
            <img src="icons/icon-decrement-quantity.svg" alt="" aria-hidden="true"/>
          </button>
          <span aria-live="polite"><span class="dessert-quantity">${quantity}</span>x</span>
          <button class="increase" aria-label="increase quantity">
            <img src="icons/icon-increment-quantity.svg" alt="" aria-hidden="true"/>
          </button>
        </div>
      </div>
    `;
  }

  _generateDessertDetails(item) {
    return `
      <div class="dessert-details">
        <h2 class="dessert-category">${item.category}</h2>
        <h3 class="dessert-name">${item.name}</h3>
        <h4 class="dessert-price">$${formatPrice(item.price)}</h4>
      </div>
    `;
  }

  removeLoader() {
    document.querySelector(".page-loader").remove();
  }

  onQuantity(handler) {
    this._parentElement.addEventListener(
      "click",
      function (e) {
        const dessert = e.target.closest(".dessert");
        if (!dessert) return;

        const { id, quantity } = dessert.dataset;
        let action;

        if (e.target.closest(".addtocart")) action = CA.addToCart;
        if (e.target.closest(".decrease")) action = CA.decrease;
        if (e.target.closest(".increase")) action = CA.increase;

        if (action) handler({ id, quantity, action });
      }.bind(this)
    );
  }
}

export default new DessertView();
