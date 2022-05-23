

let filenameValid = "text.ini"
let filenameInvalid = "text.doc"



export function validFiletyp(filename){
    let validTypes = ["txt", "ini"];
    let filetyp = filename.split(".").pop();

    let valid = validTypes.includes(filetyp)
    return valid
}

console.log(validFiletyp(filenameValid))