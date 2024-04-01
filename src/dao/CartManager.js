import { modelCart } from "./models/cart.modelo.js";
import { modeloProductos } from "./models/productos.modelo.js";

class CartManager {
  async getCarts() {
    return await modelCart.find();
  }

  async addCart(cart) {
    return await modelCart.create(cart);
  }

  async getCartById(id) {
    return await modelCart.find({ _id: id });
  }

  async updateCart(id, update = {}) {
    return await modelCart.updateOne({ _id: id }, update);
  }

  async deleteCart(id) {
    return await modelCart.deleteOne({ _id: id });
  }
}

export default CartManager;
