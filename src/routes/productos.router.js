import { Router } from "express";
import { io } from "../app.js";
import ProductsManager from "../dao/ProductsManager.js";
import mongoose from "mongoose";

export const productsRouter = Router();

const pm = new ProductsManager();

productsRouter.use((req, res, next) => {
  req.io = io;
  next();
});

productsRouter.get("/", async (req, res) => {
  try {
    let productsArray = await pm.getProducts();
    let { limit } = req.query;
    if (limit && limit > 0) {
      productsArray = productsArray.slice(0, limit);
      res.json(productsArray);
      return;
    }
    return res.json(productsArray);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error interno, intente nuevamente mas tarde" });
    return;
  }
});

productsRouter.get("/:id", async (req, res) => {
  let { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.setHeader("Content-Type", "application/json");
    return res.status(400).json({ error: `ID Invalido ` });
  }

  try {
    let resultadoFind = await pm.getProductsById(id);
    if (!resultadoFind) {
      return res
        .status(400)
        .json({ resultado: "No se encuentra el usuario con el id", id });
    }

    return res.status(200).json(resultadoFind);
  } catch (error) {
    return res.status(500).json({ error: "La busqueda no arroja resultados" });
  }
});

productsRouter.post("/", async (req, res) => {
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

  let resultado = await pm.addProducts(nuevoProduct);

  if (resultado && resultado.error) {
    res.setHeader("Content-Type", "application/json");
    return res.status(400).json({ error: `${resultado.error}` });
  }

  req.io.emit("productoCreado", resultado);

  res.setHeader("Content-Type", "application/json");
  return res.status(200).json({ productoCreado: resultado });
});

productsRouter.put("/:id", async (req, res) => {
  let { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.setHeader("Content-Type", "application/json");
    return res.status(400).json({ error: `ID Invalido ` });
  }

  let datosAModificar = req.body;

  if (datosAModificar._id) {
    delete datosAModificar._id;
  }

  if (datosAModificar.code) {
    let existe = await pm.getProductBy({
      code: datosAModificar.code,
      _id: { $ne: id },
    });
    if (existe) {
      res.setHeader("Content-Type", "application/json");
      return res
        .status(400)
        .json({ error: `Code ya existente en usuario ${id}` });
    }
  }

  try {
    let productoActualizado = pm.updateProducts(id, datosAModificar);
    if ((await productoActualizado.modifiedCount) > 0) {
      res.setHeader("Content-Type", "application/json");
      return res
        .status(200)
        .json({ estado: `Usuario actualizado con id ${id}` });
    }
  } catch (error) {
    res.setHeader("Content-Type", "application/json");
    return res.status(400).json({ error: `${error.message}` });
  }
});

productsRouter.delete("/:id", async (req, res) => {
  let { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.setHeader("Content-Type", "application/json");
    return res.status(400).json({ error: `ID Invalido ` });
  }

  
  try {
    let productoDelete = pm.deleteProducts(id);
    if (((await productoDelete).deletedCount) > 0) {
      res.setHeader("Content-Type", "application/json");
      return res
        .status(200)
        .json({ estado: `Usuario eliminado con id ${id}` });
    }
  } catch (error) {
    res.setHeader("Content-Type", "application/json");
    return res.status(400).json({ error: `${error.message}` });
  }
});

productsRouter.get("/*", (req, res) => {
  res.status(400).json("ERROR 404 - NOT FOUND");
});
