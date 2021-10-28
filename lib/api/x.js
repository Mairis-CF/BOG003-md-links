const mdLinks = require('./index');

mdLinks('/home/mairis/Documentos/BOG003-md-links/prueba/texto.md', {validate: true})
.then(response => console.log(response))
.catch(error => console.error(error))

