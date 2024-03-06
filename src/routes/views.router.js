import { Router } from 'express';
import Handlebars from 'handlebars';
import ProductManager from "../manager/ProductsManager.js"

let pm = new ProductManager()

export const router=Router()


router.get('/home',(req,res)=>{
    let products = pm.getProducts()
    res.status(200).render("home",{
      products
    })
})

router.get('/realtimeproducts',(req,res)=>{
  let products = pm.getProducts()
  res.status(200).render("realTimeProducts",{
    products
  })
})
