import {test} from 'node:test';
import assert from 'node:assert/strict';
import {buildReports} from '../src/reports.js';

test('reports expose current records and accurate summaries',()=>{
 const source={employees:[['Alice','alice@example.com','Engineer','IT','Active']],attendance:[{date:'2026-11-01',name:'Alice',email:'alice@example.com',status:'Present',checkIn:'08:00',checkOut:'17:00'}],leaves:[['Alice','Annual','2026-11-02','2026-11-03','2','Pending']],vacancies:[],payroll:[{period:'2026-11',name:'Alice',email:'alice@example.com',base:100,allowances:10,deductions:5,gross:110,net:105,status:'Draft'}]};
 const reports=buildReports(source);
 assert.equal(reports.length,5);
 assert.deepEqual(reports[0].rows,source.employees);
 assert.deepEqual(reports[1].summary,[['Records',1],['Present',1],['Absent',0],['Late',0]]);
 assert.equal(reports[2].summary[1][1],1);
 assert.equal(reports[3].rows.length,0);
 assert.equal(reports[4].rows[0][7],105);
 assert.equal(reports[4].rows[0].length,reports[4].headers.length);
});
