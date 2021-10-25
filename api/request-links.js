//Marked es un paquete externo que permite analizar archivos markdown sin bloquear el flujo de eventos
//liviano y rápido, su implementación funciona en entornos fuera y dentro del navegador. fuente: https://github.com/markedjs/marked
const marked = require('marked');

//jsdom es un paquete externo que permite recrear un DOM en entornos externos al navegador y realizar operaciones
//DOM con normalidad. Para usar Jsdom, debe ser requerido con un constructor, a este constructor se le pasa un string y se obtiene un nuevo objeto DOM
//con multiples propiedades, como window. Fuente: https://github.com/jsdom/jsdom
const jsdom = require('jsdom');
const {JSDOM} = jsdom;
//Node-fetch es un paquete externo que trae al entorno de NodeJS la API Fetch que permite realizar peticiones HTTP
//a URLs sin necesidad de contar con un entorno de navegador. Fuente: https://www.npmjs.com/package/node-fetch
const fetch = require('node-fetch');

//El módulo nativo de Node, File System (fs) proporciona una API para interactuar con el sistema de archivos de la maquina
const fs = require('fs');

const readPath = require('readPath');

const extractLinks = filesMarkdown => {
    const linksFileMarkdown = [];

    filesMarkdown.forEach(file => {
        const readFileMarkdown = fs.readFileSync(file, 'utf-8')

        const fileToTokens = marked.lexer(readFileMarkdown);

        const tokensToHtml = marked.parser(fileToTokens);

        const htmlToDom = new JSDOM(tokensToHtml);

        const linksInFiles = htmlToDom.window.document.querySelectorAll('a');

        linksInFiles.forEach(link => {
            linksFileMarkdown.push({
                href: link.href,
                text: link.text,
                file: file
            });
        });
    });
    return linksFileMarkdown;
}

const arrayOfMarkdowns = readPath('/home/mairis/Documentos/BOG003-md-links/prueba')
console.log(arrayOfMarkdowns);