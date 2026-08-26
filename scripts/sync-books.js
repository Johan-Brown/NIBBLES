const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const booksDir = path.join(root, 'books');
const output = path.join(root, 'books.json');

function slugify(name) {
  return name
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\.[^.]+$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function titleCase(name) {
  return name
    .replace(/\.[^.]+$/, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const files = fs.readdirSync(booksDir, { withFileTypes: true })
  .filter(entry => entry.isFile() && path.extname(entry.name).toLowerCase() === '.epub')
  .map(entry => entry.name)
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));

const books = files.map((file, index) => ({
  title: titleCase(file),
  slug: slugify(file),
  file: `books/${file}`,
  format: 'epub',
  status: 'published',
  order: index + 1
}));

const data = {
  generatedAt: new Date().toISOString(),
  books
};

fs.writeFileSync(output, JSON.stringify(data, null, 2) + '\n');
console.log(`Synced ${books.length} EPUB book(s) to ${output}`);
