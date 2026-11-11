import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { once } from 'node:events';
import { createServer } from 'node:net';

test('server enforces role and department scope and persists SQLite data',async()=>{
 const dir=await mkdtemp(join(tmpdir(),'hrms-rbac-'));
 const sock=createServer().listen(0,'127.0.0.1');await once(sock,'listening');const port=sock.address().port;await new Promise(r=>sock.close(r));
 const script=resolve('server/index.js');let child;
 async function start(){child=spawn(process.execPath,[script],{env:{...process.env,PORT:String(port),HRMS_DATA_DIR:dir},stdio:['ignore','pipe','pipe']});const [line]=await once(child.stdout,'data');assert.match(line.toString(),/listening/)}
 async function stop(){const exiting=once(child,'exit');child.kill();await exiting;child=null}
 const base=`http://127.0.0.1:${port}`;
 const call=async(path,{method='GET',body,cookie,origin}={})=>{const response=await fetch(base+'/api'+path,{method,headers:{...(body?{'content-type':'application/json'}:{}),...(cookie?{cookie}:{}),...(origin?{origin}:{})},body:body?JSON.stringify(body):undefined});return {status:response.status,data:await response.json(),cookie:response.headers.get('set-cookie')?.split(';')[0]}};
 try{await start();
 assert.equal((await call('/employees')).status,401);
 assert.equal((await call('/setup')).data.needsSetup,true);
 const setup=await call('/setup',{method:'POST',body:{name:'Admin',email:'admin@example.com',password:'testpass123'}});assert.equal(setup.status,201);const admin=setup.cookie;
 assert.equal((await call('/setup',{method:'POST',body:{name:'Second',email:'bad@example.com',password:'testpass123'}})).status,403);
 for(const employee of [{name:'Alice',email:'alice@example.com',department:'IT',position:'Engineer'},{name:'Bob',email:'bob@example.com',department:'Finance',position:'Accountant'}])assert.equal((await call('/employees',{method:'POST',cookie:admin,body:employee})).status,201);
 const employees=(await call('/employees',{cookie:admin})).data;const alice=employees.find(x=>x.name==='Alice'),bob=employees.find(x=>x.name==='Bob');
 for(const [role,email,department,employeeId] of [['HR Manager','hr@example.com','',null],['Payroll Officer','pay@example.com','',null],['Recruitment Officer','rec@example.com','',null],['Department Manager','mgr@example.com','IT',null],['Normal Employee','alice@example.com','',alice.id],['Normal Employee','bob@example.com','',bob.id]])assert.equal((await call('/users',{method:'POST',cookie:admin,body:{name:role,email,password:'testpass123',role,department,employeeId}})).status,201);
 const login=async email=>{const r=await call('/login',{method:'POST',body:{email,password:'testpass123'}});assert.equal(r.status,200);return r.cookie};
 const hr=await login('hr@example.com'),pay=await login('pay@example.com'),rec=await login('rec@example.com'),manager=await login('mgr@example.com'),user=await login('alice@example.com'),other=await login('bob@example.com');
 assert.equal((await call('/payroll',{cookie:hr})).status,403);assert.equal((await call('/users',{cookie:hr})).status,403);assert.equal((await call('/users',{cookie:pay})).status,403);assert.equal((await call('/employees',{cookie:rec})).status,403);assert.equal((await call('/employees',{method:'POST',cookie:pay,body:{name:'Bad'}})).status,403);
 assert.deepEqual((await call('/employees',{cookie:manager})).data.map(x=>x.name),['Alice']);assert.deepEqual((await call('/employees',{cookie:user})).data.map(x=>x.name),['Alice']);
 assert.equal((await call('/leaves',{method:'POST',cookie:user,body:{employeeId:bob.id,type:'Annual',start:'2026-11-01',end:'2026-11-02'}})).status,201);
 const ownLeaves=(await call('/leaves',{cookie:user})).data;assert.equal(ownLeaves[0].employee_id,alice.id);assert.equal((await call('/leaves',{cookie:other})).data.length,0);
 assert.equal((await call(`/leaves/${ownLeaves[0].id}`,{method:'PATCH',cookie:manager,body:{status:'Approved'}})).status,403);
 assert.equal((await call(`/leaves/${ownLeaves[0].id}`,{method:'PATCH',cookie:manager,body:{recommendation:'Recommend approval'}})).status,200);
 assert.equal((await call(`/leaves/${ownLeaves[0].id}`,{method:'PATCH',cookie:hr,body:{status:'Approved'}})).status,200);
 for(const id of [alice.id,bob.id])assert.equal((await call('/payroll',{method:'POST',cookie:pay,body:{employeeId:id,period:'2026-11',base:1000,allowances:0,deductions:100}})).status,201);
 assert.equal((await call('/payroll',{cookie:user})).data.length,0);
 const payroll=(await call('/payroll',{cookie:pay})).data;
 assert.equal((await call(`/payroll/${payroll.find(p=>p.employee_id===alice.id).id}`,{method:'PATCH',cookie:pay,body:{paidDate:'2026-11-05',reference:'paid elsewhere'}})).status,200);
 assert.equal((await call('/payroll',{cookie:user})).data.length,1);assert.equal((await call('/payroll',{cookie:other})).data.length,0);
 assert.equal((await call('/settings',{cookie:hr})).status,403);
 assert.equal((await call('/settings',{method:'PATCH',cookie:admin,body:{company:'Acme',email:'info@example.com',phone:'123',address:'Kigali'}})).status,200);
 assert.equal((await call('/settings',{cookie:admin})).data.company,'Acme');
 assert.equal((await call('/vacancies',{method:'POST',cookie:rec,body:{title:'Developer',department:'IT',date:'2026-11-05'}})).status,201);
 const vacancy=(await call('/vacancies',{cookie:rec})).data[0];
 assert.equal((await call('/candidates',{method:'POST',cookie:rec,body:{vacancyId:vacancy.id,name:'Candidate',email:'candidate@example.com'}})).status,201);
 assert.equal((await call('/candidates',{cookie:manager})).status,403);
 const userRow=(await call('/users',{cookie:admin})).data.find(u=>u.email==='alice@example.com');
 assert.equal((await call(`/users/${userRow.id}`,{method:'PATCH',cookie:admin,body:{role:'Normal Employee',active:false,employeeId:alice.id,department:''}})).status,200);
 assert.equal((await call('/employees',{cookie:user})).status,401);
 assert.equal((await call(`/users/${userRow.id}`,{method:'PATCH',cookie:admin,body:{role:'Normal Employee',active:true,employeeId:alice.id,department:''}})).status,200);
 assert.equal((await call('/change-password',{method:'POST',cookie:rec,body:{currentPassword:'wrong',newPassword:'newpass123'}})).status,400);
 assert.equal((await call('/change-password',{method:'POST',cookie:rec,body:{currentPassword:'testpass123',newPassword:'newpass123'}})).status,200);
 assert.equal((await call('/vacancies',{cookie:rec})).status,401);
 assert.equal((await call('/login',{method:'POST',body:{email:'rec@example.com',password:'newpass123'}})).status,200);
 assert.equal((await call('/data',{cookie:admin})).status,404);assert.equal((await call('/employees',{method:'POST',cookie:admin,origin:'https://attacker.example',body:{}})).status,403);
 await stop();await start();const again=await login('alice@example.com');assert.equal((await call('/payroll',{cookie:again})).data.length,1);
 }finally{if(child)await stop();await rm(dir,{recursive:true,force:true})}
});
