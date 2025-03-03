const { configGoogleDoc } = require('./configGoogleDoc.cjs');

async function clearAndWriteGoogleDoc(documentId, newText) {
  // Create the Google Docs API client
  const google = await configGoogleDoc();
  const docs = google.docs;

  try {
    // Step 1: Get the document's current length to clear all content
    const document = await docs.documents.get({ documentId });
    const documentLength = document.data.body.content.length;

    // Ensure there's actual content to delete, and that the range is valid
    if (documentLength > 1) {
      const startIndex = 1; // Start after the document's metadata (first character)
      const endIndex = document.data.body.content[document.data.body.content.length - 1].endIndex; // Get the end index from the last content element
      console.log("StartIndex: "+startIndex+"\nEndIndex: "+endIndex);
      // Check if the range is valid before attempting to delete
      if (endIndex-startIndex>1) {
        // Step 1: Clear the document by deleting all content
        const clearRequest = {
          documentId: documentId,
          requestBody: {
            requests: [
              {
                deleteContentRange: {
                  range: {
                    startIndex: 1,
                    endIndex: endIndex-1,
                  },
                },
              },
            ],
          },
        };
        await docs.documents.batchUpdate(clearRequest);
        console.log('Document cleared.');
      } else {
        console.log('Invalid range. Skipping delete operation.');
      }
    } else {
      console.log('Document has no content to clear.');
    }

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

module.exports = { clearAndWriteGoogleDoc };