const express = require("express");

const productsFile = require("../files/archivo.json");

const PORT = 3000;

const app = express();
console.log(productsFile);

app.get("/productos", (req, res) => {
  let productosArray = productsFile;
  let { limit, skip } = req.query;

  if (limit && limit > 0) {
    productosArray = productosArray.slice(0, limit);
    res.json(productosArray);
    return;
  }


  if (!productsFile) {
    res.send("Error en la carga de los archivos, intente nuevamente");
    return;
  }

  res.json(productosArray);
});

app.get("/productos/:id",(req,res)=>{
   
    let {id} = req.params
    id = Number(id);

   if( id > 10 || isNaN(id) ){
    res.send("La busqueda no arrojo resultados, revise el id ingresado");
    return

   }
   console.log(productsFile)
   let resultadoFind = productsFile.find((producto)=>producto.code === id);
   console.log(resultadoFind);
   res.json(resultadoFind)

})

app.get("/*", (req, res) => {
  res.send("ERROR 404 - NOT FOUND");
});

app.listen(PORT, () => {
  console.log("Servidor OK en PORT: " + PORT);
});
