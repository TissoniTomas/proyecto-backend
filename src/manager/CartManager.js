import fs from "fs";
import path from "path";
import rutaDirname from "../utils.js";

const ruta = path.join(rutaDirname, "files", "cart.json");

class CartManager {
  constructor(path = ruta) {
    this.path = path;
    this.cart;
  }
  saveCart() {
    fs.writeFileSync(this.path, JSON.stringify(this.cart, null, 5));
  }

  viewCart() {
    if (!fs.existsSync(this.path)) {
      return (this.cart = []);
    }

    this.cart = JSON.parse(fs.readFileSync(this.path, "utf8"));
    return this.cart;
  }

  orderByIdAsc() {
    this.cart.sort((a, b) => a.id - b.id);
  }

  addCart(prod) {
    let cart = this.viewCart();
   

    let id = 1;
    if (cart.length > 0) {
      id = Math.max(...cart.map((d) => d.id)) + 1;
    }

    let newCart = [...prod];

    this.cart = [...cart, { id, products: [...newCart] }];
    this.saveCart();

    return this.cart;
  }

  getCartById(id) {
    let cart = this.viewCart();

    if (isNaN(id)) {
      console.log("El ID debe ser de tipo numerico");
      return;
    }
    let getCart = cart.find((el) => el.id === id);
    if (!getCart) {
      console.log("No existe el elemento con id:", id);
      return null;
    }

    return getCart;
  }

  updateCart(id, update) {
    let cart = this.viewCart();

    if (isNaN(id)) {
      console.log("El ID debe ser de tipo numerico");
      return;
    }
    let findCart = cart.findIndex((item) => item.id === id);

    if (findCart === -1) {
      console.log("Error: Item a modificar no existe");
      return;
    }

    let updatedItem = { ...cart[findCart], ...update };
    cart.splice(findCart, 1);

    this.cart = [...cart, updatedItem];

    this.orderByIdAsc();

    this.saveCart();

    return this.cart;
  }

  deleteItemCart(id) {
    let cart = this.viewCart();

    if (isNaN(id)) {
      console.log("El ID debe ser de tipo numerico");
      return;
    }
    let findCart = cart.findIndex((item) => item.id === id);

    if (findCart === -1) {
      console.log("Error: Item a eliminar no existe");
      return;
    }

    cart.splice(findCart, 1);

    this.cart = cart;
    console.log("Item eliminado con exito");
    this.orderByIdAsc();
    this.saveCart();

    return this.cart;
  }

  addProductToCart(id, pid, quantity) {
    let cart = this.viewCart();

    let cartIndex = cart.findIndex((el) => el.id === id);

    if (cartIndex === -1) {
      return null;
    }

    let productCartIndex = cart[cartIndex].products.findIndex(
      (prod) => prod.pid === pid
    );
    if (productCartIndex == -1) {
      cart[cartIndex].products.push({pid,quantity});
      this.cart = [...cart];
      this.saveCart();
      return cart[cartIndex].products
    }

    cart[cartIndex].products[productCartIndex].quantity += quantity;
    this.cart = [...cart];
    this.saveCart();

    return cart[cartIndex].products[productCartIndex]

   
  }
}

export default CartManager;

let cm = new CartManager();


