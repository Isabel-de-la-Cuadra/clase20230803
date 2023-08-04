const express = require("express")
const fileupload = require("express-fileupload")
const path = require("path")
const app = express()
const fs = require('fs')

app.use(express.json())
app.use(fileupload({ createParentPath: true }))

app.listen(3000, () => console.log("Servidor en ejecución"))

// En un array colocar las extensiones permitidas
const arrayExtensiones = ['.jpge', '.png']

// Peso máximo 3 MB
const pesoMaximo = 3000000

app.post("/upload", async(request, response) => {
    console.log(request.files);
    if (!request.files) {
        return response.status(400).json({ success: false, message: "Por favor subir un archivo" })
    }
    const datosArchivo = request.files.archivo

    // Obtener extensión del archivo.No fue necesario para este ejemplo pero si para futuras aplicaciones
    const nombre = datosArchivo.name
    const pesoArchivo = datosArchivo.size
    const { ext } = path.parse(nombre)
    console.log(ext);
    // Fin obtener extensión

    //Añadir los mimetype permitidos en un array, y realizar la validación con un includes o función similar
    // if (datosArchivo.mimetype !== 'image/png' && datosArchivo.mimetype !== 'image/jpeg') {
    if (arrayExtensiones.indexOf(ext) === -1) {
        return response.status(400).json({ success: false, message: "Subir un archivo con formato válido" })
    }

    // comparar peso archivo con el peso máximo permitido
    if (pesoArchivo > pesoMaximo) {
        return response.status(400).json({ success: false, message: "El peso máximo del archivo es de 3 MB" })
    }

    const marca = Date.now();
    const ruta = `${__dirname}/files/${marca}-${nombre}`
    await datosArchivo.mv(ruta)
    response.json({ success: true, message: "Ruta para subir archivo" })
})

app.delete("/delete/:nombreArchivo", (request, response) => {
    const nombreArchivo = request.params.nombreArchivo
    console.log(nombreArchivo)
    const rutaArchivo = `${__dirname}/files/${nombreArchivo}`
    try {
        fs.unlinkSync(rutaArchivo)
        console.log('File removed')
    } catch (err) {
        console.error('Something wrong happened removing the file', err)
    }
    response.json({ success: true, message: "Dispositivo eliminado con éxito" })
})