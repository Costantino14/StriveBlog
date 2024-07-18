// QUESTO è IL VECCHIO METTODO, DICIAMO "MANUALE" PER CONSERVARE LE FOTO CARICATE, USO CLOUDINARY NEL PROGETTO

import multer from 'multer';
import path from 'path';


const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        // cb = callback
        cb(null,'uploads/');
    },
    filename: (req,file,cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    }
});

const upload = multer({
    storage: storage
});

export default upload;