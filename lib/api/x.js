const mdLinks = require('./index');

mdLinks('/home/mairis/Documentos/BOG003-md-links/prueb', {validate: true})
.then(response => console.log(response))
.catch(error => console.error(error))
