//require
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const fileUpload = require('express-fileupload');
const path = require('path');
const http = require('http');

//initializations
const app = express();

//middlewares
app.use(cors()); //ACCESS CONTROL HTTP
app.options("*", cors()); //ACCESS CONTROL HTTP
app.use(bodyParser.urlencoded({extended: false,  limit: '5mb'})) //REQUEST IN BODY
app.use(express.json({limit: '5mb'})) //BODY TOO LARGE
app.use(bodyParser.json()) //JSON
app.use(methodOverride('_method')); //FORMS PUT AND DELETE
app.use(fileUpload({
    limits: { fileSize: 5 * 1024 * 1024 },
    abortOnLimit: true,
    responseOnLimit: "File size limit has been reached"
}));

//routes
app.use(require('./routes.js'));

//front
app.use(express.static(path.join(__dirname,"fotos")));


// Starting both http & socket servers
const httpServer = http.createServer(app);


//Server http
httpServer.listen(8080, () => {
    console.log('HTTP Server listen on port', 8080);
});
