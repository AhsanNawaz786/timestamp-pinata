const express = require('express');
const multer = require('multer');
const path = require('path');

//pinata 
const fs = require('fs');
const pinataSDK = require('@pinata/sdk');
const pinata = pinataSDK('517e01c119c7131a20a7', '5eef34b44fed9e4834c56577d10cfcdde5e0d8bbba868599b2ff26312e947eae');

const app = express();
var imghash = "";

///middleware function
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'temp')
    },
    filename: function (req, file, cb, res) {
        cb(null, Date.now() + "--" + file.originalname)
    }
})


var upload = multer({ storage: storage })


app.get('/', (req, res) => {
    res.render('index')
})


app.post('/uploadfile', upload.single("media"), (req, res) => {
    var name=req.body.name || "";
    var age =req.body.age || "";
    var media = req.file.filename;

    if([name, age].includes("")){
        console.log("One of the required fields left empty!");
        return;
    }

    res.send("uploaded successfully!");
    const readableStreamForFile = fs.createReadStream('./temp/' + media);
    const options = {
        pinataMetadata: {
            //names: 'Welcome to metadata',
            keyvalues: {
                media : 'MyNft',
                // IPFS_Hash : IpfsHash,
                // Age_data : age,
            }
        },
        pinataOptions: {
            cidVersion: 0
        }
    };
    pinata.pinFileToIPFS(readableStreamForFile, options).then((result) => {
        imghash = console.log("https://gateway.pinata.cloud/ipfs/" + result.IpfsHash)
        fs.unlinkSync("./temp/"+media);
        


    }).catch((err) => {
        console.log(err);
    });


    var body= {
        name: name,
        age : age
    
    }

//})

// fs.writeFile(
//     "./temp/metadata" + msgsender + ".json",
//     JSON.stringify(sampleObject, null, 4),
//     (err) => {
//       if (err) {
//         res.status(500).json({ error: err });
//         return;
//       }
//       const readableStreamForFile1 = fs.createReadStream(
//         "./temp/metadata" + msgsender + ".json"
//       );


// .catch((err) => {
//     fs.unlinkSync("./temp/"+mediaPath);
//     res.status(500).json({
//       error: err,
//     });
//     return;
//   })

app.listen(3000, () => console.log("server started!"))