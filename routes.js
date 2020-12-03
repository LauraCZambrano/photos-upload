const express = require('express');
const path = require('path');
const { promisify } = require('util');
const fs = require('fs');
const convert = require('heic-convert');
const app = express();

//routes 
app.post('/fotos', async (req, res) => {
    if(req.files){
        let photo = req.files.photo;

        const outputBuffer = await convert({
            buffer: photo.data, // the HEIC file buffer
            format: 'JPEG',      // output format
            quality: 1           // the jpeg compression quality, between 0 and 1
        });
        
        photo.name = photo.name.split(".")[0];
        await promisify(fs.writeFile)(path.join(__dirname, '/transformadas/') + photo.name + '.jpg', outputBuffer);

        console.log("foto recibida: ", photo);

        if(!photo.mimetype){
            return res.json({
                error: "La foto no tiene un mimetype"
            });
        }else {
            let ext = photo.mimetype.split('/')[1];
            ext = ext.split("+")[0];
            let urlPhoto = path.join(__dirname, '/fotos/') + photo.name + '.' + ext;
            photo.mv(urlPhoto, async function(err) {
                if (err) {
                    console.log(err);
                    return false
                }
            });
            photo = "/fotos/" + photo.name + '.' + ext;
            return res.json({
                message: "Se subio la foto",
                url: photo
            });
        }

    } else {
        return res.json({
            error: "No se recibio ninguna foto"
        });
    }
}); 

//exports
module.exports = app;