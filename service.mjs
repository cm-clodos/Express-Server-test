import fs from "fs"
import path from "path"


let filenameValid = "text.ini"
let filenameInvalid = "text.doc"


export function validFiletyp(filename){

    let validTypes = [".txt", ".ini"]
    return validTypes.includes(path.extname(filename.toLowerCase()))
}



//console.log(validFiletyp(filenameValid))

/**
 * Read the file line by line, trim and split the rows
 * @autor Claudia
 * @param path {String}
 * @param splitter {fn}
 * @returns {string[]}
 */
function splitFilesInRows(path,splitter ){
    let KeyValue = []

    try {
        // read content of the File
        const data = fs.readFileSync(path, {encoding:"utf-8"})

        //split the content by new line (achtung lines mit leeren Strings)
        const  lines = data.trim().split(/\r?\n/)

        //Splits each line into Key : Value pair
        let array = []
        lines.forEach((line, index) => {
            if (line !== "" && !line.startsWith(";")){

                console.log(`Line: ${index}, Value: ${line}`)
                array.push(splitter(line))


            }else {
                console.log("empty String")
            }

        }, splitter)
        console.log(array)




    }catch (err){
        console.error(err)
    }


}


 let splitter = function splitRows(row){
const [key, ...rest] = row.split("=")

    const value = rest.join("=")
    return[key, value]
}

/*
let result = splitRows('MOD_NX_EXPOSER_IMG_CF_PLUGIN_SUPPORT_LBL="Plugin Support"')
console.log(result)

 */


//console.log(splitFilesInRows("upload/mod_nx_exposer_en-GB.ini", splitter))

