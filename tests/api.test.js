import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { once } from 'node:events';
import { createServer } from 'node:net';

test('employee and leave data survive a server restart', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'hrms-test-'));
  const reservation = createServer().listen(0, '127.0.0.1');
  await once(reservation, 'listening');
  const port = reservation.address().port;
  await new Promise(resolve => reservation.close(resolve));
  const script = resolve('server/index.js');
  let server;
  async function start() {
    server = spawn(process.execPath, [script], {cwd: dir, env: {...process.env, PORT: String(port)}, stdio: ['ignore','pipe','pipe']});
    const [data] = await once(server.stdout, 'data');
    assert.match(data.toString(), /listening/);
  }
  async function stop() { const exited = once(server, 'exit'); server.kill(); await exited; server = null; }
  try {
    await start();
    const url = `http://127.0.0.1:${port}/api/data`;
    assert.equal(await (await fetch(url)).json(), null);
    const data = {employees: [['New Member','member@example.com','Developer','IT','Active']], leaves: [], attendance: [{email:'member@example.com',name:'New Member',date:'2026-11-07',status:'Present',checkIn:'08:00',checkOut:'17:00'}], vacancies: [{title:'Developer',department:'IT',date:'2026-11-07',status:'Active'}], payroll: [{id:'test-payroll',email:'member@example.com',name:'New Member',period:'2026-11',base:500000,allowances:50000,deductions:75000,gross:550000,net:475000,status:'Draft'}]};
    const save = await fetch(url,{method:'PUT',headers:{'content-type':'application/json'},body:JSON.stringify(data)});
    assert.equal(save.status, 200);
    assert.deepEqual(JSON.parse(await readFile(join(dir, 'data/hrms.json'), 'utf8')), data);
    await stop();
    await start();
    assert.deepEqual(await (await fetch(url)).json(), data);
    const invalid = await fetch(url,{method:'PUT',headers:{'content-type':'application/json'},body:JSON.stringify({employees:'bad'})});
    assert.equal(invalid.status,400);
    const badPayroll = await fetch(url,{method:'PUT',headers:{'content-type':'application/json'},body:JSON.stringify({...data,payroll:'bad'})});
    assert.equal(badPayroll.status,400);
    assert.deepEqual(await (await fetch(url)).json(), data);
  } finally { if(server) await stop(); await rm(dir,{recursive:true,force:true}); }
});
