import mongoose from "mongoose";
import { modeloProductos } from "./productos.modelo.js";


const cartColl = "cart";
const cartSchema = new mongoose.Schema(
  {
    carrito: String,
    products: {
      type: [
        {
          producto: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "modeloProductos",
          },
          quantity: Number,
        },
      ],
    },
  },
  {
    timestamps: true,
    strict: false,
  }
);

// Middleware PRE por instruccion
cartSchema.pre("find", function(){
  this.populate({
    path:'products.producto',
    model: modeloProductos,
    
  }).lean()
})


export const modelCart = mongoose.model(cartColl, cartSchema);
