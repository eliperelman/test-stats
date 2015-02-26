var fs = require('fs');
var math = require('stats-lite');
var SUITE = 'Suites.ColdLaunch.clock.gaiamobile.org.visuallyLoaded';

var file = process.env.RAPTOR_LOGFILE;

if (!file) {
  throw new Error('Missing logfile from env RAPTOR_LOGFILE');
}

fs.readFile(file, { encoding: 'utf8' }, function(err, content) {
  if (err) {
    throw err;
  }

  var values = content
    .split('\n')
    .map(function(row) {
      var data = JSON.parse(row);
      return data[SUITE][0].value;
    });

  for (var chunk = 0, chunks = Math.ceil(values.length / 30); chunk < chunks; chunk++) {
    var start = chunk * 30;
    var end = ((chunk + 1) * 30) - 1;

    var chunkValues = values.slice(start, end);

    console.log('Mean ' + chunk + ':', math.mean(chunkValues));
    console.log('Median ' + chunk + ':', math.median(chunkValues));
    console.log('Mode ' + chunk + ':', math.median(chunkValues));
    console.log('Minimum ' + chunk + ':', Math.min.apply(Math, chunkValues));
    console.log('Maximum ' + chunk + ':', Math.max.apply(Math, chunkValues));
    console.log('Standard Deviation ' + chunk + ':', math.stdev(chunkValues));
    console.log('95th Percentile ' + chunk + ':', math.percentile(chunkValues, 0.95));
    console.log('\n ---------------- \n')
  }

});