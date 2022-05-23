
//exter modules
import express from "express"
import fs from "fs"
import fileUpload from "express-fileupload"

// own modules
import {validFiletyp} from "./service.mjs";

const server = express()
const port = 8080

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
server.get("/download/:filename", (req, res) => {
    //request = incoming data
    //response = outgoing data
    // let message = req.body.message
    //console.log(message)
    const filename = req.params.filename
    const pathDown = `./download/${filename}`
    const pathUp = `./upload/${filename}`



    fs.access(pathDown, fs.constants.F_OK, (err) => {

        if (!err) {
            console.log(`${filename} exists in ${pathDown}`)
            res.status(200).download(pathDown, () => {
                try {
                    fs.unlink(pathUp, () => {
                        console.log("File deleted in upload")
                    })
                    fs.unlink(pathDown, () => {
                        console.log("File deleted in download")
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

                //Use the mv() method to place the file in upload directory (i.e. "uploads")
                await uploadFile.mv('./upload/' + filename);

                res.status(200).send({message: "File Upload successfully"})
                console.log("file uploaded")

            }
        } catch (err) {
            console.log(err)
        }

})



server.listen(port,
    () => {
        console.log(`Server is running on http://localhost:${port}`)
    })


