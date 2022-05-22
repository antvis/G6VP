var fs = require('fs-extra');

fs.copy('./dist/index.html', '../gi-site/dist/home.html', { overwrite: true }, function (err) {
  if (err) return console.log(err);
  console.log('copy home.html to gi-site success!');
});

fs.copy('./dist/', '../gi-site/dist/', { overwrite: false }, function (err) {
  if (err) return console.log(err);
  console.log('copy home.js to gi-site success!');
});
