import BaseView from "../core/BaseView";
import DOMUpdater from "../lib/domUpdater";
import { get } from "../utils/helpers";

class CartView extends BaseView{
  _data = null;
  _parentElement = get(".cart");
  _orderModalContent = get(".order-modal-content");
  _overlay = get(".overlay");
  _orderModal = get(".order-modal");
  _startNewOrder = get(".start-new-order");
  _cartCount = get("[data-count]");



  AddHandler(handler) {
    this._parentElement.addEventListener("click", (event) => {
      this.handleClick(event, handler);
    });
  }

  updateCount(count) {
    this._cartCount.dataset.count = count;
  }

  handleClick(e, handler) {
    const { target } = e;
    const button = target.closest(".remove-item");
    if (!button) return;
    const id = button.closest(".cart-item").dataset.id;

    handler(id);
  }

  _generateMarkup() {
    return `
          <span class="cart-header"
            >Your Cart (<span id="cart-count">${this._data.count}</span>)</span
          >

          ${
            this._data.items.length == 0
              ? this._generateEmptyCart()
              : `
              ${this._generateCartItems()}
              ${this._generateCartFooter()}`
          }

        `;
  }

  _generateCartItems() {
    return `
<div class="cart-items">
        ${this._data.items
          .map((obj) => {
            return `
<div class="cart-item" data-id="${obj.id}">
   <img class="cart-item-thumbnail" src="${obj?.thumbnail}" alt="${
              obj.name
            }" /> 
    <div class="cart-item-details">
    <p>${obj.name}</p>
    <span>
        <span class="cart-item-quantity">${obj.quantity}x</span>
        <span class="cart-item-price">@${obj.price.toFixed(2)}</span>
        <span class="cart-item-total">$${(obj.quantity * obj.price).toFixed(
          2
        )}</span>
    </span>
    </div>
    <button class="remove-item">
    <img src="icons/icon-remove-item.svg" alt="" />
    </button>
    <span class="cart-item-total confirm">$${(obj.quantity * obj.price).toFixed(
      2
    )}</span>
</div>
    `;
          })
          .join("")}
    </div>

    `;
  }

  addHanlderCartIcon() {
    this._cartCount.addEventListener(
      "click",
      function () {
        this._overlay.classList.add("show");
        this._parentElement.classList.add("show");
        this._parentElement.scrollTo({
          top: this._parentElement.scrollHeight,
        });
      }.bind(this)
    );
  }

  _generateEmptyCart() {
    return `
    <div class="cart-empty">
      <img src="icons/illustration-empty-cart.svg" alt="">
      <span>Your added items will appear here</span>
    </div>
  `;
  }

  _generateCartFooter() {
    return `
    <div class="cart-footer">
      <div class="cart-total">
        <p>
          <span>Order Total: </span>
          <span class="cart-total-price">$${this._data.total.toFixed(2)}</span>
        </p>
      </div>
      <p class="cart-delivery">
        <img src="icons/icon-carbon-neutral.svg" alt="" />
        <span> this is a <b> carbon-neutral</b> delivery</span>
      </p>
      <button class="btn btn-primary confirm-order">Confirm Order</button>
    </div>
  `;
  }

  AddHandlerConfirm() {
    document.addEventListener(
      "click",
      function (e) {
        if (!e.target.closest(".confirm-order")) return;
        e.target.classList.add("show");
        this.toggler(true);

        const cartItems = document
          .querySelector(".cart .cart-items")
          .cloneNode(true);

        const cartTotal = document
          .querySelector(".cart .cart-total")
          .cloneNode(true);

        cartItems.classList.add("cloned");

        DOMUpdater.update(
          this._orderModalContent,
          `
          ${cartItems.outerHTML}
          ${cartTotal.outerHTML}
          `
        );
      }.bind(this)
    );

    this._overlay.addEventListener(
      "click",
      function () {
        this.toggler(false);
        this._parentElement.classList.remove("show");
      }.bind(this)
    );
  }

  AddHandlerStartNewOrder(handler) {
    this._startNewOrder.addEventListener(
      "click",
      function (e) {
        handler();
        this.toggler(false);
      }.bind(this)
    );
  }

  toggler(show) {
    this._overlay.classList.toggle("show", show);
    this._orderModal.classList.toggle("show", show);
  }
}

export default new CartView();
