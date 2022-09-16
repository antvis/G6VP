var fs = require('fs-extra');

fs.removeSync('./dist');

fs.move('./packages/gi-site/dist', './dist', function (err) {
  if (err) return console.error(err);
  console.log('move dist success!');
});
