const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500;
    
    // Yanıt statüsünü ayarla
    res.status(statusCode);
    
    // Hata yanıtını döndür
    res.json({
        message: err.message || 'Internal Server Error',
        // Yalnızca development ortamında stack bilgisini göster
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

module.exports = {
    errorHandler,
};
