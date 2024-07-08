// errore 400
export const badRequestHandler = (err, req, res, next) => {
if(err.status === 400 || err.name === 'ValidationError') {
    res.status(400).json({
        error: 'errore nella richiesta',
        message: err.message
    })
} else {
    next(err);
}

}

export const authorizedHandler = (err, req, res, next) => {
    if(err.status === 401) {
        res.status(401).json({
            error: 'non sei autorizzato',
            message: 'Effettua una nuova autentificazione'
        })
    } else {
        next(err);
    }
    
    }


    export const notFoundHandler = (req, res, next) => {
        res.status(404).json({
                error: 'Risorsa non trovata',
                message: 'La risorsa richiesta non è stata trovata'
            })
        
        }


 export const genericErrorHandler = (err, req, res, next) => {
        console.error(err.stack);
        res.status(500).json({
            error: 'Internal server error',
            message: 'Errore generico'
        })
    
    }