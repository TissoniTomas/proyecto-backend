import { Router } from 'express';
import Handlebars from 'handlebars';
import ProductsManager from '../dao/ProductsManager.js';

let pm = new ProductsManager()

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

router.get('/chat',(req,res)=>{
  res.setHeader('Content-Type','text/html');
  res.status(200).render('chat');
})
