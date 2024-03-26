import mongoose from "mongoose";

const cartColl = "cart";
const cartSchema = new mongoose.Schema(
  {
    // Identificador único generado por MongoDB
     // Tipo de dato: Número entero
    products: [
      {
        pid: Number, // Tipo de dato: Número entero (identificador de producto)
        quantity: Number, // Tipo de dato: Número entero (cantidad)
      },
    ],
  },
  {
    timestamps: true,
    strict: false,
  }
);

export const modelCart = mongoose.model(cartColl, cartSchema);
