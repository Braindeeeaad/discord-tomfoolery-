const configGoogleDoc = require('./configGoogleDoc.js');


const createGoogleDoc = async (name) => {
    const docs = await configGoogleDoc();
    try {
        const response = await docs.documents.create({
            requestBody: {
                title: name,
            },
        });

        console.log('Created Document ID:', response.data.documentId);
        return response.data; 
    } catch (err) {
        console.error('Error creating document:', err);
    }
}

module.exports = {createGoogleDoc}; 