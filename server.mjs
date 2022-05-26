
//exter modules
import express from "express"
import fs from "fs"
import fileUpload from "express-fileupload"
import {v4 as uuidv4} from 'uuid'
import axios from "axios"

// own modules
import {validFiletyp} from "./service.mjs";

const server = express()
const port = 8080
//https://stackoverflow.com/questions/25209073/sending-multiple-responses-with-the-same-response-object-in-express-js
//verbindung aktiv halten

//express wandelt JSON nicht automatisch um! Lösung: Middleware das JSON parst to js bevor die daten in der funktion bearbeitet werden.
server.use(express.json())
//middleware for fileUpload
server.use(fileUpload(
    {
        createParentPath: true
    }))

/**
 * Checks if file exists => true: download file and delete file in folder download and folder upload
 * false: response => 404 file not found
 * @author: Claudia
 * Note: params include filetype
 */

server.get("/download", (req, res) => {
    //request = incoming data
    //response = outgoing data
    // let message = req.body.message
    //console.log(message)
    const uuid = req.body.uuid
    const filename = req.body.filename
    console.log(uuid)
    console.log(filename)
    const pathDown = `./download/${uuid}/${filename}` //download /(uuid) 5465736/ filename
    const pathUp = `./upload/${uuid}/${filename}`



    fs.access(pathDown, fs.constants.F_OK, (err) => {

        if (!err) {
            console.log(`${filename} exists in ${pathDown}`)
            res.status(200).download(pathDown, async () => {
                try {
                    // löscht zuerst die files im folder
                    await fs.unlink(pathUp, () => {
                        console.log("File deleted in upload")

                    })
                    await fs.unlink(pathDown, () => {
                        console.log("File deleted in download")

                    })
                    // löscht die folder uuid
                   await fs.rmdir("./upload/" + uuid, () => {
                        console.log("folder deleted")
                    })

                   await fs.rmdir("./download/" + uuid, () => {
                        console.log("folder deleted")
                    })


                } catch (err) {
                    console.log("Error message: ", err)

                }
            })

        } else {
            console.log("File Not Found!")
            return res.status(404).send({message: "File Not Found!"})
        }
    })



})
/**
 * Checks if a file send for upload & if its a valid type => upload the file in folder upload
 * @autor Claudia
 * Infos: https://www.npmjs.com/package/express-fileupload
 */

server.post("/upload", async (req, res) => {
    // check if valid filetype => in GUI checken bevor upload??

        try {
            if (!req.files) {
                res.status(404).send({
                    status: false,
                    message: 'No file uploaded'
                });

                console.log("No file uploaded")
            } else if (!validFiletyp(req.files.uploadFile.name)) {

                res.status(400).send({message: "Invalid filetyp"})
                console.log("invalid filetype")
            }else{
                //Use the name of the input field (i.e. "uploadFile") to retrieve the uploaded file
                let filename = req.files.uploadFile.name
                let uploadFile = req.files.uploadFile
                let uuid = uuidv4()
                try{
                    fs.mkdir('./upload/' + uuid, { recursive: true }, (err) => {
                        if (err) throw err;
                    });
                }catch (err){
                    console.log(err)
                }

                //Use the mv() method to place the file in upload directory (i.e. "uploads")
                await uploadFile.mv('./upload/'+ uuid +'/' + filename);


                res.status(200).send({message: "File Upload successfully", uuid: uuid})

                console.log("file uploaded")


            }
        } catch (err) {
            console.log(err)
        }

})
let key = "6d7dc944-6931-db59-b9d3-e5d3a24e44b3:fx"

server.get('/key-usage',  (req, res) => {
    //innerhalb ein httprequest auf deepl machen
    //'https://api-free.deepl.com/v2/usage?auth_key=' + key
    /*
    let key = req.query.key
    console.log(key)
    axios.post('https://api-free.deepl.com/v2/usage', {
        auth_key: "6d7dc944-6931-db59-b9d3-e5d3a24e44b3:fx",
    }).then(res => {
        console.log("statuscode: " + res.status)
        console.log(res)
    })


     */

    /*
    let charCount = res.body.character_count
    let charLimit = res.body.character_limit

    console.log("Character count: " + charCount)
    console.log("Character limit: " + charLimit)
    console.log(key)

     */
})



server.listen(port,
    () => {
        console.log(`Server is running on http://localhost:${port}`)
    })


