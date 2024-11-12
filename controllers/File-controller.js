const { isFloat } = require('../helpers/commonFunction');
const { executeQuery } = require('../helpers/dbQuery')
const { sendError, sendSuccess } = require('../helpers/responseHandler')
var Jimp = require("jimp");

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


// async function updateToiletMaster(req, res) {
//     try {
//         let { Id, WardID,RoadName, LocationName,Lat,Long,userId} = req.body

//         if (!Id || !userId || !Number(Lat) || !Number(Long)) return sendError(res, "Bad Request", 400)

//         let filename = req.file.originalname
//         // let writeText = await textOverlay('uploads/' + req.file.filename,DataToShow)

//         let getData = `EXEC usp_InsertOrUpdateTioletMaster @flag='get',@Id=${Id}`

//         getData = await executeQuery(getData)

//         getData = getData[0]

//         if(getData){
//             getData['WardID'] = WardID ?? getData['WardID']
//             getData['RoadName'] = RoadName ?? getData['RoadName']
//             getData['LocationName'] = LocationName ?? getData['LocationName']
//             getData['Lat'] = Lat ?? getData['Lat']
//             getData['Long'] = Long ?? getData['Long']

//         }

        

//         let data = {
//             url: process.env.url + 'imgs/ToiletFile/' + filename
//         }
        

//         let updateLogs = `EXEC usp_InsertOrUpdateTioletMaster @flag='update',
//                         @Id = ${Id},                        
//                         @WardID = ${getData ? getData.WardID : WardID ?? 0},                   
//                         @RoadName = '${getData ? getData.RoadName : RoadName ?? ''}',     
//                         @LocationName = '${getData ? getData.LocationName : LocationName ?? ''}', 
//                         @Lat = ${getData ? getData.Lat : Lat ?? 0},                  
//                         @Long = ${getData ? getData.Long : Long ?? 0},              
//                         @PhotoCapture = '${data.url ?? ''}',
//                         @CreatedBy = ${userId ?? -1},             
//                         @ModifiedBy = ${userId ?? -1};`

//         await executeQuery(updateLogs)

        
//         return sendSuccess(res, "sucess", data)



//     } catch (err) {
//         return sendError(res, JSON.stringify(err.stack), 500)
//     }
// }


async function updateToiletMaster(req, res) {
    try {
        let { Id, Geom, Address, Ward, Prabhag, Constructe, OwnedBy, Maintained, CboAddress, 
              CboContact, CboValidit, Maintenance, ValidUpto, AgencyContact, SeatForMen, 
              SeatForMom, SeatForHandicap, UrinalMen, UrinalWomen, NoOfBathMen, NoOfBathWomen, 
              ConnectedTo, TypeOfCons, NameOfContact, NoOfFloor, ContractValue, AuditedDate, 
              Completion, Comment, PhotoPath, userId,Lat, Long } = req.body;

        // Validate required fields
        if (!Id || !userId) return sendError(res, "Bad Request", 400);

        let filename = req.file ? req.file.originalname : null;

        // Fetch existing data if record exists
        let getData = `EXEC usp_InsertOrUpdateTioletMaster @flag='get', @Id=${Id}`;
        getData = await executeQuery(getData);
        getData = getData[0];
        if(Lat && Long){
            Geom = `POINT (${Long} ${Lat})`
        }
        
        let defaultGeom = 'POINT (30.2672 -97.7431)'; // Default to 'POINT (0 0)' if no geometry is provided
        let geomWKT = Geom ?? defaultGeom;
        
    
        if (getData) {
            getData['Geom'] = geomWKT ?? getData['Geom'];
            getData['Address'] = Address ?? getData['Address'];
            getData['Ward'] = Ward ?? getData['Ward'];
            getData['Prabhag'] = Prabhag ?? getData['Prabhag'];
            getData['Constructe'] = Constructe ?? getData['Constructe'];
            getData['OwnedBy'] = OwnedBy ?? getData['OwnedBy'];
            getData['Maintained'] = Maintained ?? getData['Maintained'];
            getData['CboAddress'] = CboAddress ?? getData['CboAddress'];
            getData['CboContact'] = CboContact ?? getData['CboContact'];
            getData['CboValidit'] = CboValidit ?? getData['CboValidit'];
            getData['Maintenance'] = Maintenance ?? getData['Maintenance'];
            getData['ValidUpto'] = ValidUpto ?? getData['ValidUpto'];
            getData['AgencyContact'] = AgencyContact ?? getData['AgencyContact'];
            getData['SeatForMen'] = SeatForMen ?? getData['SeatForMen'];
            getData['SeatForMom'] = SeatForMom ?? getData['SeatForMom'];
            getData['SeatForHandicap'] = SeatForHandicap ?? getData['SeatForHandicap'];
            getData['UrinalMen'] = UrinalMen ?? getData['UrinalMen'];
            getData['UrinalWomen'] = UrinalWomen ?? getData['UrinalWomen'];
            getData['NoOfBathMen'] = NoOfBathMen ?? getData['NoOfBathMen'];
            getData['NoOfBathWomen'] = NoOfBathWomen ?? getData['NoOfBathWomen'];
            getData['ConnectedTo'] = ConnectedTo ?? getData['ConnectedTo'];
            getData['TypeOfCons'] = TypeOfCons ?? getData['TypeOfCons'];
            getData['NameOfContact'] = NameOfContact ?? getData['NameOfContact'];
            getData['NoOfFloor'] = NoOfFloor ?? getData['NoOfFloor'];
            getData['ContractValue'] = ContractValue ?? getData['ContractValue'];
            getData['AuditedDate'] = AuditedDate ?? getData['AuditedDate'];
            getData['Completion'] = Completion ?? getData['Completion'];
            getData['Comment'] = Comment ?? getData['Comment'];
            getData['PhotoPath'] = PhotoPath ?? getData['PhotoPath'];
        }

        // Set the photo URL if a file is uploaded
        let data = {
            url: filename ? process.env.url + 'imgs/ToiletFile/' + filename : null
        };

        // Update or insert the record
        
        let updateLogs = `EXEC usp_InsertOrUpdateTioletMaster @flag='update',
                            @Id = ${Id},
                            @Geom = '${geomWKT}',
                            @Address = '${getData ? getData.Address : Address ?? ''}',
                            @Ward = '${getData ? getData.Ward : Ward ?? ''}',
                            @Prabhag = '${getData ? getData.Prabhag : Prabhag ?? ''}',
                            @Constructe = '${getData ? getData.Constructe : Constructe ?? ''}',
                            @OwnedBy = '${getData ? getData.OwnedBy : OwnedBy ?? ''}',
                            @Maintained = '${getData ? getData.Maintained : Maintained ?? ''}',
                            @CboAddress = '${getData ? getData.CboAddress : CboAddress ?? ''}',
                            @CboContact = '${getData ? getData.CboContact ?? 0 : CboContact ?? 0}',
                            @CboValidit = '${getData ? getData.CboValidit : CboValidit ?? null}',
                            @Maintenance = '${getData ? getData.Maintenance : Maintenance ?? ''}',
                            @ValidUpto = '${getData ? getData.ValidUpto : ValidUpto ?? null}',
                            @AgencyContact = '${getData ? getData.AgencyContact ?? 0 : AgencyContact ?? 0}',
                            @SeatForMen = ${getData ? getData.SeatForMen ?? 0 : SeatForMen ?? 0},
                            @SeatForMom = ${getData ? getData.SeatForMom ?? 0: SeatForMom ?? 0},
                            @SeatForHandicap = ${getData ? getData.SeatForHandicap ?? 0 : SeatForHandicap ?? 0},
                            @UrinalMen = ${getData ? getData.UrinalMen ?? 0 : UrinalMen ?? 0},
                            @UrinalWomen = ${getData ? getData.UrinalWomen ?? 0 : UrinalWomen ?? 0},
                            @NoOfBathMen = ${getData ? getData.NoOfBathMen ?? 0 : NoOfBathMen ?? 0},
                            @NoOfBathWomen = ${getData ? getData.NoOfBathWomen ?? 0 : NoOfBathWomen ?? 0},
                            @ConnectedTo = '${getData ? getData.ConnectedTo : ConnectedTo ?? ''}',
                            @TypeOfCons = '${getData ? getData.TypeOfCons : TypeOfCons ?? ''}',
                            @NameOfContact = '${getData ? getData.NameOfContact : NameOfContact ?? ''}',
                            @NoOfFloor = ${getData ? getData.NoOfFloor ?? 0 : NoOfFloor ?? 0},
                            @ContractValue = ${getData ? getData.ContractValue ?? 0 : ContractValue ?? 0},
                            @AuditedDate = '${getData ? getData.AuditedDate : AuditedDate ?? new Date()}',
                            @Completion = '${getData ? getData.Completion : Completion ?? null}',
                            @Comment = '${getData ? getData.Comment : Comment ?? ''}',
                            @PhotoPath = '${data.url ?? ''}',
                            @CreatedBy = ${userId ?? -1},
                            @ModifiedBy = ${userId ?? -1};`;

                            console.log(updateLogs)

        // Execute the query
        await executeQuery(updateLogs);

        // Return success response
        return sendSuccess(res, "Success", data);

    } catch (err) {
        return sendError(res, JSON.stringify(err.stack), 500);
    }
}





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
}

module.exports = { uploadFile,updateToiletMaster }