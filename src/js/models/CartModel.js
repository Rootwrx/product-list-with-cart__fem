import BaseModel from "../core/BaseModel";
import { CA } from "../utils/config";

class CartModel extends BaseModel {
  constructor() {
    super();
    this.cart = JSON.parse(localStorage.getItem("cart")) || {
      items: [],
      count: 0,
      total: 0,
    };
  }

  configureCart({ element, action }) {
    const cartItem = this.cart.items.find((el) => el.id == element.id);
    switch (action) {
      case CA.addToCart:
        this.addToCart(element);
        break;
      case CA.decrease:
        this.decrease(cartItem);
        break;
      case CA.increase:
        this.increase(cartItem);
        break;
    }

    this.updateTotal();
    this.save();

    // notify the cartControler to update the view
    this.notify();
  }

  addToCart(element) {
    this.cart.items.unshift({
      thumbnail: element.image.thumbnail,
      id: element.id,
      price: element.price,
      quantity: 1,
      name: element.name,
    });
  }

  decrease(item) {
    if (item.quantity > 1) return (item.quantity -= 1);
    const index = this.cart.items.findIndex((el) => el.id == item.id);
    this.cart.items.splice(index, 1);
  }

  increase(item) {
    item.quantity += 1;
  }

  save() {
    localStorage.setItem("cart", JSON.stringify(this.cart));
  }

  remove(id) {
    this.decrease({ quantity: 0, id });
    this.updateTotal();
    this.save();
    this.notify();
  }

  reset() {
    this.cart = {
      items: [],
      count: 0,
      total: 0,
    };

    this.notify();
  }
  
  updateTotal() {
    this.cart.count = this.cart.items.reduce((acc, el) => acc + el.quantity, 0);
    this.cart.total = this.cart.items.reduce(
      (acc, el) => acc + el.quantity * el.price,
      0
    );
  }
}

export default new CartModel();
