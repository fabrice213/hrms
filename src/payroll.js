export function calculatePayroll(salary, allowance, deduction) {
 const parse=(value)=>{
  const text=String(value ?? '').trim();
  if(!/^\d+$/.test(text)) throw new Error('Enter whole, non-negative amounts in RWF.');
  const n=Number(text);
  if(!Number.isSafeInteger(n)||n>1_000_000_000_000) throw new Error('An amount is too large.');
  return n;
 };
 const base=parse(salary), allowances=parse(allowance), deductions=parse(deduction);
 const gross=base+allowances, net=gross-deductions;
 if(net<0) throw new Error('Deductions cannot exceed gross pay.');
 return {base,allowances,deductions,gross,net};
}
export const formatRwf = value => `RWF ${Number(value || 0).toLocaleString('en-RW')}`;
