const decodeUriComponent = require('decode-uri-component');


const getValidUrl = (url = "") => {
    let newUrl = decodeUriComponent(url);
    newUrl = newUrl.trim().replace(/\s/g, "");

    if(/^(:\/\/)/.test(newUrl)){
        return `http${newUrl}`;
    }
    if(!/^(f|ht)tps?:\/\//i.test(newUrl)){
        return `http://${newUrl}`;
    }

    return newUrl;
};

export default getValidUrl;