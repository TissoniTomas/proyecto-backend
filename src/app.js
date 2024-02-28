import { productsRouter } from "./routes/productos.router.js";
import { cartRouter } from "./routes/cart.router.js";

import express from "express";

const PORT = 3000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter )

app.listen(PORT, () => {
  console.log("Servidor OK en PORT: " + PORT);
});
