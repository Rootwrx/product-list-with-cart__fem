import CartModel from "../models/CartModel";
import CartView from "../views/CartView";

class CartController {
  constructor() {
    this.model = CartModel;
    this.view = CartView;
    this.model.subscribe(this);
  }

  initCart() {
    this.view.render(this.model.cart);
    // update the count
    this.view.updateCount(this.model.cart.count);
    this._setupEventHandlers();
  }

  update() {
    this.view.update(this.model.cart);
    this.view.updateCount(this.model.cart.count);
  }

  _setupEventHandlers() {
    this.view.onRemoveItem(this.removeItem.bind(this));
    this.view.onConfirmOrder();
    this.view.onStartNewOrder(this.startNewOrder.bind(this));
    this.view.onCartIcon();
  }

  startNewOrder() {
    this.model.reset();
  }

  removeItem(id) {
    this.model.remove(id);
  }
}

export default CartController;
