import { Router } from "express";
import CartManager from "../dao/CartManager.js"

const cm = new CartManager();
export const cartRouter = Router();

cartRouter.post("/", async (req, res) => {
  const { products, productId, quantity } = req.body;

  const updatedCart = await cm.addProductToCart(productId, quantity);

  try {
    const newCart = await cm.addCart({ products });
    res.status(201).json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: "Error al agregar el carrito" });
  }
});

cartRouter.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const cart = await cm.getCartById(id);
    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el carrito" });
  }
});

cartRouter.post("/:id/product/:pid", async (req, res) => {
  const { id, pid } = req.params;
  const { quantity } = req.body;


  if (typeof quantity !== "number" || quantity <= 0) {
    return res.status(400).json({ error: "La cantidad debe ser un número entero positivo" });
  }

  // Agregar el producto al carrito
  try {
    const updatedCart = await cm.addProductToCart(id, pid, quantity);
    if (!updatedCart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }
    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: "Error al agregar el producto al carrito" });
  }
});

cartRouter.delete("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;

  try {
    const updatedCart = await cm.removeProductFromCart(cid, pid);
    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el producto del carrito" });
  }
});

cartRouter.put("/:cid", async (req, res) => {
  const { cid } = req.params;
  const { products } = req.body;

  if (!Array.isArray(products)) {
    return res.status(400).json({ error: "Se debe proporcionar un array de productos" });
  }

  try {
    const updatedCart = await cm.updateCart(cid, products);
    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el carrito" });
  }
});

cartRouter.put("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  if (typeof quantity !== "number" || quantity <= 0) {
    return res.status(400).json({ error: "La cantidad debe ser un número entero positivo" });
  }

  try {
    const updatedCart = await cm.updateProductQuantity(cid, pid, quantity);
    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar la cantidad del producto en el carrito" });
  }
});

cartRouter.delete("/:cid", async (req, res) => {
  const { cid } = req.params;

  try {
    await cm.deleteCart(cid);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el carrito" });
  }
});

