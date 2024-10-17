const { executeQuery } = require('../helpers/dbQuery')
const { sendError, sendSuccess } = require('../helpers/responseHandler')


async function uploadFile(req, res) {
    try {
        let { Ticketid, LogsheetNumber,DataToShow } = req.body

        if (!Ticketid || !LogsheetNumber || !req.file) return sendError(res, "Bad Request", 400)
        
        try {
            DataToShow = DataToShow.replace(/[{}]/g, '').replace(/"/g,'').replace(/,/g,"\n")
        } catch (error) {
            DataToShow = DataToShow.replace(/[{}]/g, '').replace(/"/g,'')

        }
        let writeText = await textOverlay('uploads/' + req.file.filename,DataToShow)

        let data = {
            url: process.env.url + 'imgs/' + req.file.originalname
        }
        return sendSuccess(res, "sucess", data)



    } catch (err) {
        return sendError(res, JSON.stringify(err.stack), 500)
    }
}

var Jimp = require("jimp");


async function textOverlay(img,text) {



Jimp.read(img, (err, lenna) => {
    if (err) throw err;

    if (err) throw err;

    Jimp.loadFont(Jimp.FONT_SANS_32_WHITE).then((font) => {
        const padding = 10; // Padding between image and text
        const imageWidth = lenna.bitmap.width;

        // Measure text height and width for the wrapping
        const textHeight = Jimp.measureTextHeight(font, text, imageWidth); // Set the max width to image width for wrapping

        // Create a new image with extra space at the bottom for the text
        new Jimp(imageWidth, lenna.bitmap.height + textHeight + padding, (err, newImage) => {
            if (err) throw err;

            // Composite the original image on the new image
            newImage.composite(lenna, 0, 0);

            // Draw black background for the text
            newImage.scan(0, lenna.bitmap.height, imageWidth, textHeight + padding, function (x, y, idx) {
                this.bitmap.data[idx + 0] = 0;  // Red value
                this.bitmap.data[idx + 1] = 0;  // Green value
                this.bitmap.data[idx + 2] = 0;  // Blue value
                this.bitmap.data[idx + 3] = 255; // Alpha value (full opacity)
            });

            // Print the text on the new image, below the original image, with wrapping
            newImage.print(
                font,
                0, // Start at the left
                lenna.bitmap.height + padding, // Position text below the image
                {
                    text: text,
                    alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
                },
                imageWidth, // Set width to the image width to wrap text
                textHeight // Set height to the height of the text
            ).write(img); // Write the modified image
        });
    });
});


    
    // Jimp.read(img, (err, lenna) => {
    //     if (err) throw err;
        
    //     Jimp.loadFont(Jimp.FONT_SANS_32_WHITE).then((font) => {
    //         const textHeight = Jimp.measureTextHeight(font, text, 10); // Get text height
    //         const textWidth = Jimp.measureText(font, text); // Get text width

            
    //         const padding = 0; // Padding between image and text
        
    //         // Create a new image with extra space at the bottom for the text
    //         new Jimp(textWidth, lenna.bitmap.height + textHeight + padding, (err, newImage) => {
    //             if (err) throw err;
        
    //             // Composite the original image on the new image
    //             newImage.composite(lenna, 0, 0);
        
    //             // Print the text on the new image, below the original image
    //             newImage.print(
    //                 font,
    //                 0, // Center horizontally
    //                 lenna.bitmap.height + padding, // Position text below the image
    //                 {
    //                     text: text,
    //                     alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
    //                 },
    //                 lenna.bitmap.width, // Set width to the image width to center the text
    //                 textHeight // Set height to the height of the text
    //             ).write(img); // Write the modified image
    //         });
    //     });
        

        
    // });
    
    
    
    
}

module.exports = { uploadFile }