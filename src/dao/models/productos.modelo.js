import mongoose from "mongoose";
import  paginate  from "mongoose-paginate-v2";

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

productosSchema.plugin(paginate)

export const modeloProductos = mongoose.model(productosColl, productosSchema);

