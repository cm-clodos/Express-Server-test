const express = require("express")
const fs = require("fs");
const e = require("express");
const server = express()
const port = 8080

//express wandelt JSON nicht automatisch um! Lösung: Middleware das JSON parst to js bevor die daten in der funktion bearbeitet werden.
server.use(express.json())

/**
 * Checks if file exists => true: download file and delete file in folder download
 * false: response => 404 file not found
 * @author: Claudia
 * Note: params with filetype
 */
server.get("/download/:filename", (req, res) => {
    //request = incoming data
    //response = outgoing data
   // let message = req.body.message
    //console.log(message)
    const filename = req.params.filename
    const path = `./download/${filename}`
    let fileExists = false


    // check if file exists true /false
    //funktion schreiben in service

    //funktion schreiben für download

    fs.access(path, fs.constants.F_OK, (err) => {

        if (!err){
            console.log(`${filename} exists in ${path}`)
            fileExists = true
            res.status(200).download(path, () => {
                try{
                    fs.unlink(path, () => {
                        console.log("File deleted in download")
                    })
                }catch (err){
                    console.log("Error message: ", err)

                }
            })
            return fileExists

        }else {
            console.log("File Not Found!")
            return res.status(404).send({message: "File Not Found!"})
        }
    })


})

server.post("/tshirt/:id", (req, res) => {
    const {id} = req.params
    const {logo} = req.body

    if (!logo){
        res.status(418).send({message: "We need a logo!"})
    }else{
        res.send({
            thsirt: `Tshirt with your ${logo} and your ID of ${id}`
        })
    }

})


server.listen(port,
    () => {
        console.log(`Server is running on http://localhost:${port}`)
    })


