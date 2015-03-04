var app = require('./server-config.js');

var port = process.env.PORT || 3000;
console.error(port);

app.listen(port);

console.log('Server now listening on port ' + port);
