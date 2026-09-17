function doGet(e) {
  /* รองรับ API Endpoint สำหรับ GitHub Pages หรือการเรียกจากภายนอก */
  if (e && e.parameter && e.parameter.action) {
    let action = e.parameter.action;
    let callback = e.parameter.callback; /* รองรับ JSONP หากเบราว์เซอร์ติด CORS */
    
    if (action === 'get_app_config') {
      let data = getAppConfigData();
      let output = JSON.stringify(data);
      if (callback) {
        return ContentService.createTextOutput(callback + '(' + output + ')')
          .setMimeType(ContentService.MimeType.JAVASCRIPT);
      }
      return ContentService.createTextOutput(output)
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    if (action === 'verify_passcode') {
      let result = verifyStaffPasscode(e.parameter.passcode);
      let output = JSON.stringify(result);
      if (callback) {
        return ContentService.createTextOutput(callback + '(' + output + ')')
          .setMimeType(ContentService.MimeType.JAVASCRIPT);
      }
      return ContentService.createTextOutput(output)
        .setMimeType(ContentService.MimeType.JSON);
    }
  }

  let page = 'index';
  if (e && e.parameter && e.parameter.page) {
    page = e.parameter.page.toLowerCase();
  }
  
  try {
    const scriptUrl = ScriptApp.getService().getUrl();

    if (page === 'womac') {
      let tpl = HtmlService.createTemplateFromFile('Womac');
      tpl.script_url = scriptUrl;
      return tpl.evaluate()
        .setTitle('WOMAC Calculator - Chaophraya Yommarat')
        .addMetaTag('viewport', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    }
    
    if (page === 'kss_patient') {
      let tpl = HtmlService.createTemplateFromFile('KssPatient');
      tpl.script_url = scriptUrl;
      return tpl.evaluate()
        .setTitle('Knee Society Score (KSS) - Chaophraya Yommarat')
        .addMetaTag('viewport', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    }
    
    if (page === 'kss_physician') {
      let tpl = HtmlService.createTemplateFromFile('KssPhysician');
      tpl.staff_name = e.parameter.staff_name || 'Unknown Staff';
      tpl.staff_email = e.parameter.staff_email || '';
      tpl.script_url = scriptUrl;
      return tpl.evaluate()
        .setTitle('Objective Knee Indicators (KSS) - Chaophraya Yommarat')
        .addMetaTag('viewport', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    }
    
    if (page === 'fjs') {
      let tpl = HtmlService.createTemplateFromFile('FjsPatient');
      tpl.script_url = scriptUrl;
      return tpl.evaluate()
        .setTitle('FJS (Forgotten Joint Score) - Chaophraya Yommarat')
        .addMetaTag('viewport', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    }
    
    if (page === 'oxford') {
      let tpl = HtmlService.createTemplateFromFile('OxfordPatient');
      tpl.script_url = scriptUrl;
      return tpl.evaluate()
        .setTitle('Oxford Score - Chaophraya Yommarat')
        .addMetaTag('viewport', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    }
    
    if (page === 'eq5d' || page === 'eq5d5l') {
      let tpl = HtmlService.createTemplateFromFile('Eq5dPatient');
      tpl.script_url = scriptUrl;
      return tpl.evaluate()
        .setTitle('EQ-5D-5L (Health-Related Quality of Life) - Chaophraya Yommarat')
        .addMetaTag('viewport', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    }
    
    if (page === 'dashboard') {
      let tpl = HtmlService.createTemplateFromFile('Dashboard');
      tpl.script_url = scriptUrl;
      return tpl.evaluate()
        .setTitle('Master Summary Dashboard - Chaophraya Yommarat')
        .addMetaTag('viewport', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    }
    
    try {
      return HtmlService.createHtmlOutputFromFile('index')
        .setTitle('Arthroplasty Score - Hub')
        .addMetaTag('viewport', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    } catch (e) {
      return HtmlService.createHtmlOutputFromFile('Index')
        .setTitle('Arthroplasty Score - Hub')
        .addMetaTag('viewport', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    }
      
  } catch (error) {
    return HtmlService.createHtmlOutput(`
      <div style="font-family: sans-serif; text-align: center; padding: 50px;">
        <h2 style="color: #e74c3c;">เกิดข้อผิดพลาดในการเปิดหน้าเว็บ</h2>
        <p>ไม่พบไฟล์ HTML โปรดตรวจสอบว่าคุณได้สร้างไฟล์ชื่อ <b>Womac.html</b>, <b>KssPatient.html</b> หรือ <b>Index.html</b> ไว้ใน Apps Script หรือไม่</p>
        <p style="color: gray; font-size: 12px;">Error: ${error.message}</p>
      </div>
    `);
  }
}

// ฟังก์ชันสำหรับดึง URL ของหน้าหลัก (ใช้สำหรับปุ่มย้อนกลับ)
function getScriptUrl() {
  return ScriptApp.getService().getUrl();
}

function getAppConfigData() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('APP_CONFIG');
  if (!sheet) return [];
  
  const data = sheet.getDataRange().getDisplayValues();
  const result = [];
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const isActive = row[10] ? row[10].toUpperCase() : '';
    
    if (isActive === 'TRUE') {
      result.push({
        module_id: row[0],
        title: row[1],
        subtitle: row[2],
        description: row[3],
        tag_score: row[4],
        tag_qty: row[5],
        tag_joint: row[6],
        theme_color: row[7] || '#2e7d32', 
        qr_drive_id: row[8],
        action_link: row[9],
        user_type: row[11] ? row[11].toUpperCase() : 'PATIENT' // Column L is index 11
      });
    }
  }
  return result;
}

function verifyStaffPasscode(passcode) {
  if (!passcode) {
    return { success: false, message: 'กรุณากรอกรหัสผ่าน' };
  }
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('STAFF_ACCOUNTS');
  if (!sheet) {
    return { success: false, message: 'ไม่พบฐานข้อมูลบัญชีเจ้าหน้าที่ (STAFF_ACCOUNTS)' };
  }
  
  const data = sheet.getDataRange().getDisplayValues();
  const cleanPasscode = String(passcode).trim();
  
  // Loop starting from index 1 (skipping header row)
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const dbPasscode = row[2] ? row[2].trim() : '';
    const isActive = row[3] ? row[3].toUpperCase() : '';
    
    if (dbPasscode === cleanPasscode) {
      if (isActive === 'TRUE') {
        return {
          success: true,
          name: row[0],  // Staff_Name
          email: row[1]  // Staff_Email
        };
      } else {
        return { success: false, message: 'รหัสผ่านนี้ถูกระงับการใช้งาน' };
      }
    }
  }
  return { success: false, message: 'รหัสผ่านไม่ถูกต้อง' };
}

function submitWomacData(payload) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // 1. บันทึกข้อมูลละเอียดในตาราง WOMAC_DATA
  const womacSheet = ss.getSheetByName('WOMAC_DATA') || ss.insertSheet('WOMAC_DATA');
  if (womacSheet.getLastRow() === 0) {
    womacSheet.appendRow([
      'Timestamp', 
      'HN', 
      'Prefix', 
      'Name_Surname', 
      'Gender', 
      'Age', 
      'JointType', 
      'PainScore', 
      'StiffnessScore', 
      'FunctionScore', 
      'TotalScore', 
      'Severity', 
      'RawScores'
    ]);
  }
  
  womacSheet.appendRow([
    new Date(),
    payload.hn,
    payload.prefix,
    payload.nameSurname,
    payload.gender,
    payload.age,
    payload.jointType,
    payload.painScore,
    payload.stiffnessScore,
    payload.functionScore,
    payload.totalScore,
    payload.severity,
    JSON.stringify(payload.rawScores)
  ]);
  
  // 2. บันทึกประวัติในตารางกลาง LOG_WOMAC
  const logSheet = ss.getSheetByName('LOG_WOMAC') || ss.insertSheet('LOG_WOMAC');
  if (logSheet.getLastRow() === 0) {
    logSheet.appendRow([
      'Timestamp', 
      'HN', 
      'Prefix', 
      'Name_Surname', 
      'Gender', 
      'Age', 
      'Evaluation_Type', 
      'Total_Score', 
      'Severity'
    ]);
  }
  
  logSheet.appendRow([
    new Date(),
    payload.hn,
    payload.prefix,
    payload.nameSurname,
    payload.gender,
    payload.age,
    'WOMAC Hip (' + payload.evalStage + ')',
    payload.totalScore + ' / 96',
    payload.severity
  ]);
  
  // Update Master Summary (If we treat WOMAC as something else, wait... 
  // actually WOMAC isn't in the summary chart (KSS, FJS, Oxford, EQ5D5L).
  // So I don't need to add it to the master summary.
  
  return true;
}

function migrateDatabaseHeaders() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // 1. Migrate WOMAC_DATA
  const womacSheet = ss.getSheetByName('WOMAC_DATA');
  if (womacSheet) {
    const lastRow = womacSheet.getLastRow();
    const lastCol = womacSheet.getLastColumn();
    if (lastRow > 1) {
      // Check if header is already migrated
      const currentHeaders = womacSheet.getRange(1, 1, 1, lastCol).getValues()[0];
      if (currentHeaders[1] === 'JointType') { // Old header has JointType at Col B (index 1)
        console.log("Migrating WOMAC_DATA...");
        // Fetch all data
        const oldDataRange = womacSheet.getRange(2, 1, lastRow - 1, 8); // A-H
        const oldValues = oldDataRange.getValues();
        
        const newValues = [];
        const migratedOldValues = [];
        
        for (let i = 0; i < oldValues.length; i++) {
          const row = oldValues[i];
          const valB = row[1] ? String(row[1]).trim() : '';
          
          if (valB !== 'Knee' && valB !== 'Hip') {
            // This is already a new row! (Row 10 in the screenshot)
            // It has the new structure in columns A-M
            const fullRow = womacSheet.getRange(i + 2, 1, 1, 13).getValues()[0];
            newValues.push(fullRow);
          } else {
            // This is an old row. We need to map it to the new structure:
            migratedOldValues.push([
              row[0], // Timestamp
              '',     // HN
              '',     // Prefix
              '',     // Name_Surname
              '',     // Gender
              '',     // Age
              row[1], // JointType
              row[2], // PainScore
              row[3], // StiffnessScore
              row[4], // FunctionScore
              row[5], // TotalScore
              row[6], // Severity
              row[7]  // RawScores
            ]);
          }
        }
        
        // Clear sheet and write new header + data
        womacSheet.clear();
        const newHeaders = ['Timestamp', 'HN', 'Prefix', 'Name_Surname', 'Gender', 'Age', 'JointType', 'PainScore', 'StiffnessScore', 'FunctionScore', 'TotalScore', 'Severity', 'RawScores'];
        womacSheet.getRange(1, 1, 1, newHeaders.length).setValues([newHeaders]);
        
        const allDataToWrite = migratedOldValues.concat(newValues);
        if (allDataToWrite.length > 0) {
          womacSheet.getRange(2, 1, allDataToWrite.length, newHeaders.length).setValues(allDataToWrite);
        }
        console.log("WOMAC_DATA migrated successfully.");
      } else {
        console.log("WOMAC_DATA already migrated or header mismatch.");
      }
    }
  }
  
  // 2. Migrate LOG_WOMAC
  const logSheet = ss.getSheetByName('LOG_WOMAC');
  if (logSheet) {
    const lastRow = logSheet.getLastRow();
    const lastCol = logSheet.getLastColumn();
    if (lastRow > 1) {
      const currentHeaders = logSheet.getRange(1, 1, 1, lastCol).getValues()[0];
      if (currentHeaders[1] === 'Email') { // Old header has Email at Col B
        console.log("Migrating LOG_WOMAC...");
        const oldValues = logSheet.getRange(2, 1, lastRow - 1, 9).getValues(); // A-I
        
        const newValues = [];
        const migratedOldValues = [];
        
        for (let i = 0; i < oldValues.length; i++) {
          const row = oldValues[i];
          const valB = row[1] ? String(row[1]).trim() : '';
          
          if (valB.indexOf('@') === -1 && valB !== '') {
            // Already new row structure
            const fullRow = logSheet.getRange(i + 2, 1, 1, 9).getValues()[0];
            newValues.push(fullRow);
          } else {
            // Old row structure
            const jointType = row[3] || 'Hip';
            const totalScore = row[7] !== '' ? row[7] + ' / 96' : '';
            migratedOldValues.push([
              row[0], // Timestamp
              '',     // HN
              '',     // Prefix
              '',     // Name_Surname
              '',     // Gender
              '',     // Age
              'WOMAC ' + jointType, // Evaluation_Type
              totalScore,           // Total_Score
              row[8]  // Severity
            ]);
          }
        }
        
        logSheet.clear();
        const newHeaders = ['Timestamp', 'HN', 'Prefix', 'Name_Surname', 'Gender', 'Age', 'Evaluation_Type', 'Total_Score', 'Severity'];
        logSheet.getRange(1, 1, 1, newHeaders.length).setValues([newHeaders]);
        
        const allDataToWrite = migratedOldValues.concat(newValues);
        if (allDataToWrite.length > 0) {
          logSheet.getRange(2, 1, allDataToWrite.length, newHeaders.length).setValues(allDataToWrite);
        }
        console.log("LOG_WOMAC migrated successfully.");
      } else {
        console.log("LOG_WOMAC already migrated or header mismatch.");
      }
    }
  }
}

function submitKssPatientData(payload) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // 1. บันทึกข้อมูลละเอียดลงตาราง KSS_PATIENT_DATA
  const kssSheet = ss.getSheetByName('KSS_PATIENT_DATA') || ss.insertSheet('KSS_PATIENT_DATA');
  if (kssSheet.getLastRow() === 0) {
    kssSheet.appendRow([
      'Timestamp',
      'HN',
      'Prefix',
      'Name_Surname',
      'Gender',
      'Age',
      'Eval_Stage',
      'Symptom_Score',
      'Satisfaction_Score',
      'Expectation_Score',
      'Functional_Score',
      'Total_Patient_Score',
      'Raw_Patient_Answers'
    ]);
  }
  
  kssSheet.appendRow([
    new Date(),
    payload.hn,
    payload.prefix,
    payload.nameSurname,
    payload.gender,
    payload.age,
    payload.evalStage, // "Pre-Op" หรือ "Post-Op"
    payload.symptomScore,
    payload.satisfactionScore,
    payload.expectationScore,
    payload.functionalScore,
    payload.totalPatientScore,
    JSON.stringify(payload.rawAnswers)
  ]);
  
  // 2. บันทึกประวัติสรุปลงตารางล็อกกลาง LOG_WOMAC
  const logSheet = ss.getSheetByName('LOG_WOMAC') || ss.insertSheet('LOG_WOMAC');
  if (logSheet.getLastRow() === 0) {
    logSheet.appendRow([
      'Timestamp', 
      'HN', 
      'Prefix', 
      'Name_Surname', 
      'Gender', 
      'Age', 
      'Evaluation_Type', 
      'Total_Score', 
      'Severity'
    ]);
  }
  
  logSheet.appendRow([
    new Date(),
    payload.hn,
    payload.prefix,
    payload.nameSurname,
    payload.gender,
    payload.age,
    'KSS ' + payload.evalStage,
    payload.totalPatientScore + ' / 180',
    '-'
  ]);
  
  // Update Master Summary
  updateMasterSummary(payload.hn, payload.prefix, payload.nameSurname, 'KSS', payload.evalStage, "Pt: " + payload.totalPatientScore, 'คนไข้');
  
  return true;
}

function getUnifiedTrackingList() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const tracker = {};

  function parseThaiDate(dateStr) {
    if (!dateStr) return 0;
    const parts = String(dateStr).split(' ')[0].split('/');
    if (parts.length === 3) {
      let d = parts[0].padStart(2, '0');
      let m = parts[1].padStart(2, '0');
      let y = parseInt(parts[2], 10);
      if (y > 2500) y -= 543;
      return new Date(`${y}-${m}-${d}`).getTime();
    }
    return new Date(dateStr).getTime() || 0;
  }

  function processSheet(sheetName, formKey) {
    const sheet = ss.getSheetByName(sheetName);
    if (!sheet) return;
    const data = sheet.getDataRange().getDisplayValues();
    const isPhy = (sheetName === 'KSS_PHYSICIAN_DATA');
    
    // Determine logical form type string
    let formTypeStr = '';
    if (formKey === 'kss_pt' || formKey === 'kss_md') formTypeStr = 'KSS';
    else if (formKey === 'fjs') formTypeStr = 'FJS-12';
    else if (formKey === 'oxford') formTypeStr = 'Oxford';
    else if (formKey === 'eq5d5l') formTypeStr = 'EQ-5D-5L';

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const ts = String(row[0]).trim();
      const hn = String(row[1]).trim();
      if (!hn || hn === 'HN') continue;
      
      let evalStage = '';
      let prefix = '';
      let name = '';
      let gender = '';
      let age = '';
      
      if (isPhy) {
        name = String(row[2]).trim();
        evalStage = String(row[3]).trim();
      } else {
        prefix = String(row[2]).trim();
        name = String(row[3]).trim();
        gender = String(row[4]).trim();
        age = String(row[5]).trim();
        evalStage = String(row[6]).trim();
      }
      
      // The key now includes the formTypeStr so they don't mix!
      const key = hn + "_" + evalStage + "_" + formTypeStr;
      
      if (!tracker[key]) {
        tracker[key] = {
          hn: hn,
          prefix: prefix,
          name: name,
          gender: gender,
          age: age,
          evalStage: evalStage,
          timestamp: ts,
          formType: formTypeStr, // store the form type
          kss_pt: false,
          kss_md: false,
          kss_pt_score: '-',
          kss_pt_severity: '-',
          kss_md_score: '-',
          kss_md_severity: '-',
          fjs_score: '-',
          oxford_score: '-',
          eq5d5l_score: '-'
        };
      } else {
        if (!isPhy && !tracker[key].gender) {
          tracker[key].prefix = prefix;
          tracker[key].name = name;
          tracker[key].gender = gender;
          tracker[key].age = age;
        }
        if (!isPhy) {
           let tOld = parseThaiDate(tracker[key].timestamp);
           let tNew = parseThaiDate(ts);
           if (tNew > tOld) tracker[key].timestamp = ts;
        }
      }
      
      if (formKey === 'kss_pt') {
        tracker[key].kss_pt = true;
        tracker[key].kss_pt_score = String(row[11] || '-');
        tracker[key].kss_pt_severity = String(row[13] || '-'); // index 13 is Severity
      } else if (formKey === 'kss_md') {
        tracker[key].kss_md = true;
        tracker[key].kss_md_score = String(row[11] || '-');
        // physician doesn't strictly have a severity column saved, but we can compute or ignore it
      } else if (formKey === 'fjs') {
        tracker[key].fjs_score = String(row[7] || '-');
      } else if (formKey === 'oxford') {
        tracker[key].oxford_score = String(row[7] || '-');
      } else if (formKey === 'eq5d5l') {
        tracker[key].eq5d5l_score = String(row[7] || '-');
      }
    }
  }

  processSheet('KSS_PATIENT_DATA', 'kss_pt');
  processSheet('KSS_PHYSICIAN_DATA', 'kss_md');
  processSheet('LOG_FJS', 'fjs');
  processSheet('LOG_OXFORD', 'oxford');
  processSheet('LOG_EQ5D5L', 'eq5d5l');

  const resultList = Object.values(tracker);
  
  resultList.sort((a, b) => {
    let tA = parseThaiDate(a.timestamp);
    let tB = parseThaiDate(b.timestamp);
    return tB - tA;
  });

  return resultList;
}

function submitKssPhysicianData(payload) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // บันทึกลง KSS_PHYSICIAN_DATA
  const phySheet = ss.getSheetByName('KSS_PHYSICIAN_DATA') || ss.insertSheet('KSS_PHYSICIAN_DATA');
  if (phySheet.getLastRow() === 0) {
    phySheet.appendRow([
      'Timestamp',
      'HN',
      'Patient_Name',
      'Eval_Stage',
      'Staff_Email',
      'Staff_Name',
      'Rom_Flexion',
      'Rom_Contracture',
      'Instability_ML',
      'Instability_AP',
      'Alignment_Angle',
      'Objective_Score',
      'Raw_Doctor_Answers'
    ]);
  }
  
  // ลบข้อมูลเก่าที่มี HN และ Eval_Stage ตรงกัน
  const data = phySheet.getDataRange().getValues();
  let targetHn = String(payload.hn).trim();
  let targetStage = String(payload.evalStage).trim();
  
  // วนลูปจากล่างขึ้นบนเพื่อลบแถว
  for (let i = data.length - 1; i >= 1; i--) {
    let rowHn = String(data[i][1]).trim();
    let rowStage = String(data[i][3]).trim();
    if (rowHn === targetHn && rowStage === targetStage) {
      phySheet.deleteRow(i + 1);
    }
  }

  
  phySheet.appendRow([
    new Date(),
    payload.hn,
    payload.patientName,
    payload.evalStage,
    payload.staffEmail,
    payload.staffName,
    payload.rawAnswers.rom_degrees !== undefined ? payload.rawAnswers.rom_degrees : '-',
    payload.rawAnswers.flexion_contracture !== undefined ? payload.rawAnswers.flexion_contracture : '-',
    payload.rawAnswers.ml_instability !== undefined ? payload.rawAnswers.ml_instability : '-',
    payload.rawAnswers.ap_instability !== undefined ? payload.rawAnswers.ap_instability : '-',
    payload.rawAnswers.alignment !== undefined ? payload.rawAnswers.alignment : '-',
    payload.totalScore,
    JSON.stringify(payload.rawAnswers)
  ]);
  
  // บันทึกลง LOG_WOMAC
  const logSheet = ss.getSheetByName('LOG_WOMAC') || ss.insertSheet('LOG_WOMAC');
  if (logSheet.getLastRow() === 0) {
    logSheet.appendRow([
      'Timestamp', 
      'HN', 
      'Prefix', 
      'Name_Surname', 
      'Gender', 
      'Age', 
      'Evaluation_Type', 
      'Total_Score', 
      'Severity'
    ]);
  }
  
  logSheet.appendRow([
    new Date(),
    payload.hn,
    payload.prefix || '-', // Prefix
    payload.patientName,
    payload.gender || '-', // Gender
    payload.age || '-', // Age
    'KSS Physician (' + payload.evalStage + ')',
    payload.totalScore + ' / 100',
    'Staff: ' + payload.staffName
  ]);
  
  // Update Master Summary
  updateMasterSummary(payload.hn, payload.prefix, payload.patientName, 'KSS', payload.evalStage, "MD: " + payload.totalScore, 'แพทย์');
  
  return true;
}

function updateMasterSummary(hn, prefix, name, assessmentType, evalStage, scoreStr, evaluatorType) {
  if (!hn) return false;
  
  if (!evaluatorType) {
    evaluatorType = (String(scoreStr).includes('MD:') || String(assessmentType).toUpperCase().includes('PHYSICIAN')) ? 'แพทย์' : 'คนไข้';
  }
  
  const cleanHn = String(hn).trim();
  const cleanName = ((prefix || '') + (name || '')).trim();
  
  const lock = LockService.getScriptLock();
  let hasLock = false;
  try {
    hasLock = lock.tryLock(30000); // รอคิวสูงสุด 30 วินาที ป้องกัน Concurrency Race Condition
  } catch (e) {
    Logger.log("Lock acquisition warning: " + e.message);
  }
  
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName('MASTER_SUMMARY');
    
    if (!sheet) {
      sheet = ss.insertSheet('MASTER_SUMMARY');
      // บรรทัดที่ 1: หมวดหมู่ช่วงเวลา (Matrix Blueprint 20 คอลัมน์ A - T)
      sheet.appendRow([
        '', '', '', '', 
        'ก่อนผ่าตัด', '', '', '', 
        'หลังผ่าตัด 3 เดือน', '', '', '', 
        'หลังผ่าตัด 6 เดือน', '', '', '', 
        'หลังผ่าตัด 1 ปี', '', '', ''
      ]);
      // บรรทัดที่ 2: ชื่อคอลัมน์
      sheet.appendRow([
        'ลำดับ', 'H/N', 'ชื่อ-นามสกุล', 'ผู้ประเมิน',
        'KSS', 'FJS', 'oxford', 'EQ5D5L',
        'KSS', 'FJS', 'oxford', 'EQ5D5L',
        'KSS', 'FJS', 'oxford', 'EQ5D5L',
        'KSS', 'FJS', 'oxford', 'EQ5D5L'
      ]);
      sheet.getRange("A1:T2").setFontWeight("bold").setBackground("#f3f3f3");
    }
    
    const data = sheet.getDataRange().getDisplayValues();
    if (data.length < 1) return false;
    
    // ตรวจสอบอัตโนมัติว่ามีคอลัมน์ D 'ผู้ประเมิน' หรือไม่
    let hasEvaluatorCol = false;
    for (let r = 0; r < Math.min(3, data.length); r++) {
      if (data[r][3] && data[r][3].includes('ผู้ประเมิน')) {
        hasEvaluatorCol = true;
        break;
      }
    }
    
    let targetRow = -1;
    let noCount = 0;
    
    // ค้นหาแถวที่ตรงกับ HN และ Evaluator
    for (let i = 0; i < data.length; i++) {
      const rowHn = String(data[i][1]).trim();
      const rowEval = hasEvaluatorCol ? String(data[i][3]).trim() : '';
      
      // นับลำดับเฉพาะแถวข้อมูลจริง (ไม่นับ Header หรือ Template)
      if (rowHn && rowHn !== 'H/N' && !rowHn.includes('ลำดับ') && !rowEval.includes('Yes') && !rowEval.includes('No')) {
        noCount++;
      }
      
      if (rowHn === cleanHn) {
        if (hasEvaluatorCol) {
          if (rowEval === evaluatorType || !rowEval) {
            targetRow = i + 1; // 1-based index
            break;
          }
        } else {
          targetRow = i + 1;
          break;
        }
      }
    }
    
    if (targetRow === -1) {
      targetRow = sheet.getLastRow() + 1;
      sheet.getRange(targetRow, 1).setValue(noCount + 1);
      sheet.getRange(targetRow, 2).setValue(cleanHn);
      sheet.getRange(targetRow, 3).setValue(cleanName);
      if (hasEvaluatorCol) {
        sheet.getRange(targetRow, 4).setValue(evaluatorType);
      }
    } else {
      if (cleanName) {
        sheet.getRange(targetRow, 3).setValue(cleanName);
      }
      if (hasEvaluatorCol && evaluatorType) {
        sheet.getRange(targetRow, 4).setValue(evaluatorType);
      }
    }
    
    // คำนวณ Base Column ตามช่วงเวลา
    // ถ้ามีคอลัมน์ผู้ประเมิน (20 คอลัมน์): Pre-Op=Col E (5), 3mo=Col I (9), 6mo=Col M (13), 1yr=Col Q (17)
    // ถ้าไม่มี (19 คอลัมน์เดิม): Pre-Op=Col D (4), 3mo=Col H (8), 6mo=Col L (12), 1yr=Col P (16)
    const startCol = hasEvaluatorCol ? 5 : 4;
    let baseCol = startCol;
    const stageStr = String(evalStage || '').toLowerCase();
    if (stageStr.includes('pre-op') || stageStr.includes('ก่อน')) {
      baseCol = startCol;
    } else if (stageStr.includes('3 month') || stageStr.includes('3mo') || stageStr.includes('3 เดือน')) {
      baseCol = startCol + 4;
    } else if (stageStr.includes('6 month') || stageStr.includes('6mo') || stageStr.includes('6 เดือน')) {
      baseCol = startCol + 8;
    } else if (stageStr.includes('1 year') || stageStr.includes('1yr') || stageStr.includes('1 ปี')) {
      baseCol = startCol + 12;
    }
    
    let offset = 0;
    const typeStr = String(assessmentType || '').toUpperCase();
    if (typeStr.includes('KSS')) offset = 0;
    else if (typeStr.includes('FJS')) offset = 1;
    else if (typeStr.includes('OXFORD')) offset = 2;
    else if (typeStr.includes('EQ5D')) offset = 3;
    
    const targetCol = baseCol + offset;
    
    // บันทึกคะแนน
    const currentVal = sheet.getRange(targetRow, targetCol).getDisplayValue();
    if (currentVal && currentVal !== String(scoreStr)) {
      if (!hasEvaluatorCol) {
        if (currentVal.includes("Pt:") && String(scoreStr).includes("Pt:")) {
          sheet.getRange(targetRow, targetCol).setValue(scoreStr);
        } else if (currentVal.includes("MD:") && String(scoreStr).includes("MD:")) {
          sheet.getRange(targetRow, targetCol).setValue(scoreStr);
        } else {
          sheet.getRange(targetRow, targetCol).setValue(currentVal + " | " + scoreStr);
        }
      } else {
        sheet.getRange(targetRow, targetCol).setValue(scoreStr);
      }
    } else {
      sheet.getRange(targetRow, targetCol).setValue(scoreStr);
    }
    
    return true;
  } catch (err) {
    Logger.log("Error in updateMasterSummary: " + err.message);
    throw err;
  } finally {
    if (hasLock) {
      lock.releaseLock();
    }
  }
}

function parseThaiDateStr(str) {
  if (!str) return null;
  // รองรับรูปแบบ DD/MM/YYYY HH:mm:ss
  const datePart = str.split(' ')[0];
  const parts = datePart.split('/');
  if (parts.length === 3) {
    let d = parseInt(parts[0], 10);
    let m = parseInt(parts[1], 10) - 1;
    let y = parseInt(parts[2], 10);
    // กรณีปี พ.ศ. ให้แปลงเป็น ค.ศ.
    if (y > 2500) y -= 543;
    return new Date(y, m, d);
  }
  return new Date(str);
}

function getDashboardData(startDateStr, endDateStr) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  let start = startDateStr ? new Date(startDateStr) : null;
  let end = endDateStr ? new Date(endDateStr) : null;
  if (start) start.setHours(0,0,0,0);
  if (end) end.setHours(23,59,59,999);

  let kssSeverity = { mild: 0, moderate: 0, severe: 0 };
  let monthlyStats = {};
  let filteredHNs = new Set();
  
  const logSheet = ss.getSheetByName('LOG_WOMAC');
  if (logSheet) {
    const logData = logSheet.getDataRange().getDisplayValues();
    for (let i = 1; i < logData.length; i++) {
      const row = logData[i];
      const timestampStr = row[0]; // Timestamp
      const hn = row[1];
      const evalType = row[6] || ''; // Evaluation_Type
      const totalScoreStr = row[7] || ''; // Total_Score
      
      let dateObj = parseThaiDateStr(timestampStr);
      let isValidDate = dateObj && !isNaN(dateObj.valueOf());
      let inRange = true;

      if (isValidDate && (start || end)) {
        if (start && dateObj < start) inRange = false;
        if (end && dateObj > end) inRange = false;
      }

      if (inRange) {
        if (hn) filteredHNs.add(String(hn).trim());
        
        if (isValidDate) {
          let monthYear = dateObj.toLocaleDateString('th-TH', { month: 'short', year: 'numeric' });
          if (!monthlyStats[monthYear]) {
            monthlyStats[monthYear] = { KSS: 0, FJS: 0, OXFORD: 0, EQ5D5L: 0, WOMAC: 0 };
          }
          let t = evalType.toUpperCase();
          if (t.includes('KSS')) monthlyStats[monthYear].KSS++;
          else if (t.includes('FJS')) monthlyStats[monthYear].FJS++;
          else if (t.includes('OXFORD')) monthlyStats[monthYear].OXFORD++;
          else if (t.includes('EQ5D5L')) monthlyStats[monthYear].EQ5D5L++;
          else if (t.includes('WOMAC')) monthlyStats[monthYear].WOMAC++;
          else monthlyStats[monthYear].KSS++; // Fallback
        }
        
        // KSS Severity (Mock logic based on total score Pt)
        if (evalType.includes('KSS') && !evalType.includes('Physician')) {
          let scoreStr = totalScoreStr.split('/')[0].trim();
          let score = parseInt(scoreStr);
          if (!isNaN(score)) {
            if (score >= 120) kssSeverity.mild++;
            else if (score >= 60) kssSeverity.moderate++;
            else kssSeverity.severe++;
          }
        }
      }
    }
  }

  const sheet = ss.getSheetByName('MASTER_SUMMARY');
  let resultData = [];
  
  if (sheet) {
    const rawData = sheet.getDataRange().getDisplayValues();
    if (rawData.length > 1) {
      let hasEvalCol = false;
      for (let r = 0; r < Math.min(3, rawData.length); r++) {
        if (rawData[r][3] && rawData[r][3].includes('ผู้ประเมิน')) {
          hasEvalCol = true;
          break;
        }
      }
      
      const startIdx = hasEvalCol ? 4 : 3;
      const rows = rawData.slice(1);
      
      rows.forEach(row => {
        let hn = String(row[1]).trim();
        if (!hn || hn === 'H/N' || hn.includes('ลำดับ')) return;
        // ถ้ามีการระบุวันที่ ให้คัดกรองเฉพาะ HN ที่อยู่ในช่วงเวลานั้น
        if ((start || end) && !filteredHNs.has(hn)) return;

        let item = {
          no: row[0],
          hn: hn,
          name: row[2],
          evaluator: hasEvalCol ? (row[3] || '-') : '-',
          kssPreOp: row[startIdx] || '-',
          fjsPreOp: row[startIdx + 1] || '-',
          oxfordPreOp: row[startIdx + 2] || '-',
          eq5dPreOp: row[startIdx + 3] || '-',
          kss3mo: row[startIdx + 4] || '-',
          fjs3mo: row[startIdx + 5] || '-',
          oxford3mo: row[startIdx + 6] || '-',
          eq5d3mo: row[startIdx + 7] || '-',
          kss6mo: row[startIdx + 8] || '-',
          fjs6mo: row[startIdx + 9] || '-',
          oxford6mo: row[startIdx + 10] || '-',
          eq5d6mo: row[startIdx + 11] || '-',
          kss1yr: row[startIdx + 12] || '-',
          fjs1yr: row[startIdx + 13] || '-',
          oxford1yr: row[startIdx + 14] || '-',
          eq5d1yr: row[startIdx + 15] || '-'
        };
        resultData.push(item);
      });
    }
  }
  
  return { data: resultData, kssSeverity: kssSeverity, monthlyStats: monthlyStats };
}

function submitFjsData(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('LOG_FJS');
  if (!sheet) {
    sheet = ss.insertSheet('LOG_FJS');
    sheet.appendRow([
      'Timestamp', 'HN', 'Prefix', 'Name_Surname', 'Gender', 'Age',
      'Eval_Stage', 'Total_Score', 'Raw_Score', 'Answers_JSON'
    ]);
  }
  
  const timestamp = new Date();
  
  sheet.appendRow([
    timestamp,
    data.hn,
    data.prefix,
    data.nameSurname,
    data.gender,
    data.age,
    data.evalStage,
    data.totalScore,
    data.rawScore,
    JSON.stringify(data.rawAnswers)
  ]);
  
  // อัปเดตไปยัง MASTER_SUMMARY ด้วย
  // รูปแบบคะแนน เช่น "Pt: 90" (Patient)
  const formattedScore = `Pt: ${data.totalScore}`;
  updateMasterSummary(data.hn, data.prefix, data.nameSurname, 'FJS', data.evalStage, formattedScore, 'คนไข้');
  
  return true;
}

function submitOxfordData(payload) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('LOG_OXFORD');
  if (!sheet) {
    sheet = ss.insertSheet('LOG_OXFORD');
    sheet.appendRow([
      'Timestamp', 'HN', 'Prefix', 'Name_Surname', 'Gender', 'Age',
      'Joint_Side', 'Eval_Stage', 'Total_Score', 'Severity', 'Answers_JSON'
    ]);
    sheet.getRange("A1:K1").setFontWeight("bold").setBackground("#f3f3f3");
  }
  
  const timestamp = new Date();
  
  let severity = '-';
  const s = parseInt(payload.totalScore, 10);
  if (s >= 40) severity = 'ดีเยี่ยม (Satisfactory)';
  else if (s >= 30) severity = 'เล็กน้อย-ปานกลาง (Mild to Moderate)';
  else if (s >= 20) severity = 'ปานกลาง-รุนแรง (Moderate to Severe)';
  else severity = 'รุนแรงมาก (Severe Arthritis)';
  
  sheet.appendRow([
    timestamp,
    payload.hn,
    payload.prefix,
    payload.nameSurname,
    payload.gender,
    payload.age,
    payload.jointSide || 'ข้อเข่า',
    payload.evalStage,
    payload.totalScore,
    severity,
    JSON.stringify(payload.rawAnswers)
  ]);
  
  // บันทึกลง LOG_WOMAC เพื่อเป็น Central Activity Log รวม
  const logSheet = ss.getSheetByName('LOG_WOMAC') || ss.insertSheet('LOG_WOMAC');
  if (logSheet.getLastRow() === 0) {
    logSheet.appendRow([
      'Timestamp', 'HN', 'Prefix', 'Name_Surname', 'Gender', 'Age',
      'Evaluation_Type', 'Total_Score', 'Severity'
    ]);
  }
  logSheet.appendRow([
    timestamp,
    payload.hn,
    payload.prefix,
    payload.nameSurname,
    payload.gender,
    payload.age,
    'Oxford (' + payload.evalStage + ')',
    payload.totalScore + ' / 48',
    severity
  ]);
  
  // ส่งผลเข้าสู่ตาราง MASTER_SUMMARY คอลัมน์ Oxford
  const formattedScore = "Pt: " + payload.totalScore;
  updateMasterSummary(payload.hn, payload.prefix, payload.nameSurname, 'OXFORD', payload.evalStage, formattedScore, 'คนไข้');
  
  return true;
}

function submitEq5dData(payload) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('LOG_EQ5D5L');
  if (!sheet) {
    sheet = ss.insertSheet('LOG_EQ5D5L');
    sheet.appendRow([
      'Timestamp', 'HN', 'Prefix', 'Name_Surname', 'Gender', 'Age',
      'Eval_Stage', 'Total_Score', 'Utility_Index', 'EQ_VAS', 'Health_State', 'Answers_JSON'
    ]);
    sheet.getRange("A1:L1").setFontWeight("bold").setBackground("#f3f3f3");
  }
  
  const timestamp = new Date();
  
  sheet.appendRow([
    timestamp,
    payload.hn,
    payload.prefix,
    payload.nameSurname,
    payload.gender,
    payload.age,
    payload.evalStage,
    payload.totalScore,
    payload.utilityIndex,
    payload.eqVas,
    payload.healthState,
    JSON.stringify(payload.rawAnswers)
  ]);
  
  // บันทึกลง LOG_WOMAC เพื่อเป็น Central Activity Log รวม
  const logSheet = ss.getSheetByName('LOG_WOMAC') || ss.insertSheet('LOG_WOMAC');
  if (logSheet.getLastRow() === 0) {
    logSheet.appendRow([
      'Timestamp', 'HN', 'Prefix', 'Name_Surname', 'Gender', 'Age',
      'Evaluation_Type', 'Total_Score', 'Severity'
    ]);
  }
  logSheet.appendRow([
    timestamp,
    payload.hn,
    payload.prefix,
    payload.nameSurname,
    payload.gender,
    payload.age,
    'EQ-5D-5L (' + payload.evalStage + ')',
    'VAS: ' + payload.eqVas + ' / 100',
    'Profile: ' + payload.healthState
  ]);
  
  // ส่งผลเข้าสู่ตาราง MASTER_SUMMARY คอลัมน์ EQ5D5L
  const formattedScore = "Pt: " + payload.eqVas + " (" + payload.healthState + ")";
  updateMasterSummary(payload.hn, payload.prefix, payload.nameSurname, 'EQ5D', payload.evalStage, formattedScore, 'คนไข้');
  
  return true;
}

function getPatientHistory(hn) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let history = [];
  let targetHn = String(hn).trim();

  // 1. ดึงจาก WOMAC_DATA
  const womacSheet = ss.getSheetByName('WOMAC_DATA');
  if (womacSheet) {
    const data = womacSheet.getDataRange().getDisplayValues();
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][1]).trim() === targetHn) {
        history.push({
          type: 'WOMAC',
          timestamp: data[i][0],
          evalStage: data[i][6],
          scores: {
            'Pain (ปวด)': data[i][7] + '/20',
            'Stiffness (ฝืดตึง)': data[i][8] + '/8',
            'Function (การใช้งาน)': data[i][9] + '/68'
          },
          total: data[i][10] + '/96',
          severity: data[i][11]
        });
      }
    }
  }

  // 2. ดึงจาก KSS_PATIENT_DATA
  const kssPatSheet = ss.getSheetByName('KSS_PATIENT_DATA');
  if (kssPatSheet) {
    const data = kssPatSheet.getDataRange().getDisplayValues();
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][1]).trim() === targetHn) {
        history.push({
          type: 'KSS (คนไข้)',
          timestamp: data[i][0],
          evalStage: data[i][6],
          scores: {
            'Symptom (อาการ)': data[i][7] + '/25',
            'Satisfaction (พึงพอใจ)': data[i][8] + '/40',
            'Expectation (ความคาดหวัง)': data[i][9] + '/15',
            'Functional (การใช้งาน)': data[i][10] + '/100'
          },
          total: data[i][11] + '/180',
          severity: ''
        });
      }
    }
  }

  // 3. ดึงจาก KSS_PHYSICIAN_DATA
  const kssPhySheet = ss.getSheetByName('KSS_PHYSICIAN_DATA');
  if (kssPhySheet) {
    const data = kssPhySheet.getDataRange().getDisplayValues();
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][1]).trim() === targetHn) {
        history.push({
          type: 'KSS (แพทย์)',
          timestamp: data[i][0],
          evalStage: data[i][3],
          scores: {
            'ROM': data[i][6],
            'Flexion Contracture': data[i][7],
            'Instability (ML)': data[i][8],
            'Instability (AP)': data[i][9],
            'Alignment': data[i][10]
          },
          total: data[i][11] + '/100',
          severity: 'แพทย์ประเมิน'
        });
      }
    }
  }

  // 4. ดึงจาก LOG_FJS
  const fjsSheet = ss.getSheetByName('LOG_FJS');
  if (fjsSheet) {
    const data = fjsSheet.getDataRange().getDisplayValues();
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][1]).trim() === targetHn) {
        history.push({
          type: 'FJS-12',
          timestamp: data[i][0],
          evalStage: data[i][6],
          scores: {
            'Raw Score': data[i][8] + '/48',
            'Transformed Score': data[i][7] + '/100'
          },
          total: data[i][7] + '/100',
          severity: 'ประเมินข้อเทียม'
        });
      }
    }
  }

  // 5. ดึงจาก LOG_OXFORD
  const oxfordSheet = ss.getSheetByName('LOG_OXFORD');
  if (oxfordSheet) {
    const data = oxfordSheet.getDataRange().getDisplayValues();
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][1]).trim() === targetHn) {
        history.push({
          type: 'Oxford Score',
          timestamp: data[i][0],
          evalStage: data[i][7],
          scores: {
            'ข้อที่ประเมิน': data[i][6] || 'ข้อเข่า'
          },
          total: data[i][8] + '/48',
          severity: data[i][9] || '-'
        });
      }
    }
  }

  // 6. ดึงจาก LOG_EQ5D5L
  const eq5dSheet = ss.getSheetByName('LOG_EQ5D5L');
  if (eq5dSheet) {
    const data = eq5dSheet.getDataRange().getDisplayValues();
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][1]).trim() === targetHn) {
        history.push({
          type: 'EQ-5D-5L',
          timestamp: data[i][0],
          evalStage: data[i][6],
          scores: {
            'Health State': data[i][10] || '-',
            'Thai Utility Index': data[i][8] || '-',
            'EQ-VAS': (data[i][9] || '-') + '/100'
          },
          total: 'VAS: ' + (data[i][9] || '-') + '/100',
          severity: 'Index: ' + (data[i][8] || '-')
        });
      }
    }
  }

  // เรียงลำดับตามเวลาใหม่สุดไปเก่าสุด
  history.sort((a, b) => {
    let da = parseThaiDateStr(a.timestamp) || new Date(0);
    let db = parseThaiDateStr(b.timestamp) || new Date(0);
    return db - da;
  });

  return history;
}