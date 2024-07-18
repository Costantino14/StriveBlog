// Questo del controllo Mail non era nel compito ma l'ho inserito nel codice cmq, per esercitarmi


const controllMail = (req, res, next) => {
    const mail = 'autorizzato@gmail.com'
    const mailUtente = req.headers['user-email'];

    if(mail === mailUtente) {
        next();
    } else {
        res.status(403).json({message: 'utente nn autorizzato'})
    }
}

export default controllMail; 