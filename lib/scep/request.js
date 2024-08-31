const tmp = require('tmp');
const sscep = require('./sscep');
const fs = require('fs');

var request = function(params, callback) {
    //temp dir
    tmp.dir({unsafeCleanup: true}, function _tempDirCreated(err, path, cleanupCallback) {
        if(err) {
            callback(err, false);
        } else {
            var cmd = ['getca -u ' + params.url + ' -c ca.crt'];
            sscep.runCommand({cmd: cmd.join(' '), cwd: path}, function(err, out1) {
                if(err) {
                    callback(err, false);
                } else {
                    fs.writeFile(path + '/local.csr', params.csr, function(err) {
                        if(err) {
                            cleanupCallback();
                            callback(err, false);
                        } else {
                            fs.writeFile(path + '/local.key', params.key, function(err) {
                                if(err) {
                                    cleanupCallback();
                                    callback(err, false);
                                } else {
                                    var cmd = ['enroll -u ' + params.url + ' -c ca.crt -k local.key -r local.csr -l local.crt'];
                                    sscep.runCommand({cmd: cmd.join(' '), cwd: path}, function(err, out2) {
                                        if(err) {
                                            cleanupCallback();
                                            callback(err, false);
                                        } else {
                                            fs.readFile(path + '/local.crt', (err, cert) => {
                                                cleanupCallback();
                                                if(err) {
                                                    callback(err, false);
                                                } else {
                                                    callback(err, {
                                                        command: [out1.command, out2.command],
                                                        data: out2.stdout.toString(),
                                                        cert: cert.toString()
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
}

module.exports = request;