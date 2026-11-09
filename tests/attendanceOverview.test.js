import {test} from 'node:test';
import assert from 'node:assert/strict';
import {weeklyAttendance, localDateKey} from '../src/attendanceOverview.js';

test('groups saved records by date and status for the local Monday-to-Sunday week',()=>{
 const now=new Date(2026,10,5,10);
 const records=[{date:'2026-11-02',status:'Present'},{date:'2026-11-02',status:'Late'},{date:'2026-11-02',status:'Absent'},{date:'2026-11-05',status:'Present'},{date:'2026-11-01',status:'Present'},{date:'2026-11-09',status:'Present'},{date:'2026-11-05',status:'Unknown'}];
 const {days,scale}=weeklyAttendance(records,now);
 assert.equal(days[0].date,'2026-11-02');assert.equal(days[6].date,'2026-11-08');
 assert.deepEqual([days[0].present,days[0].late,days[0].absent],[1,1,1]);
 assert.equal(days[3].present,1);assert.equal(scale,5);
});
test('handles year boundaries, Sunday and chart scaling',()=>{
 const sunday=new Date(2027,0,3,16);
 const records=Array.from({length:11},()=>({date:'2027-01-03',status:'Present'}));
 const result=weeklyAttendance(records,sunday);
 assert.equal(result.days[0].date,'2026-12-28');assert.equal(result.days[6].date,'2027-01-03');
 assert.equal(result.days[6].present,11);assert.equal(result.scale,15);
 assert.equal(localDateKey(new Date(2027,0,1)), '2027-01-01');
 assert.ok(weeklyAttendance([],sunday).days.every(d=>d.present===0&&d.late===0&&d.absent===0));
});
