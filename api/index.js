const solvePath = require('./resolve-path');
const responseLinksValidate = require('./resolve-links-response')


const mdLinks = (path, ...option) => {

 //la ruta ingresada se convierte a absoluta por defecto 
const validatedPath = solvePath(path)['absolutePath'];

if (solvePath(path)['existPath']) {//si la ruta existe, determina las propiedades del segundo argumento, option
  if (option.length === 1 || option.length === 0) {
    //determina de que tipo ha sido el valor ingresado en option
    switch ((typeof option[0])) {
     
      //en caso de que no sea un valor tipo objeto, se notifica invalido
     case 'number'|| 'string' || 'boolean' || 'function':
       return Promise.resolve('El segundo argumento de la función mdLinks es invalido. Debe ser de tipo objeto booleano.');
     
       //si es un valor tipo objeto, se determina las propiedades del mismo 
    case 'object': {
      
      //tipo null
      if (option[0] === null) {
        return Promise.resolve('No puede leerse argumento de tipo null.')
      }

      //objeto con más de una propiedad o vacío
      if(Object.keys(option[0]).length === 0 || Object.keys(option[0]).length > 1) {
        return Promise.resolve('El segundo argumento de tipo objeto en la función mdLinks se encuentra vacío o tiene más de una propiedad.')
      }

      //Si el argumento es un objeto que contiene validate pero no es de tipo booleano
      if(Object.keys(option[0].length === 1 && Object.keys(option[0]))[0] === 'validate' && typeof option[0].validate !== 'boolean') {
        return Promise.resolve('El segundo argumento de tipo objeto en la función mdLinks, contiene la propiedad validate pero no es un booleano');
      }

     return responseLinksValidate(validatedPath, option[0]); 
    } 
    default:
      //el caso por defecto indica que no ha recibido un segundo argumento.
      responseLinksValidate(validatedPath, option[0]);  
    }
  }

  return Promise.reject(new Error('La función mdLinks solo recibe un argumento y es de tipo objeto booleano'));
}

return Promise.reject(new Error('Asegurate de ingresar una ruta existente'));

}


module.exports = mdLinks;