import { modelCart } from "./models/cart.modelo.js";


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
  async removeProductFromCart(cartId, productId) {
    try {
      const cart = await modelCart.findById(cartId);
      if (!cart) {
        throw new Error("Carrito no encontrado");
      }
      cart.products = cart.products.filter(product => product._id.toString() !== productId);
      await cart.save();
      return cart;
    } catch (error) {
      throw error;
    }
  }

  async updateCart(cartId, newProducts) {
    try {
      const cart = await modelCart.findById(cartId);
      if (!cart) {
        throw new Error("Carrito no encontrado");
      }
      cart.products = newProducts;
      await cart.save();
      return cart;
    } catch (error) {
      throw error;
    }
  }

  async updateProductQuantity(cartId, productId, newQuantity) {
    try {
      const cart = await modelCart.findById(cartId);
      if (!cart) {
        throw new Error("Carrito no encontrado");
      }
      const product = cart.products.find(product => product._id.toString() === productId);
      if (!product) {
        throw new Error("Producto no encontrado en el carrito");
      }
      product.quantity = newQuantity;
      await cart.save();
      return cart;
    } catch (error) {
      throw error;
    }
  }

  async deleteCart(cartId) {
    try {
      const cart = await modelCart.findById(cartId);
      if (!cart) {
        throw new Error("Carrito no encontrado");
      }
      await cart.remove();
    } catch (error) {
      throw error;
    }
  }

  async addProductToCart(productId, quantity) {
    try {
      // Buscar el carrito existente del usuario o crear uno nuevo si no existe
      let cart = await modelCart.findOne(); // Aquí debes implementar la lógica para encontrar el carrito adecuado

      if (!cart) {
        // Si no se encontró un carrito existente, crear uno nuevo
        cart = await modelCart.create({ products: [{ productId, quantity }] });
      } else {
        // Si se encontró un carrito existente, agregar el producto al carrito o actualizar la cantidad si ya existe
        const existingProductIndex = cart.products.findIndex(product => product.productId === productId);
        if (existingProductIndex !== -1) {
          // Si el producto ya está en el carrito, actualizar la cantidad
          cart.products[existingProductIndex].quantity += quantity;
        } else {
          // Si el producto no está en el carrito, agregarlo
          cart.products.push({ productId, quantity });
        }
        // Guardar los cambios en el carrito
        await cart.save();
      }

      return cart;
    } catch (error) {
      throw error;
    }
  }

}



export default CartManager;
