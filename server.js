var hook = require('hook.io').createHook({
  name : 'fingerpen',
  silent: true
});

hook.start();

var path = require("path"),
    strata = require("strata");

// Use the current working directory as document root for this example.
var root = path.resolve(".");

var app = new strata.Builder;

app.use(strata.commonLogger);
app.use(strata.static, root, ['index.html']);

hook.on('hook::ready', function() {
  var io = require('socket.io').listen(strata.run(app));
  io.sockets.on('connection', function (socket) {
    socket.on('movement', function (data) {

      hook.emit("gcode", {
        name : 'fingerpen gcode packet',
        gcode : [
          [
            'G1',
            'X' + data.x,
            'F800'
          ].join(' ')
          ]
      });
    });
  });
});
