import { modeloProductos } from "./models/productos.modelo.js";
import mongoose from "mongoose";

class ProductManager {
  async getProducts() {
    return await modeloProductos.find().lean();
  }



  async addProducts(prod) {
    let productoRepetido = await this.getProductsByCode(prod.code);
    if (productoRepetido) {
      return { error: "Código repetido: " + productoRepetido.code };
    }

    if (
      typeof prod !== "object" ||
      typeof prod.code !== "number" ||
      typeof prod.price !== "number" ||
      typeof prod.stock !== "number"
    ) {
      return {
        error: "Los valores CODE, PRICE y STOCK deben ser de tipo NUMÉRICO",
      };
    }

    return await modeloProductos.create(prod);
  }

  async getProductsById(id) {
    return await modeloProductos.findOne({ _id: id });
  }

  async getProductBy(filtro) {
    return await modeloProductos.findOne(filtro);
  }

  async updateProducts(id, update = {}) {
    return await modeloProductos.updateOne({ _id: id }, update);
  }

  async deleteProducts(id) {
    return await modeloProductos.deleteOne({ _id: id });
  }
}

export default ProductManager;
