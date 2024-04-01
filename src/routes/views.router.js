import { Router } from 'express';

import ProductsManager from '../dao/ProductsManager.js';
import { modeloProductos } from '../dao/models/productos.modelo.js';


let pm = new ProductsManager()

export const router=Router()


router.get('/home',(req,res)=>{
    let products = pm.getProducts()
    res.setHeader('Content-Type','text/html');
    res.status(200).render("home",{
      products
    })
})

router.get('/products', async(req,res)=>{

  let {page, limit, sort, } = req.query

  if(!limit){
    limit = 10
  }

  if(sort && sort === -1){
    sort = -1
  }else{
    sort = 1
  }

  if(!page){
     page = 1
  }

  

  let{docs, totalPages, prevPage,nextPage, hasNextPage, hasPrevPage} = await modeloProductos.paginate({},{limit:limit, page: page, lean:true, sort: {code : sort}})
  console.log(JSON.stringify(await modeloProductos.paginate({},{limit:10, page: page, lean:true})
  , null, 5))
  
  res.setHeader('Content-Type','text/html');
  res.status(200).render("realTimeProducts",{
    docs, totalPages, prevPage,nextPage, hasNextPage, hasPrevPage
  })
})

router.get('/chat',(req,res)=>{
  res.setHeader('Content-Type','text/html');
  res.status(200).render('chat');
})
