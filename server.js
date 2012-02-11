var SerialPort = require('serialport').SerialPort;
var sp;
try {
  sp = new SerialPort('/dev/tty.usbmodemfd121', { baudrate: 9600 });
} catch (e) {
  console.log('could not open serial port')
}
var path = require("path"),
    strata = require("strata");

// Use the current working directory as document root for this example.
var root = path.resolve(".");

var app = new strata.Builder;

app.use(strata.commonLogger);
app.use(strata.static, root, ['index.html']);

var io = require('socket.io').listen(strata.run(app));

sp.write('G90\n');

io.sockets.on('connection', function (socket) {
  socket.on('movement', function (data) {

    sp.write('G90\n');

    sp.write([
      'G1',
      'X' + data.x,
      'Y' + data.y,
      'F800'
    ].join(' ') + '\n');

    sp.write([
      'G1',
      'Z' + data.z,
      'F400'
    ].join(' ') + '\n');
  });
});