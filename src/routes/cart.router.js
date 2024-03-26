import { Router } from "express";
import CartManager from "../dao/CartManager.js"

const cm = new CartManager();
export const cartRouter = Router();

cartRouter.post("/", async (req, res) => {
  const { products } = req.body;

  if (!Array.isArray(products)) {
    return res.status(400).json({ error: "Se debe proporcionar un array de productos" });
  }


  try {
    const newCart = await cm.addCart({ products });
    res.status(201).json(newCart);
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
