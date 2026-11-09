import React, {useState, useEffect} from 'react';
import {weeklyAttendance} from './attendanceStats.js';

export default function AttendanceOverview({records,loaded,error}) {
 const [today,setToday]=useState(()=>new Date());
 useEffect(()=>{const now=new Date(),tomorrow=new Date(now.getFullYear(),now.getMonth(),now.getDate()+1);const timer=setTimeout(()=>setToday(new Date()),tomorrow-now+100);return()=>clearTimeout(timer)},[today]);
 const {days,scale}=weeklyAttendance(records,today);
 const count=days.reduce((sum,d)=>sum+d.present+d.late+d.absent,0);
 const dateLabel=date=>{const [y,m,d]=date.split('-').map(Number);return new Date(y,m-1,d).toLocaleDateString(undefined,{month:'short',day:'numeric'});};
 return <section className="card chart-card"><div className="section-head"><div><h2>Attendance Overview</h2><p>Current week · {dateLabel(days[0].date)} – {dateLabel(days[6].date)}</p></div></div>{!loaded?<div className="attendance-chart-message">{error?'Attendance is unavailable while the local server is disconnected.':'Loading attendance…'}</div>:<><div className="chart-legend"><span><i className="legend-blue"/> Present</span><span><i className="legend-late"/> Late</span><span><i className="legend-absent"/> Absent</span></div><div className="chart" aria-hidden="true"><div className="y-axis">{Array.from({length:6},(_,i)=><span key={i}>{scale*(5-i)/5}</span>)}</div><div className="chart-body">{days.map(day=><div className="bar-group" key={day.date}><div className="bars">{[day.present,day.late,day.absent].map((n,i)=><div key={i} className={'bar attendance-bar-'+i} style={{height:`${n/scale*100}%`}}/>)}</div><span>{day.label}</span></div>)}</div></div>{count===0&&<p className="attendance-empty">No attendance recorded for this week yet.</p>}<details className="attendance-details"><summary>View daily counts</summary><div className="table-wrap"><table><thead><tr><th>Day</th><th>Present</th><th>Late</th><th>Absent</th></tr></thead><tbody>{days.map(day=><tr key={day.date}><td>{day.label}, {dateLabel(day.date)}</td><td>{day.present}</td><td>{day.late}</td><td>{day.absent}</td></tr>)}</tbody></table></div></details></>}</section>;
}
