const configGoogleDoc = require('./configGoogleDoc.js');


async function clearAndWriteGoogleDoc(documentId, newText) {
  // Create the Google Docs API client
  const docs = await configGoogleDoc();
  try {
    // Step 1: Clear the document by deleting all content
    const clearRequest = {
      documentId: documentId,
      requestBody: {
        requests: [
          {
            deleteContentRange: {
              range: {
                startIndex: 1, // Start after the document's metadata (first character)
                endIndex: 1,   // End at the same place to clear everything
              },
            },
          },
        ],
      },
    };
    await docs.documents.batchUpdate(clearRequest);

    console.log('Document cleared.');

    // Step 2: Insert new text into the document
    const insertRequest = {
      documentId: documentId,
      requestBody: {
        requests: [
          {
            insertText: {
              location: {
                index: 1, // Insert at the beginning (after the metadata)
              },
              text: newText, // The new content to insert
            },
          },
        ],
      },
    };

    await docs.documents.batchUpdate(insertRequest);

    console.log('New content written to the document.');
  } catch (err) {
    console.error('Error modifying document:', err);
  }
}

module.exports = {clearAndWriteGoogleDoc};

