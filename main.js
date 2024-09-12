import DessertController from "./src/js/controllers/DessertController";

import CartController from "./src/js/controllers/CartController";
import LazyLoader from "./src/js/lib/lazyloader";

document.addEventListener("DOMContentLoaded", async () => {
  const cartController = new CartController();
  const dessertController = new DessertController();
  await dessertController.init();

  cartController.initCart();
  new LazyLoader();
});
