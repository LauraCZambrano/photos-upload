const express = require('express');
const path = require('path');
const { promisify } = require('util');
const fs = require('fs');
const FileType = require('file-type');
const convert = require('heic-convert');
const app = express();

//routes 
app.post('/fotos', async (req, res) => {
    if(req.files){
        let photo = req.files.photo;

        console.log("photo: ", photo);

        if(!photo.mimetype){
            return res.status(400).json({
                error: "La foto no tiene un mimetype"
            });
        }else {
            
            let photo_name = new Date().getTime();
            let extension = await FileType.fromBuffer(photo.data);
            let ext = extension.ext;
            console.log("Extension: ", extension);
            if(ext == 'heic' || ext == 'heif'){
                const outputBuffer = await convert({
                    buffer: photo.data, // the HEIC file buffer
                    format: 'JPEG',      // output format
                    quality: 1           // the jpeg compression quality, between 0 and 1
                });
                
                await promisify(fs.writeFile)(path.join(__dirname, '/transformadas/') + photo_name + '.jpg', outputBuffer);
            } else {
                ext = photo.mimetype.split('/')[1];
            }

            ext = ext.split("+")[0];
            let urlPhoto = path.join(__dirname, '/fotos/') + photo_name + '.' + ext;
            photo.mv(urlPhoto, async function(err) {
                if (err) {
                    console.log(err);
                    return false
                }
            });
            photo = "/fotos/" + photo_name + '.' + ext;
            return res.json({
                message: "Se subio la foto",
                url: photo
            });
        }

    } else {
        return res.status(400).json({
            error: "No se recibio ninguna foto"
        });
    }
}); 

//exports
module.exports = app;