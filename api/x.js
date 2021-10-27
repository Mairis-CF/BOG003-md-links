const mdLinks = require('./index');

mdLinks('/home/mairis/Documentos/BOG003-md-links/README.md', {validate: true})
.then(response => console.log(response));
