import CartModel from "../models/CartModel";
import DessertModel from "../models/DessertModel";
import DessertView from "../views/DessertView";

class DessertController {
  constructor() {
    this.model = DessertModel;
    this.view = DessertView;
    this.cartModel = CartModel;
    this.cartModel.subscribe(this);
  }

  async init() {
    // getting data from the model (http request)
    await this.model.fetchDesserts();
    // rendering data to view
    this.view.render(this.cartModel.cart.items, this.model.getDesserts());
    // removing loader after almost everything loaded
    setTimeout(() => this.view.removeLoader(), 500);

    this.view.addHandler(this.controlDessertActions.bind(this));
  }

  controlDessertActions({ id, quantity, action }) {
    const element = this.model.desserts.find((el) => el.id == id);
    if (!element) return;

    this.cartModel.configureCart({
      element,
      quantity: quantity || element.quantity,
      action,
    });
    // the view will be update becasue we have this.update that runs whenever cartmodel stata changes
  }

  update() {
    this.view.update(this.cartModel.cart.items);
  }
}

export default DessertController;
