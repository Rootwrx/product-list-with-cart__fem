import BaseView from "../core/BaseView";
import DOMUpdater from "../lib/domUpdater";
import { get } from "../utils/helpers";

class CartView extends BaseView {
  constructor() {
    super();
    this._parentElement = get(".cart");
    this._orderModalContent = get(".order-modal-content");
    this._overlay = get(".overlay");
    this._orderModal = get(".order-modal");
    this._startNewOrder = get(".start-new-order");
    this._cartCount = get("[data-count]");
  }

  _generateMarkup() {
    const { count, items, total } = this._data;
    return `
      <span class="cart-header">
        Your Cart (<span id="cart-count">${count}</span>)
      </span>
      ${
        items.length === 0
          ? this._generateEmptyCart()
          : this._generateFilledCart(items, total)
      }
    `;
  }

  _generateFilledCart(items, total) {
    return `
      ${this._generateCartItems(items)}
      ${this._generateCartFooter(total)}
    `;
  }

  _generateCartItems(items) {
    return `
      <div class="cart-items">
        ${items.map(this._generateCartItem).join("")}
      </div>
    `;
  }

  _generateCartItem(item) {
    const { id, thumbnail, name, quantity, price } = item;
    const total = (quantity * price).toFixed(2);
    return `
      <div class="cart-item" data-id="${id}">
        <img class="cart-item-thumbnail" src="${thumbnail}" alt="${name}" />
        <div class="cart-item-details">
          <p>${name}</p>
          <span>
            <span class="cart-item-quantity">${quantity}x</span>
            <span class="cart-item-price">@${price.toFixed(2)}</span>
            <span class="cart-item-total">$${total}</span>
          </span>
        </div>
        <button class="remove-item">
          <img src="icons/icon-remove-item.svg" alt="Remove item" />
        </button>
        <span class="cart-item-total confirm">$${total}</span>
      </div>
    `;
  }

  onCartIcon() {
    this._cartCount.addEventListener("click", () => {
      this._overlay.classList.add("show");
      this._parentElement.classList.add("show");

      this._parentElement.scrollTo({ top: this._parentElement.scrollHeight });
    });
  }

  _generateEmptyCart() {
    return `
      <div class="cart-empty">
        <img src="icons/illustration-empty-cart.svg" alt="Empty cart">
        <span>Your added items will appear here</span>
      </div>
    `;
  }

  _generateCartFooter(total) {
    return `
      <div class="cart-footer">
        <div class="cart-total">
          <p>
            <span>Order Total: </span>
            <span class="cart-total-price">$${total.toFixed(2)}</span>
          </p>
        </div>
        <p class="cart-delivery">
          <img src="icons/icon-carbon-neutral.svg" alt="Carbon neutral" />
          <span>This is a <b>carbon-neutral</b> delivery</span>
        </p>
        <button class="btn btn-primary confirm-order">Confirm Order</button>
      </div>
    `;
  }

  onRemoveItem(handler) {
    this._parentElement.addEventListener("click", (event) => {
      const button = event.target.closest(".remove-item");
      if (!button) return;
      const id = button.closest(".cart-item").dataset.id;
      handler(id);
    });
  }

  onConfirmOrder() {
    document.addEventListener("click", (e) => {
      const confirmButton = e.target.closest(".confirm-order");
      if (!confirmButton) return;
      confirmButton.classList.add("show");
      this.toggleModal(true);
      this.updateOrderModalContent();
    });

    this._overlay.addEventListener("click", () => {
      this.toggleModal(false);
    });
  }

  updateOrderModalContent() {
    const cartItems = get(".cart .cart-items").cloneNode(true);
    const cartTotal = get(".cart .cart-total").cloneNode(true);
    cartItems.classList.add("cloned");

    DOMUpdater.update(
      this._orderModalContent,
      `${cartItems.outerHTML}${cartTotal.outerHTML}`
    );
  }

  onStartNewOrder(handler) {
    this._startNewOrder.addEventListener("click", () => {
      handler();
      this.toggleModal(false);
    });
  }

  updateCount(count) {
    this._cartCount.dataset.count = count;
  }

  toggleModal(show) {
    this._overlay.classList.toggle("show", show);
    this._orderModal.classList.toggle("show", show);

    this._parentElement.classList.remove("show");
  }
}

export default new CartView();
