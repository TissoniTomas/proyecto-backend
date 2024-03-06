import { productsRouter } from "./routes/productos.router.js";
import { cartRouter } from "./routes/cart.router.js";
import { router as viewsRouter } from "./routes/views.router.js";
import { Server } from "socket.io";
import { engine } from "express-handlebars";
import path from "path";

import express from "express";
import rutaDirname from "./utils.js";


const PORT = 3000;
let io; // io

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(rutaDirname, "/public")));


app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(rutaDirname, "views"));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);
app.use("/", viewsRouter);

app.get("/", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  console.log("LA RUTA ES ", rutaDirname)
  return res.status(200).send("OK");
});

const serverHTTP = app.listen(PORT, () => {
  console.log("Servidor OK en PORT: " + PORT);
});

io = new Server(serverHTTP);

io.on("connection", (socket) => {
  console.log(`Se ha conectado un cliente con id ${socket.id}`);

  // Escuchar el evento 'actualizarProductos' desde el cliente
  socket.on('actualizarProductos', () => {
    // Emitir evento 'productosActualizados' a todos los clientes
    io.emit('productosActualizados');
  });
});

export { io }; 