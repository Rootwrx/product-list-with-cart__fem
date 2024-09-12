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
    this.view.AddHandler(this.removeItem.bind(this));
    // update the count
    this.view.updateCount(this.model.cart.count);
    this.view.AddHandlerConfirm();
    this.view.AddHandlerStartNewOrder(this.startNewOrder.bind(this));
    this.view.addHanlderCartIcon() ;
  }

  update() {
    this.view.update(this.model.cart);
    this.view.updateCount(this.model.cart.count);
  }

  startNewOrder() {
    this.model.reset();
  }

  removeItem(id) {
    // remove some elment => change data => run this.update
    this.model.remove(id);
  }
}

export default CartController;
