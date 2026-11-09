// Attendance dates are calendar dates, so group by the browser's local calendar week.
export function localDateKey(date) {
 const year=date.getFullYear(),month=String(date.getMonth()+1).padStart(2,'0'),day=String(date.getDate()).padStart(2,'0');
 return `${year}-${month}-${day}`;
}
export function weeklyAttendance(records, now = new Date()) {
 const monday=new Date(now.getFullYear(),now.getMonth(),now.getDate(),12);
 monday.setDate(monday.getDate()-(monday.getDay()+6)%7);
 const days=Array.from({length:7},(_,i)=>{
  const date=new Date(monday);date.setDate(monday.getDate()+i);
  return {date:localDateKey(date),label:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i],present:0,late:0,absent:0};
 });
 const byDate=new Map(days.map(day=>[day.date,day]));
 for(const record of records){const day=byDate.get(record.date);if(!day)continue;if(record.status==='Present')day.present++;else if(record.status==='Late')day.late++;else if(record.status==='Absent')day.absent++;}
 const highest=Math.max(0,...days.flatMap(day=>[day.present,day.late,day.absent]));
 return {days,scale:Math.max(5,Math.ceil(highest/5)*5)};
}
