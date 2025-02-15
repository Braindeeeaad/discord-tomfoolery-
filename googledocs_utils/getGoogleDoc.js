const configGoogleDoc = require('./configGoogleDoc.js');

const getGoogleDoc = async (documentId) => {
    const docs = await configGoogleDoc();
    const res = await docs.documents.get({
        documentId: documentId,
    }); 
    return res.data; 
}

module.exports = {getGoogleDoc}; 
