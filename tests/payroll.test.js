import {test} from 'node:test';
import assert from 'node:assert/strict';
import {calculatePayroll,formatRwf} from '../src/payroll.js';

test('calculates gross and net in whole RWF',()=>{
 assert.deepEqual(calculatePayroll('500000','50000','75000'),{base:500000,allowances:50000,deductions:75000,gross:550000,net:475000});
 assert.deepEqual(calculatePayroll('0','0','0'),{base:0,allowances:0,deductions:0,gross:0,net:0});
 assert.match(formatRwf(475000),/475/);
});
test('rejects invalid or unsafe payroll amounts',()=>{
 for(const inputs of [['','0','0'],['1.5','0','0'],['-1','0','0'],['1','0','2'],['1000000000001','0','0'],['foo','0','0']]) assert.throws(()=>calculatePayroll(...inputs));
});
