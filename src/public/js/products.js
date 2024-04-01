const crearCart = () => {
    let botones = document.querySelectorAll(".creaCart");
    
    botones.forEach(boton => {
      boton.addEventListener("click", () => {
        alert("BOTON CLICK");
      });
    });
  };
  
  crearCart();
  