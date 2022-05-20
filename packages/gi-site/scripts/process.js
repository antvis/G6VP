var fs = require('fs-extra');

fs.copy('./src/pages/Home/index.html', './dist/home.html', { overwrite: true }, function (err) {
  if (err) return console.error(err);
  console.log('copy home.html success!');
});
