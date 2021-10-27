//Marked es un paquete externo que permite analizar archivos markdown sin bloquear el flujo de eventos
//liviano y rápido, su implementación funciona en entornos fuera y dentro del navegador. fuente: https://github.com/markedjs/marked
const marked = require('marked');
//jsdom es un paquete externo que permite recrear un DOM en entornos externos al navegador y realizar operaciones
//DOM con normalidad. Para usar Jsdom, debe ser requerido con un constructor, a este constructor se le pasa un string y se obtiene un nuevo objeto DOM
//con multiples propiedades, como window. Fuente: https://github.com/jsdom/jsdom
const jsdom = require('jsdom') 
const {JSDOM} = jsdom;
//Node-fetch es un paquete externo que trae al entorno de NodeJS la API Fetch que permite realizar peticiones HTTP
//a URLs sin necesidad de contar con un entorno de navegador. Fuente: https://www.npmjs.com/package/node-fetch
const fetch = require('node-fetch');
//El módulo nativo de Node, File System (fs) proporciona una API para interactuar con el sistema de archivos de la maquina
const fs = require('fs');

//la función readPath toma una ruta de archivos y retorna un array de archivos markdown presentes en la ruta
const readPath = require ('./read-markdown-path');

//la función extractLinks recibe un array de archivos y retorna un array de objetos con los links encontrados en cada archivo markdown
//el texto presente en el link y la ruta en la que encontró este link.
const extractLinks = filesMarkdown => {
    const linksFileMarkdown = [];

     filesMarkdown.forEach(file => {
    //se usa el metodo sincrono de fs para leer archivos en codificación utf-8
        const readFileMarkdown = fs.readFileSync(file, 'utf-8')

    //se convierte el archivo markdown a una serie de tokens con el metodo lexer, de la libreria marked
        const fileToTokens = marked.lexer(readFileMarkdown);

    //se convierten todos los tokens del archivo markdown a formato html para su posterior analisis con el metodo parser de la libreria marked
        const tokensToHtml = marked.parser(fileToTokens);

    //al ser un archivo formato html, se recrean operaciones tipo DOM en el archivo con la libreria JSDOM, que abre una nueva instacia de DOM.
        const htmlToDom = new JSDOM(tokensToHtml);

    //se seleccionan todas las etiquetas tipo <a> presentes en cada archivo y se retorna un array de links. nota: recordar que en este punto, el archivo markdown ha sido convertido a html
        const linksInFiles = htmlToDom.window.document.querySelectorAll('a');
    //se recorre el array de links y se crea un nuevo objeto con las propiedas link, texto del link y ruta en la que se encontró el link, dicho objeto se inserta en el array linksFileMarkdown
        linksInFiles.forEach(link => {
        
            linksFileMarkdown.push({
    
                href: link.href,
                text: link.text.slice(0, 50),
                path: file
            });
        });
    });

    //se retorna un array de objetos por cada link encontrado en cada archivo.
    return linksFileMarkdown;
}

/* const arrayOfMarkdowns = readPath('/home/mairis/Documentos/BOG003-md-links/prueba')
const linksInFiles = extractLinks(arrayOfMarkdowns);
console.log(linksInFiles) */;


//La función RequestvalidateLinks recibe un array de objetos con propiedades de cada link encontrado y realiza peticiones a cada URL. Retorna un array de promesas.
const requestValidateLinks = linksFileMarkdown => {
   //array que guarda cada petición HTTP en cada link 
    const promiseStatus = [];

    linksFileMarkdown.forEach(link => {
        //se selecciona el link para validar
        const linkToValidate = link;
        //se usa la libreria node-fetch para realizar peticiones HTTP. La constante linkRequested es una promesa.
        const linkRequested = fetch(link.href);

        //se inserta un objeto con el formato de la respuesta esperada de la petición a cada link, en el array promiseStatus
        promiseStatus.push(linkRequested
            .then(response => {
                if (response.status >= 200 && response.status < 400) { //si el codigo de estado de la petición está entre 200 y menor a 400, se considera un link funcional
                   
                    linkToValidate.status = response.status;
                    linkToValidate.statusText = 'ok';

                  return linkToValidate;  

                } else {
                    //De otra forma, considerando que el codigo de estado no este entre 200 y menor a 400 (100s, 400s, 500s), el link no funciona
                    linkToValidate.status = response.status;
                    linkToValidate.statusText = 'fail';
                    return linkToValidate; 
                }
            })
            .catch(() => { 
                //el catch de esta promesa retorna un nuevo objeto y se produce cuando ha ocurrido un error externo al servidor en las peticiones

               
                const failedRequestLink = {
                    
                 href: linkToValidate.href,
                 text: linkToValidate.text.slice(0, 50),
                 path: linkToValidate.path,
                 status: 'ha ocurrido un error con la petición procesada',
                 statusText: 'unknown or blank'
                }
 
                return failedRequestLink;
             }) ); 
            
    })
    //la función requestValidateLinks retorna un array (promiseStatus) de promesas, que son las peticiones http a cada link.
return Promise.all(promiseStatus)
}

//console.log(requestValidateLinks(linksInFiles))

module.exports = {extractLinks, requestValidateLinks}