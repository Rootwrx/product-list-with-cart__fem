import { getJson } from "../utils/helpers";

class DessertModel {
  constructor() {
    this.desserts = [];
  }

  async fetchDesserts() {
    try {
      const data = await getJson("/data/desserts.json");
      this.desserts = data.map((el) => {
        el.quantity = 0;
        return el;
      });
    } catch (error) {
      throw error;
    }
  }

  getDesserts() {
    return this.desserts;
  }
}

export default new DessertModel();
