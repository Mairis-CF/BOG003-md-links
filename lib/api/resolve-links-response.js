const readPath = require('./read-markdown-path');
const requestLinks = require('./request-links');

const { extractLinks, requestValidateLinks } = requestLinks;


const responseLinksValidate = (path, option) => {
       
    const markdownFiles = readPath(path);
    const linksMarkdown = extractLinks(markdownFiles);

        if(linksMarkdown.length !== 0) {
         
            if((option !== undefined) && option.validate){
                
                return requestValidateLinks(linksMarkdown)
            }

        return Promise.resolve(linksMarkdown);
        }

    return Promise.resolve('No hay archivo(s) markdown en la ruta ingresada')

}
module.exports = responseLinksValidate;
