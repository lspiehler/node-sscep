var tmp = require('tmp');
var sscep = require('./sscep');

var GetCA = function(params, callback) {
    //temp dir
    tmp.dir({unsafeCleanup: true}, function _tempDirCreated(err, path, cleanupCallback) {
        if(err) {
            callback(err, false);
        } else {
            var cmd = ['getca -u ' + params.url + '-c path'];
            sscep.runCommand({cmd: cmd.join(' '), cwd: path}, function(err, out) {
                callback(err, {
                    command: [out.command + ' -in cert.crt'],
                    data: out.stdout.toString()
                });
            });
        }
    });
}

module.exports = GetCA;