class ProductManager {
  constructor(products = []) {
    this.products = products;
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
  }

  getProducts() {
    return this.products;
  }

  getProductsById(id) {
    let productFound = this.products.find((el) => el.code === id);

    if (!productFound) {
      console.log("ID no encontrado");
      return;
    }

    console.log(productFound);
  }
}

let pm = new ProductManager();
pm.addProducts("pan", "harina con levadura", 200, "imagen", 5);
pm.addProducts("torta", "lemon pie", 100, "imagen", 8);
pm.addProducts("jamon", "fiambre", 50, "imagen", 10);
pm.addProducts("oreos", "galletitas", 40, "imagen", 14);
pm.addProducts("jamon", "fiambre", 50, "imagen", 10);

console.log(pm.getProducts());
pm.getProductsById(2);
