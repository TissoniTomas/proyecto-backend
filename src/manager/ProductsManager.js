import fs from "fs";
import path from "path";
import rutaDirname from "../utils.js";

const ruta = path.join(rutaDirname, "files", "products.json");
console.log(ruta);

class ProductManager {
  constructor(path = ruta) {
    this.products;
    this.path = path;
  }

  saveProducts() {
    fs.writeFileSync(this.path, JSON.stringify(this.products, null, 5));
  }

  orderByCodeAsc() {
    this.products.sort((a, b) => a.id - b.id);
    this.saveProducts();
  }

  addProducts(prod) {
    let productos = this.getProducts();
    let repeatedItem = productos.find((p) => p.code === prod.code);
    console.log(repeatedItem);
    if (repeatedItem) {
      return { error: "Código repetido: " + repeatedItem.code };
    }

    if (typeof prod.code !== "number" || typeof prod.price !== "number" || typeof prod.stock !== "number") {
      return { error: "Los valores CODE, PRICE y STOCK deben ser de tipo NUMÉRICO" };
  }
  
    let id = 1;
    if (productos.length > 0) {
      id = productos[productos.length - 1].id + 1;
    }

    let newProduct = {
      ...prod, id,
    };

    this.products = [...productos, newProduct];
    this.saveProducts();
  }

  getProducts() {
    if (!fs.existsSync(this.path)) {
      return (this.products = []);
    }
    return JSON.parse(fs.readFileSync(this.path, "utf8"));
  }

  getProductsById(id) {
    let products = this.getProducts();
    let productFound = products.find((el) => el.id === id);

    if (!productFound) {
      
      return {error:`ID ${id} no encontrado, revisar la entrada` }
    }

    console.log(`El producto con id ${id} es el siguiente: `);
    console.log(productFound);

    return productFound;
  }

  updateProducts(id, update) {
    let productos = this.getProducts();
    let updateProductIndex = productos.findIndex(
      (product) => product.id === id
    );

    if (updateProductIndex === -1) {
      let error = new Error("El producto a actualizarse no se encuentra");
      console.log(error);
      return {error: error};
    }

    let updateProduct = { ...productos[updateProductIndex], ...update };

    productos.push(updateProduct);
    console.log("Producto actualizado con exito");
    productos.splice(updateProductIndex, 1);

    this.products = [...productos];

    this.orderByCodeAsc();

    this.saveProducts();

    return updateProduct;
  }

  deleteProducts(id) {
    let products = this.getProducts();
    let productIndex = products.findIndex((product) => product.id === id);

    let productToDelete = products[productIndex];
    if (productIndex === -1) {
      console.log("El producto a eliminarse no existe");
      return;
    }

    products.splice(productIndex, 1);
    console.log(`Producto con id ${id} eliminado con exito`);

    this.products = products;
    this.orderByCodeAsc();
    this.saveProducts();

    return productToDelete;
  }
}

export default ProductManager;
