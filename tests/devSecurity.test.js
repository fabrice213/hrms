import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createServer} from 'vite';
import {resolve} from 'node:path';

test('development server blocks direct access to local databases and legacy data',async()=>{
 const vite=await createServer({server:{port:0,host:'127.0.0.1'}});
 try{await vite.listen();const port=vite.httpServer.address().port;const base=`http://127.0.0.1:${port}`;
  for(const path of ['/data/hrms.sqlite','/data/hrms.json','/data/hrms.sqlite-journal','/DATA/hrms.sqlite',`/@fs${resolve('data/hrms.sqlite')}`,'/data%2Fhrms.sqlite'])assert.equal((await fetch(base+path)).status,403,path);
  assert.equal((await fetch(base+'/app.html')).status,200);
 }finally{await vite.close()}
});
