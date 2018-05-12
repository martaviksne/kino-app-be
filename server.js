// Vajadzīgās pakotnes
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const port = 9000;
const path = require("path");
const User = require('./models/user');
const Filma = require('./models/filmas');
const jwt = require('jsonwebtoken');
var cors = require('cors');
const secretKey = 'kinoteatris';
const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');
const crypto = require('crypto');

const storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, "./posters");
  },
  filename: function(req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      if (err) return cb(err)
      cb(null, raw.toString('hex') + path.extname(file.originalname))
    })
  }
});

function doSomething() {
  console.log('do something');
}

var upload = multer({
     storage: storage
 }).array("imgUploader", 1); //Field name and max count

// MongoDB lietotnes datubāze
mongoose.connect('mongodb://localhost/kino');

// Express serveris
var app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Saites
app.get('/', function(req, res){
  res.send('working');
});
app.use('/api', require('./routes/api'));
app.use('/posters', express.static(__dirname + '/posters'));

app.post('/register', function(req, res) {
  var username = req.body.username,
  password = req.body.password;
  var newUser = new User();
  newUser.username = username;
  newUser.password = password;
  newUser.save(function(err, savedUser){
    if (err) {
      console.log(err);
      res.status(500).send();
    } else {
      res.status(200).send(savedUser);
    }
  });
});

app.post("/api/upload", function(req, res) {
     upload(req, res, function(err) {
       let theId = req.body.id;
         if (err) {
           console.log(err);
             return res.status(500).send();
         } else {
           sharp(res.req.files[0].path)
           .resize(400,600)
           .crop()
           .toBuffer(function(err, buffer) {
             fs.writeFile(res.req.files[0].path, buffer, function(e) {
               console.log('result', e);
               Filma.findByIdAndUpdate(theId, {poster: res.req.files[0].path}, function(err, doc){
                  if (err) return res.send(500, { error: err });
                  return res.send("succesfully saved");
              });
             });
           });
         }
     });
 });

app.post('/authenticate', function(req, res) {
  var username = req.body.username,
  password = req.body.password;
  User.findOne({ 'username': username }, 'username password', function(err, foundUser) {
    if (err || !foundUser || foundUser.username !== username || foundUser.password !== password) {
      res.sendStatus(403);
    } else {
      jwt.sign({foundUser}, secretKey, { expiresIn: '10h' }, (err, token) => {
        res.json({
          token
        });
      });
    }
  });
});

app.post('/verifyToken', verifyToken, (req, res) => {
  jwt.verify(req.token, secretKey, (err, authData) => {
    if(err) {
      res.sendStatus(403);
    } else {
      res.sendStatus(200);
    }
  });
});

app.post('/removeUpload', function(req, res){
  let theFile = req.body.theFile;
  if (fs.existsSync(theFile)) {
    fs.unlink(req.body.theFile,function(err){
          if(err) res.status(500).send();
          res.status(200).send('file deleted successfully');
     });
   } else {
     res.status(200).send('No such file found.');
   }
});

// Verify Token
function verifyToken(req, res, next) {
  // Get auth header value
  const bearerHeader = req.headers['authorization'];
  // Check if bearer is undefined
  if(typeof bearerHeader !== 'undefined') {
    // Split at the space
    const bearer = bearerHeader.split(' ');
    // Get token from array
    const bearerToken = bearer[1];
    // Set the token
    req.token = bearerToken;
    // Next middleware
    next();
  } else {
    // Forbidden
    res.sendStatus(403);
  }
}

// Servera inicializācija
app.listen(port);
console.log('Lietotnes serveris darbojas portā '+port);
