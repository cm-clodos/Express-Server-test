const express = require("express")
const server = express()
const port = 8080

//express wandelt JSON nicht automatisch um! Lösung: Middleware das JSON parst to js bevor die daten in der funktion bearbeitet werden.
server.use(express.json())

server.get("/download", (req, res) => {
    //request = incoming data
    //response = outgoing data
    let message = req.body.message
    console.log(message)

    res.status(200).send(
        {
            message: "Downloading File",
            file: "This is your file data.txt"
        }
    )

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


