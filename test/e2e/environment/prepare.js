var q = require('q'),
    PythonShell = require('python-shell');

PythonShell.defaultOptions = {
  mode: 'text',
  scriptPath: '../../../'  // TODO - UPDATE IT
};

function setUp() {
  var deferred = q.defer();
  var options = {args: ['demo', '--noinput']};

  PythonShell.run('manage.py', options, function(err, results) {
    if (err) {
      deferred.reject(err);
    } else {
      deferred.resolve();
      console.log('Environment set up done.');
    }
  });

  return deferred.promise;
}

function tearDown() {
  var deferred = q.defer();
  var options = {args: ['demo', '--purge', '--noinput']};

  PythonShell.run('manage.py', options, function(err, results) {
    if (err) {
      deferred.reject(err);
    } else {
      deferred.resolve();
      console.log('Environment tear down done.');
    }
  });

  return deferred.promise;
}

module.exports = tearDown()
  .then(setUp)
  .done();
