const googledocs = require('@googleapis/docs')



const configGoogleDoc = async () => {

    try {
        const auth = new googledocs.auth.GoogleAuth({
            keyFilename: '../google_client_secret.json',
            // Scopes can be specified either as an array or as a single, space-delimited string.
            scopes: ['https://www.googleapis.com/auth/documents']
        });
        const authClient = await auth.getClient();

        const docs = await googledocs.docs({
            version: 'v1',
            auth: authClient
        });
        console.log("googledocs authenticated")
        return docs;

    } catch (error) {
        console.error('Error Authentication GoogleDoc Access', error);
        throw error;
    }
}


module.exports = {configGoogleDoc}; 

if(require.main === module)
    configGoogleDoc();