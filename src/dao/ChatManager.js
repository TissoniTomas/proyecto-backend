import { modelChat } from "./models/chat.modelo.js";

class ChatManager {
  async getMessages() {
    return await modelChat.find();
  }

  async putMessages(mensaje) {
    console.log(`Se recibio lo siguiente:${mensaje.nombre} dice  ${mensaje.mensaje} `);
    let mensajeAEnviar = {user: mensaje.nombre, message: mensaje.mensaje }
    return await modelChat.create(mensajeAEnviar);
  }
}

export default ChatManager;
