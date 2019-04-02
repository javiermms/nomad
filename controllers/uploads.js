const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream')
const mongoose = require("mongoose");

module.exports = (app) => {

    // console.log(mongoose.connection)

    const mongoURI = 'mongodb://localhost/nomad-db';

    // Create mongo connection
    const conn = mongoose.connection;
    
    conn.once('open', () =>{
    //Initialize Stream
    let gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads')
    })

    //Create Storeage Engine
    const storage = new GridFsStorage({
        url: mongoURI,
        file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
            if (err) {
                return reject(err);
            }
            const filename = buf.toString('hex') + path.extname(file.originalname);
            const fileInfo = {
                filename: filename,
                bucketName: 'uploads'
            };
            resolve(fileInfo);
            });
        });
        }
    });

    const upload = multer({ storage });

    app.get('/upload', (req, res) => {        
        res.render("upload");
    
    });

    app.post('/upload', upload.single('file'), (req, res) => {        
        res.json({file: req.file});
    
    });


};