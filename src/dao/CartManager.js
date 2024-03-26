import { modelCart } from "./models/cart.modelo.js";

class CartManager {
  async getCarts() {
    return await modelCart.find();
  }

  async addCart(cart) {
    return await modelCart.create(cart);
  }

  async getCartById(id) {
    return await modelCart.findOne({ _id: id });
  }

  async updateCart(id, update = {}) {
    return await modelCart.updateOne({ _id: id }, update);
  }

  async deleteCart(id) {
    return await modelCart.deleteOne({ _id: id });
  }
}

export default CartManager;
