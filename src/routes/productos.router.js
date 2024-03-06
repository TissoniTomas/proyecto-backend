import { Router } from "express";
import { io } from '../app.js';

import ProductsManager from "../manager/ProductsManager.js";

const pm = new ProductsManager();

export const productsRouter = Router();

productsRouter.use((req, res, next) => {
  req.io = io; // Pasar la instancia de Socket.IO al objeto de solicitud
  next();
});

productsRouter.get("/", (req, res) => {
  let productosArray = pm.getProducts();
  let { limit } = req.query;

  if (!productosArray) {
    res
      .status(500)
      .json({ error: "Error interno, intente nuevamente mas tarde" });
    return;
  }
  if (limit && limit > 0) {
    productosArray = productosArray.slice(0, limit);
    res.json(productosArray);
    return;
  }

  res.json(productosArray);
});

productsRouter.get("/:id", (req, res) => {
  let { id } = req.params;
  id = Number(id);

  if (isNaN(id)) {
    res.send(
      "La busqueda no arrojo resultados, revise que el ID ingresado sea NUMERICO"
    );
    return;
  }
  let resultadoFind = pm.getProductsById(id);
  res.status(200).json(resultadoFind);
});

productsRouter.get("/*", (req, res) => {
  res.status(400).json("ERROR 404 - NOT FOUND");
});

productsRouter.post("/", (req, res) => {
  // Verificar campos faltantes
  const camposRequeridos = [
    "title",
    "description",
    "code",
    "price",
    "stock",
    "category",
    "thumbnail",
  ];
  const camposFaltantes = camposRequeridos.filter(
    (campo) => !(campo in req.body)
  );
  if (camposFaltantes.length > 0) {
    return res
      .status(400)
      .json({ error: `Campos faltantes: ${camposFaltantes.join(", ")}` });
  }

  const nuevoProduct = { ...req.body, status: true };

  let resultado = pm.addProducts(nuevoProduct);

  if (resultado && resultado.error) {
    res.setHeader("Content-Type", "application/json");
    return res.status(400).json({ error: `${resultado.error}` });
  }

  req.io.emit('productoCreado', nuevoProduct);

  res.send('Producto creado exitosamente');

  res.setHeader("Content-Type", "application/json");
  return res.status(200).json({ productoCreado: nuevoProduct });
});

productsRouter.put("/:id", (req, res) => {
  let { id } = req.params;
  id = Number(id);

  if (isNaN(id)) {
    res
      .status(400)
      .json({
        error:
          "La busqueda no arrojo resultados,  revise que el ID ingresado sea NUMERICO",
      });
    return;
  }
  let productoActualizado = pm.updateProducts(id, req.body);
  if (productoActualizado && productoActualizado.error) {
    res.setHeader("Content-Type", "application/json");
    return res.status(400).json({ error: `${productoActualizado.error}` });
  }
  res.setHeader("Content-Type", "application/json");
  return res.status(200).json({ prodcutoModificado: productoActualizado });
});

productsRouter.delete("/:id", (req, res) => {
  let { id } = req.params;
  id = Number(id);

  if (isNaN(id)) {
    res
      .status(400)
      .json({
        error:
          "La busqueda no arrojo resultados,  revise que el ID ingresado sea NUMERICO",
      });
    return;
  }
  let productoDelete = pm.deleteProducts(id);
  res.setHeader("Content-Type", "application/json");
  return res
    .status(200)
    .json({
      prodcutoEliminado: `${productoDelete.title}, ID: ${productoDelete.id}`,
    });
});
