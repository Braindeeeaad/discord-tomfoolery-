
const { GoogleGenerativeAI }  = require('@google/generative-ai');
const dotenv = require('dotenv');
const { downloadFileFromS3 } = require('./download.service.js');
const createMarkDownPDF = require('../pdf_utils/createMarkDownPdf.js');


dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Converts buffer data to a GoogleGenerativeAI.Part object.
const bufferToGenerativePart = (buffer, mimeType) => ({
    inlineData: {
        data: buffer.toString("base64"),
        mimeType,
    },
});




const combineWithSuperDoc = async (file, unitid) => {
    try {
        // Turning the current user sent pdf/file to a generative part
        const imageParts = [];
        imageParts.push(bufferToGenerativePart(file.data, "application/pdf"));//file.data.buffer returns actual pdf data
        // Calling the unitid specified superdoc and turning it into a generative part
        const fileBuffer = await downloadFileFromS3(unitid, process.env.AWS_S3_PDF_BUCKET);
    
        //console.log(fileBuffer.toString("utf8")); // returns a string
        imageParts.push(bufferToGenerativePart(fileBuffer, "application/pdf"));

        // Choose a Gemini model
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = "Incorporate both of these documents together, avoid redundancy, and format the notes.";

        const generatedContent = await model.generateContent([prompt, ...imageParts]);

       /* const params = await generatePDF(generatedContent.response.text());
        return params;
        */ 
       const resultPDFBytes = await createMarkDownPDF(generatedContent.response.text());
       return resultPDFBytes
    } catch (error) {
        throw error;
    }
};

module.exports =  { combineWithSuperDoc };
