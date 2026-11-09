import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdir } from 'node:fs/promises';
import { extname } from 'node:path';

test('source module basenames do not collide on case-insensitive filesystems', async () => {
 const files = (await readdir('src')).filter(name => ['.js', '.jsx'].includes(extname(name)));
 const seen = new Map();
 for (const file of files) {
  const key = file.slice(0, -extname(file).length).toLowerCase();
  assert.equal(seen.has(key), false, `${file} conflicts with ${seen.get(key)} on Windows`);
  seen.set(key, file);
 }
});
