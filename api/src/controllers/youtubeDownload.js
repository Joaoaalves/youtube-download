
const ytdl = require('youtube-dl-exec');
const uuid = require('uuid');
const fs = require('fs')
const { exec } = require('child_process');

const command = './bin/yt-dlp --newline --progress-template {"\\"progressPercentage\\"":"\\"%(progress._percent_str)s\\"","\\"progressTotal\\"":"\\"%(progress._total_bytes_str)s\\""} -f "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best"';
module.exports = (app) => {

  const controller = {};

  controller.convert = (req, res) => {
    // Gets the url from the body of the request
    const url = req.body.url;

    // Creates a random id for the request
    const id = uuid.v4();

    // Creates the folder to store the audios
    const fs = require('fs');
    const dir = 'audios/' + id + '/';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    // create global vars to store the data
    let title = '';
    let thumbnail = '';
    let duration = '';


    ytdl(url, {
      dumpSingleJson: true,
      noCheckCertificates: true,
      noWarnings: true,
      preferFreeFormats: true,
    }).then(output => {
      title = output.title;
      thumbnail = output.thumbnail;
      duration = output.duration;
      
      res.write(JSON.stringify({
        title: title,
        thumbnail: thumbnail,
        duration: duration,
        id: id,
        status: 'waiting'
      }));
    })

    const ytDownload = exec(command + ' ' + url + ' -o ' + dir + 'video.mp3');

    ytDownload.stdout.on('data', (data) => {
      if (data.includes('progressPercentage')) {
        res.write(data);
      }
    }
    ).on('end', () => {
      res.write(JSON.stringify({
        title: title,
        thumbnail: thumbnail,
        duration: duration,
        id: id,
        status: 'finished',
        progressPercentage: '100%'
      }));
      res.end();
    })


  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  controller.download = (req, res) => {
    const id = req.query.id;

    const dir = fs.readdirSync('./audios/' + id);

    const file = dir[0];

    res.download('./audios/' + id + '/' + file, file, (err) => {
      if (err) {
        console.log(err);
      } else {
        fs.rmdirSync('./audios/' + id, { recursive: true });
      }
    }
    )
  }


  return controller;
}