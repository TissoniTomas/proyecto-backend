import { Router } from 'express';

import ProductsManager from '../dao/ProductsManager.js';
import { modeloProductos } from '../dao/models/productos.modelo.js';
import { modelCart } from '../dao/models/cart.modelo.js';
import CartManager from '../dao/CartManager.js';

let cm = new CartManager()


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

  let {page, limit, sort, query } = req.query

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
  
  if(!query){
    let{docs, totalPages, prevPage,nextPage, hasNextPage, hasPrevPage} = await modeloProductos.paginate({},{limit:limit, page: page, lean:true, sort: {code : sort}})
    console.log(JSON.stringify(await modeloProductos.paginate({},{limit:10, page: page, lean:true})
    , null, 5))
    res.setHeader('Content-Type','text/html');
    return res.status(200).render("products",{
      docs, totalPages, prevPage,nextPage, hasNextPage, hasPrevPage
    })

  }

  let{docs, totalPages, prevPage,nextPage, hasNextPage, hasPrevPage} = await modeloProductos.find({query}).paginate({},{limit:limit, page: page, lean:true, sort: {code : sort}})
  console.log(JSON.stringify(await modeloProductos.paginate({},{limit:10, page: page, lean:true})
  , null, 5))

  
  res.setHeader('Content-Type','text/html');
    return res.status(200).render("products",{
      docs, totalPages, prevPage,nextPage, hasNextPage, hasPrevPage
    })
  
})

router.get('/chat',(req,res)=>{
  res.setHeader('Content-Type','text/html');
  res.status(200).render('chat');
})

router.get('/carts/:cid', async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = await cm.getCartById(cartId);
    
    console.log(JSON.stringify(cart,null,5))
    console.log(cart)
    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }
    res.render('cart', { cart: cart }); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener el carrito' });
  }
});
