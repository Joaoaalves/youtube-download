module.exports = app => {
    const controller = app.controllers.youtubeDownload;

    app.route('/api/youtubeDownload')
        .post(controller.convert);

    app.route('/api/download')
        .get(controller.download);
    
    app.route('/api')
        .get((req, res) => res.send('API Running'));
}