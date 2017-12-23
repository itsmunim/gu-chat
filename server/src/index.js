const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');

let app = express();
let routes = require('./routes/index');

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(morgan('combined'));
app.use('/', routes);

let port = process.env.PORT || 8080;

let server = app.listen(port, function () {
  console.log('Server started on port ' + port);
});

let connections = [];

server.on('connection', (connection) => {
  connections.push(connection);
  console.log('%s connections currently open', connections.length);
  connection.on('close', function () {
    connections = connections.filter((curr) => { return curr !== connection; });
  });
});

