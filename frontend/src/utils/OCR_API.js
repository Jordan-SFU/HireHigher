// given a file, sends a post request to the OCR API and returns the text
const getOCRText = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('https://api.ocr.space/parse/image',
        {
            method: 'POST',
            headers: {
                'apikey': 'K81030122688957',
            },
            body: formData,  // Pass the formData which contains the file directly
        }
    );

    const data = await response.json();
    if (response.ok) {
        let text = '';
        data.ParsedResults.forEach(result => {
            text += result.ParsedText;
        });
        return text;
    } else {
        throw new Error(data.ErrorMessage || 'Error during OCR processing');
    }
}

export { getOCRText };