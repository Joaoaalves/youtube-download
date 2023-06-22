const express    = require('express');
const bodyParser = require('body-parser');
const config     = require('config');
const consign    = require('consign');
const cors       = require('cors');

module.exports = () => {
  const app = express();
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cors());
  
  app.set('port', process.env.PORT || config.get('server.port'));


  consign({cwd: 'src'})
    .then('controllers')
    .then('routes')
    .into(app);

  return app;
};