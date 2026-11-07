export function downloadCsv(name, headers, rows) {
 const escape=value=>{let text=String(value??'');if (/^[\s]*[=+\-@\t\r]/.test(text)) text="'"+text;return '"'+text.replaceAll('"','""')+'"'};
 const csv=[headers,...rows].map(row=>row.map(escape).join(',')).join('\r\n');
 const url=URL.createObjectURL(new Blob(['\ufeff',csv],{type:'text/csv;charset=utf-8'}));
 const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
