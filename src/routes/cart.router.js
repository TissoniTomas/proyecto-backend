import { Router } from "express";
import CartManager from "../manager/CartManager.js";

const cm = new CartManager();
export const cartRouter = Router();

cartRouter.post("/", (req, res) => {
  const { products } = req.body;
  const camposRequeridos = ["products"];
  const camposAusentes = camposRequeridos.filter((item) => !(item in req.body));
  if (camposAusentes.length > 0) {
    res.status(400).json({ error: `Debe incluirse un array de Productos` });
  }

  if (!Array.isArray(products)) {
    res.setHeader("Content-Type", "application/json");
    return res
      .status(400)
      .json({ error: `La solicitud PRODUCTS debe ser de tipo ARRAY` });
  }

  for (const product of products) {
    if (!("pid" in product) || !("quantity" in product)) {
      res.setHeader("Content-Type", "application/json");
      return res
        .status(400)
        .json({
          error: 'Cada producto debe tener las claves "pid" y "quantity"',
        });
    }
  }

 

  cm.addCart(products);

  res.setHeader("Content-Type", "application/json");
  return res
    .status(200)
    .json({ status: "Producto agregado al cart correctamente" });
});

cartRouter.get("/:id", (req, res) => {
  let { id } = req.params;
  id = Number(id);

  if (isNaN(id)) {
    res.status(400).json({
      error:
        "La busqueda no arrojo resultados, el ID debe ser de tipo NUMERICO",
    });
    return;
  }

  let cartID = cm.getCartById(id);
  if (cartID === null) {
    res.setHeader("Content-Type", "application/json");
    return res.status(400).json({
      error: `La busqueda no arrojo resultados, el elemento buscado no existe`,
    });
  }

  res.setHeader("Content-Type", "application/json");
  return res.status(200).json({ busqueda: cartID });
});

cartRouter.post("/:id/product/:pid", (req, res) => {
  let { id, pid } = req.params;
  id = Number(id);
  pid = Number(pid);

  if (isNaN(id) || isNaN(pid)) {
    res.status(400).json({
      error:
        "La busqueda no arrojo resultados, el ID debe ser de tipo NUMERICO",
    });
    return;
  }
  const { quantity } = req.body;
  if (typeof req.body !== "object" || typeof quantity !== "number") {
    res.setHeader("Content-Type", "application/json");
    return res
      .status(400)
      .json({
        error: `Debe proporcionar un objeto con la propiedad QUANTITY y la cantidad a modificar`,
      });
  }

  let productoAgregado = cm.addProductToCart(id, pid, quantity);

  if (productoAgregado === null) {
    res.setHeader("Content-Type", "application/json");
    return res
      .status(400)
      .json({ error: `El carrito a agregarse no existe, revise el ID` });
  }

  res.setHeader("Content-Type", "application/json");
  return res
    .status(200)
    .json({
      success: `El producto fue agregado correctamente: ${productoAgregado}`,
    });
});
