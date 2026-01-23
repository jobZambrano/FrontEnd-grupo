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