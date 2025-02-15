
const { GoogleGenerativeAI }  = require('@google/generative-ai');
const createMarkDownPDF = require('../pdf_utils/createMarkDownPdf.js');
const readGoogleDoc = require('../googledocs_utils/readGoogleDoc.js'); 
const clearAndWriteGoogleDoc = require('../googledocs_utils/clearAndWriteGoogleDoc.js'); 

const dotenv = require('dotenv');

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Converts buffer data to a GoogleGenerativeAI.Part object.
const bufferToGenerativePart = (buffer, mimeType) => ({
    inlineData: {
        data: buffer.toString("base64"),
        mimeType,
    },
});




const combineWithSuperDoc = async (file, documentId) => {
    try {
        const superdocText = await readGoogleDoc(documentId); 
        const superdoc_buffer = await createMarkDownPDF(superdocText); 


        const imageParts = [];
        //turning superdoc into a generative part 
        imageParts.push(bufferToGenerativePart(superdoc_buffer, "application/pdf"));//file.data.buffer returns actual pdf data

        // Turning the current user sent pdf/file to a generative part
        imageParts.push(bufferToGenerativePart(file, "application/pdf"));

        // Choose a Gemini model
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = "Incorporate both of these documents together, avoid redundancy, and format the notes.";

        const generatedContent = await model.generateContent([prompt, ...imageParts]);

       /* const params = await generatePDF(generatedContent.response.text());
        return params;
       const resultPDFBytes = await createMarkDownPDF(generatedContent.response.text());
       return resultPDFBytes
       */ 
       return generatedContent.response.text();
    } catch (error) {
        throw error;
    }
};

module.exports =  { combineWithSuperDoc };
