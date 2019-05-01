const fs = require('fs');
const papa = require('papaparse');

module.exports = function(file, callback) {
  const f = fs.createReadStream('./public/data/' + file + '.csv');
  let count = 0;

  papa.parse(f, {
    complete: function(results) {
      callback(results);
    }
  });
}
