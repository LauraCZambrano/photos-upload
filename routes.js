const express = require('express');
const path = require('path');
const app = express();

//routes 
app.post('/fotos', async (req, res) => {
    if(req.files){
        let photo = req.files.photo;
        console.log("foto recibida: ", photo);

        if(!photo.mimetype){
            return res.json({
                error: "La foto no tiene un mimetype"
            });
        }else {
            let ext = photo.mimetype.split('/')[1];
            ext = ext.split("+")[0];
            photo.name = photo.name.split(".")[0];
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