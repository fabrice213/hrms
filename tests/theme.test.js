import {test} from 'node:test';
import assert from 'node:assert/strict';
import {applyTheme, initializeTheme, saveTheme} from '../src/theme.js';

test('theme changes immediately, preserves settings and survives initialization', () => {
 let stored = JSON.stringify({company:'Example',theme:'Light'});
 globalThis.localStorage = {getItem:()=>stored,setItem:(_,value)=>{stored=value}};
 globalThis.document = {documentElement:{dataset:{},style:{}}};
 assert.equal(saveTheme('Dark'), 'Dark');
 assert.equal(document.documentElement.dataset.theme,'dark');
 assert.equal(JSON.parse(stored).company,'Example');
 applyTheme('Light');
 assert.equal(initializeTheme(),'Dark');
 assert.equal(document.documentElement.style.colorScheme,'dark');
 saveTheme('Light');
 assert.equal(document.documentElement.dataset.theme,'light');
 stored = 'not json';
 assert.equal(initializeTheme(),'Light');
});
