import mongoose from "mongoose";

const productosColl = "products";
const productosSchema = new mongoose.Schema(
    {
        title: String,
        description: String,
        code:{
            type: Number,
            required: true,
            unique: true
        },
        price: Number, 
        stock: Number,
        category: String,   
      

    },
    {
        timestamps: true, strict: false
    }
)

export const modeloProductos = mongoose.model(productosColl, productosSchema);