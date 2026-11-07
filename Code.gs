const DB_ID = 'PASTE_GOOGLE_SHEET_ID_HERE';
const RECORDS_SHEET = 'OTRecords';
const SETTINGS_SHEET = 'Settings';

function setup() {
  const ss = SpreadsheetApp.openById(DB_ID);
  let sh = ss.getSheetByName(RECORDS_SHEET) || ss.insertSheet(RECORDS_SHEET);
  if (sh.getLastRow() === 0) {
    sh.appendRow(['id','createdAt','workDate','employee','shift','status','startTime','endTime','morningOtStart','actualOut','morningOtHours','eveningOtRawHours','eveningOtNetHours','totalOtHours','dailyWage','hourlyWage','otMultiplier','otPay','attendancePay','dailyTotal','createdBy']);
    sh.setFrozenRows(1);
  }
  let st = ss.getSheetByName(SETTINGS_SHEET) || ss.insertSheet(SETTINGS_SHEET);
  if (st.getLastRow() === 0) st.getRange(1,1,5,2).setValues([['key','value'],['normalHours',8],['defaultDailyWage',600],['otMultiplier',1.5],['teamPin','CHANGE-THIS-TEAM-PIN']]);
  return 'Setup complete';
}
function doGet() { return ContentService.createTextOutput(JSON.stringify({ok:true,service:'OT Manager API'})).setMimeType(ContentService.MimeType.JSON); }
function doPost(e) {
  try {
    const b = JSON.parse(e.postData.contents || '{}');
    const settings = getSettings_();
    if (!b.pin || b.pin !== settings.teamPin) return out_({ok:false,error:'รหัสทีมไม่ถูกต้อง'});
    if (b.action === 'list') return out_({ok:true,records:list_(b.month)});
    if (b.action === 'save') return out_({ok:true,record:save_(b.record)});
    return out_({ok:false,error:'Unknown action'});
  } catch(err) { return out_({ok:false,error:String(err)}); }
}
function getSettings_() {
  const v=SpreadsheetApp.openById(DB_ID).getSheetByName(SETTINGS_SHEET).getDataRange().getValues(), o={};
  v.slice(1).forEach(r=>o[r[0]]=r[1]);
  return {teamPin:String(o.teamPin||'CHANGE-THIS-TEAM-PIN')};
}
function save_(r) {
  const lock=LockService.getScriptLock(); lock.waitLock(15000);
  try {
    const sh=SpreadsheetApp.openById(DB_ID).getSheetByName(RECORDS_SHEET), id=r.id||Utilities.getUuid();
    const row=[id,new Date(),r.workDate,r.employee,r.shift,r.status,r.startTime,r.endTime,r.morningOtStart,r.actualOut,r.morningOtHours,r.eveningOtRawHours,r.eveningOtNetHours,r.totalOtHours,r.dailyWage,r.hourlyWage,r.otMultiplier,r.otPay,r.attendancePay,r.dailyTotal,r.createdBy||'team'];
    const data=sh.getDataRange().getValues(), i=data.findIndex((x,n)=>n>0&&x[0]===id);
    if(i>0) sh.getRange(i+1,1,1,row.length).setValues([row]); else sh.appendRow(row);
    return {id:id};
  } finally { lock.releaseLock(); }
}
function list_(month) {
  const v=SpreadsheetApp.openById(DB_ID).getSheetByName(RECORDS_SHEET).getDataRange().getValues();
  return v.slice(1).filter(r=>!month||String(r[2]).slice(0,7)===month).map(r=>({id:r[0],workDate:r[2],employee:r[3],shift:r[4],status:r[5],totalOtHours:r[13],otPay:r[17],dailyTotal:r[19]}));
}
function out_(x){return ContentService.createTextOutput(JSON.stringify(x)).setMimeType(ContentService.MimeType.JSON);}
