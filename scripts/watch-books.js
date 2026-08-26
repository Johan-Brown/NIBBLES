const fs = require('fs');
const path = require('path');
const { execFile } = require('child_process');

const root = path.resolve(__dirname, '..');
const booksDir = path.join(root, 'books');
const syncScript = path.join(__dirname, 'sync-books.js');

let timer;
function sync() {
  clearTimeout(timer);
  timer = setTimeout(() => {
    execFile(process.execPath, [syncScript], (error, stdout, stderr) => {
      if (error) console.error(error.message);
      if (stdout) process.stdout.write(stdout);
      if (stderr) process.stderr.write(stderr);
    });
  }, 300);
}

console.log(`Watching ${booksDir} for EPUB changes...`);
sync();
fs.watch(booksDir, { persistent: true }, (eventType, filename) => {
  if (filename && path.extname(filename).toLowerCase() === '.epub') {
    console.log(`${eventType}: ${filename}`);
    sync();
  }
});
