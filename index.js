var fs = require('fs');
var math = require('stats-lite');
var file = process.env.RAPTOR_LOGFILE;

var METRIC_NAME = 'Suites.ColdLaunch.clock.gaiamobile.org.visuallyLoaded';
var CHUNK_SIZE = 30;

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
      return data[METRIC_NAME][0].value;
    });

  for (var chunk = 0, chunks = Math.ceil(values.length / CHUNK_SIZE); chunk < chunks; chunk++) {
    var start = chunk * CHUNK_SIZE;
    var end = ((chunk + 1) * CHUNK_SIZE) - 1;

    var chunkValues = values.slice(start, end);

    console.log('Mean %d: %d', chunk, math.mean(chunkValues));
    console.log('Median %d: %d', chunk, math.median(chunkValues));
    console.log('Mode %d: %d', chunk, math.median(chunkValues));
    console.log('Minimum %d: %d', chunk, Math.min.apply(Math, chunkValues));
    console.log('Maximum %d: %d', chunk, Math.max.apply(Math, chunkValues));
    console.log('Standard Deviation %d: %d', chunk, math.stdev(chunkValues));
    console.log('95th Percentile %d: %d', chunk, math.percentile(chunkValues, 0.95));
    console.log('\n ---------------- \n')
  }

});