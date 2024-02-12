const fs = require("fs");

class ProductManager {
  constructor(path = "./files/archivo.json") {
    this.products = [];
    this.path = path;
  }

  saveProducts() {
    fs.writeFileSync(this.path, JSON.stringify(this.products, null, 5));
  }

  loadProducts() {
    try {
      const data = fs.readFileSync(this.path, "utf8");
      this.products = JSON.parse(data);
      console.log(`Los productos cargados son los siguientes: `);
      console.log(this.products);
    } catch (error) {
      this.products = [];
      console.log(this.products);
    }
  }

  orderByCodeAsc() {
    this.products.sort((a, b) => a.code - b.code);
    this.saveProducts();
  }

  addProducts(title, description, price, thumbnail, stock) {
    let repeatedItem = this.products.find((p) => p.title === title);
    if (repeatedItem) {
      console.log("Código repetido: " + repeatedItem.title);
      return;
    }

    let code = 1;
    if (this.products.length > 0) {
      code = this.products[this.products.length - 1].code + 1;
    }

    let newProduct = { code, title, description, price, thumbnail, stock };
    this.products.push(newProduct);
    this.saveProducts();
  }

  getProducts() {
    if(!fs.existsSync(this.path)){
     return this.products = []
    }
    return (JSON.parse(fs.readFileSync(this.path, "utf8")));

  }

  getProductsById(id) {
    let productFound = this.products.find((el) => el.code === id);

    if (!productFound) {
      console.log("ID no encontrado");
      return;
    }

    console.log(`El producto con id ${id} es el siguiente: `);
    console.log(productFound);
  }

  updateProducts(id, update) {
    let updateProductIndex = this.products.findIndex(
      (product) => product.code === id
    );

    if (updateProductIndex === -1) {
      let error = new Error("El producto a actualizarse no se encuentra");
      console.log(error);
      return;
    }

    let updateProduct = { ...this.products[updateProductIndex], ...update };

    this.products.push(updateProduct);
    console.log("Producto actualizado con exito");
    this.products.splice(updateProductIndex, 1);

    this.orderByCodeAsc();

    this.saveProducts();
  }

  deleteProducts(id) {
    let productToDelete = this.products.findIndex(
      (product) => product.code === id
    );
    if (productToDelete === -1) {
      console.log("El producto a eliminarse no existe");
      return;
    }

    this.products.splice(productToDelete, 1);
    console.log(`Producto con id ${id} eliminado con exito`);
    this.orderByCodeAsc();
    this.saveProducts();
  }
}

let pm = new ProductManager();


// PRUEBAS 

pm.addProducts(
  "producto prueba",
  "Este es un producto prueba",
  200,
  "Sin imagen",
  25
);
pm.addProducts(
  "producto prueba1",
  "Este es un producto prueba",
  200,
  "Sin imagen",
  25
);
pm.addProducts(
  "producto prueba2",
  "Este es un producto prueba",
  200,
  "Sin imagen",
  25
);
pm.addProducts(
  "producto prueba3",
  "Este es un producto prueba",
  200,
  "Sin imagen",
  25
);


pm.updateProducts(1, { price: 250 });

pm.getProductsById(4);

pm.deleteProducts(3);



pm.addProducts(
  "producto prueba4",
  "Este es un producto prueba",
  200,
  "Sin imagen",
  25
);

pm.loadProducts();

