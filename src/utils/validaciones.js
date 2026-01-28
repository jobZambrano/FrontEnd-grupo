   export const soloLetras = (texto) => {
    let letrasRegex = /^[A-ZÑa-zñáéíóúÁÉÍÓÚ'° ]+$/;
    if (letrasRegex.test(texto)) {
      return true;
    } else {
      return false;
    }

  }
export const validarTelefonoBasico = (telefono) => {
    let telefonoRegex = /^[0-9]{6,15}$/;
    if (telefonoRegex.test(telefono)) {
        return true;
    } else {
        return false;
    }
};
export const validarPrecio = (texto) => {
    let preRegex = /^\d+([.,]\d+)?$/;
    if (preRegex.test(texto)) {
      return true;
    } else {
      return false;
    }

  }
   export const validarDescripcion = (texto) => {
    let descRegex = /^[a-zA-Z0-9\s.,;:'"-]+$/;
    if (descRegex.test(texto)) {
      return true;
    } else {
      return false;
    }

  }