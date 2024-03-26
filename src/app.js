import { productsRouter } from "./routes/productos.router.js";
import { cartRouter } from "./routes/cart.router.js";
import { router as viewsRouter } from "./routes/views.router.js";
import { router as chatRouter } from "./routes/chat.router.js";
import { Server } from "socket.io";
import { engine } from "express-handlebars";
import path from "path";
import mongoose from "mongoose";

import express from "express";
import rutaDirname from "./utils.js";

import ChatManager from "./dao/ChatManager.js";

let chatM = new ChatManager();

const PORT = 3000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(rutaDirname, "/public")));

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(rutaDirname, "views"));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);
app.use("/api/chat", chatRouter);
app.use("/", viewsRouter);

app.get("/", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  console.log("LA RUTA ES ", rutaDirname);
  return res.status(200).send("OK");
});

const server = app.listen(PORT, () => {
  console.log("Servidor OK en PORT: " + PORT);
});

let mensajes = [];

let usuarios = [];

const io = new Server(server); // websocket server

io.on("connection",  (socket) => {
  console.log(`Se conecto un cliente con id ${socket.id}`);

  socket.on("presentacion", (nombre) => {
    usuarios.push({ id: socket.id, nombre });
    socket.emit("historial", mensajes);

    socket.broadcast.emit("nuevoUsuario", nombre);
  });

  socket.on("mensaje",  async(nombre, mensaje) => {
    mensajes.push(Mensaje)
    let Mensaje = {nombre, mensaje}
    await chatM.putMessages( Mensaje );
    io.emit("nuevoMensaje", nombre, mensaje);
  });

  socket.on("disconnect", () => {
    let usuario = usuarios.find((u) => u.id === socket.id);
    if (usuario) {
      socket.broadcast.emit("saleUsuario", usuario.nombre);
    }
  });
});

export { io };

const conectar = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://tissonitomas5:fortinero15@cluster0.eektac7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
      { dbName: "ecommerce" }
    );
    console.log(`Conexión a DB establecida`);
  } catch (err) {
    console.log(`Error al conectarse con el servidor de BD: ${err.message}`);
  }
};

conectar();
