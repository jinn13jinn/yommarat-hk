# 📋 แผนผังการดำเนินงานและสถานะโครงการ (Project To-Do & Progress Tracker)
**ระบบประเมินผลลัพธ์การผ่าตัดเปลี่ยนข้อเทียม (Arthroplasty Score System) - รพ.เจ้าพระยายมราช**

อ้างอิงตาม **Matrix Blueprint ของตาราง `MASTER_SUMMARY`**:
- **4 ช่วงเวลา:** ก่อนผ่าตัด (Pre-Op), หลังผ่าตัด 3 เดือน, หลังผ่าตัด 6 เดือน, หลังผ่าตัด 1 ปี
- **4 เครื่องมือ:** KSS, FJS, Oxford Score, EQ-5D-5L (+ WOMAC เดิม)
- **ผู้ประเมิน:** คนไข้ (Patient) ประเมินครบทั้ง 4 เครื่องมือ / แพทย์ (Physician) ประเมินเฉพาะ KSS

---

## 📊 1. ตารางตรวจสอบสถานะเครื่องมือประเมิน (Assessment Status Matrix)

| เครื่องมือประเมิน | ผู้ประเมิน | Pre-Op | 3 เดือน | 6 เดือน | 1 ปี | ฟอร์มหน้าเว็บ (Frontend) | API หลังบ้าน (Backend) | ตารางเก็บข้อมูล (Sheet) | ลง MASTER_SUMMARY |
|---|---|:---:|:---:|:---:|:---:|---|---|---|:---:|
| **KSS** (Patient PROM) | คนไข้ | ✅ | ✅ | ✅ | ✅ | `KssPatient.html` (พร้อมใช้งาน) | `submitKssPatientData` | `KSS_PATIENT_DATA` | ✅ Pt: [คะแนน] |
| **KSS** (Objective) | แพทย์ | ✅ | ✅ | ✅ | ✅ | `KssPhysician.html` (พร้อมใช้งาน) | `submitKssPhysicianData` | `KSS_PHYSICIAN_DATA` | ✅ MD: [คะแนน] |
| **FJS** (Forgotten Joint) | คนไข้ | ✅ | ✅ | ✅ | ✅ | `FjsPatient.html` (พร้อมใช้งาน) | `submitFjsData` (สมบูรณ์) | `LOG_FJS` | ✅ Pt: [คะแนน] |
| **Oxford Score** | คนไข้ | ✅ | ✅ | ✅ | ✅ | `OxfordPatient.html` (พร้อมใช้งาน) | `submitOxfordData` (สมบูรณ์) | `LOG_OXFORD` | ✅ Pt: [คะแนน] |
| **EQ-5D-5L** | คนไข้ | ✅ | ✅ | ✅ | ✅ | `Eq5dPatient.html` (พร้อมใช้งาน) | `submitEq5dData` (สมบูรณ์) | `LOG_EQ5D5L` | ✅ Pt: [คะแนน] |
| *(WOMAC เดิม)* | คนไข้ | - | - | - | - | `Womac.html` (พร้อมใช้งาน) | `submitWomacData` | `WOMAC_DATA` | - |

---

## 📝 2. รายการสิ่งที่ต้องทำ (To-Do Action Items)

### Phase 1: การจัดการและปรับโครงสร้างหลัก (Core Alignment)
- [x] จัดระเบียบไฟล์เอกสาร Markdown สู่ `docs/` และคุมกฎ Master Blueprint ด้วย `GEMINI.md`
- [x] ปรับโครงสร้างฟังก์ชัน `updateMasterSummary` ใน `รหัส.js` ให้ตรงกับ Column จริงใน Google Sheets (เพิ่ม/ปรับตำแหน่งตามตารางของนายท่าน 20 คอลัมน์ + เสริม Concurrency Lock)
- [x] อัปเดตรายการแบบประเมินในชีต `APP_CONFIG` ครบทั้ง 4 รายการหลัก (WOMAC, KSS ผู้ป่วย, KSS แพทย์, FJS) แยกหมวด PATIENT และ STAFF สวยงาม

### Phase 2: ตรวจสอบและทำให้ FJS สมบูรณ์ (FJS Module Completion)
- [x] ตรวจสอบความถูกต้องของหน้า `FjsPatient.html` (ฟิลด์ HN, ชื่อ-สกุล, เพศ, อายุ, ช่วงเวลา Eval Stage 4 ช่วงเวลา)
- [x] ตรวจสอบสูตรการคำนวณคะแนน FJS (12 ข้อ แปลงเป็น 0-100 คะแนน)
- [x] ปรับแก้ `submitFjsData` ให้ส่งคะแนนเข้า `MASTER_SUMMARY` ตรงคอลัมน์ของ FJS ในแต่ละช่วงเวลาอย่างถูกต้อง

### Phase 3: พัฒนาแบบประเมิน Oxford Knee/Hip Score
- [x] ออกแบบและสร้างหน้าฟอร์มคนไข้ `OxfordPatient.html` (ภาษาไทยตามมาตรฐาน Patient Forms 12 ข้อ 0-48 คะแนน)
- [x] สร้าง API `submitOxfordData` ใน `รหัส.js` พร้อมคำนวณ Severity และบันทึกลงชีตกลาง
- [x] เชื่อมโยงข้อมูลลงตาราง `LOG_OXFORD` และอัปเดตเข้า `MASTER_SUMMARY` (คอลัมน์ Oxford ทั้ง 4 ช่วงเวลา)

### Phase 4: ยกระดับ UI/UX และระบบแจ้งเตือน SweetAlert2 ทั่วทั้งระบบ (UI/UX Modernization)
- [x] ยกเลิก Browser Dialogs (`alert()` / `confirm()`) เดิมทั้งหมด แทนที่ด้วย **SweetAlert2** ทั่วทั้งระบบ
- [x] ปรับโฉมหน้าประเมินแพทย์ `KssPhysician.html` ให้กว้างขวาง (1240px) ธีม Executive Clinical Slate / Sky Blue พร้อมปุ่ม Pill Tabs และ Search & Date Filter ด่วน
- [x] ยกระดับการ์ดคนไข้ใน `KssPhysician.html` ให้มี Circular Avatar, HN Badge สีฟ้าพาสเทล `#0284c7`, Stage Pill Badge มน
- [x] เพิ่มปุ่มสลับมุมมอง **🎴 การ์ด / 📋 ตาราง (Table View Switcher)** พร้อมตัวเลือก Page Size (10, 15, 25, 50, 100) และตาราง DataTables ตามมาตรฐาน Master Blueprint
- [x] ยกระดับ `KssPatient.html` หมวด D4 จากตารางแข็งๆ เป็น **Interactive Activity Assessment Cards** พร้อม Capsule Scale (0-5) ขนาดใหญ่แตะง่ายบนมือถือ
- [x] เสริม SweetAlert2 แบบ Confirm Modal ถามยืนยันกรณีแพทย์เลือกประเมินผู้ป่วยที่เคยประเมินในระยะนั้นแล้ว
- [x] อัปเกรดฟอร์มคนไข้ทุกหน้า (`OxfordPatient.html`, `FjsPatient.html`, `KssPatient.html`, `Womac.html`) ให้รองรับ SweetAlert2 และมี Rich Loading Overlay
- [x] ปรับหมายเลขเวอร์ชันใน `Index.html` เป็น `Version 1.2.0 (Build 2026.09.16)`
- [x] Deploy ขึ้น Google Apps Script สำเร็จทับ Deployment ID เดิม (`@43`)

### Phase 5: พัฒนาแบบประเมิน EQ-5D-5L
- [x] ออกแบบและสร้างหน้าฟอร์มคนไข้ `Eq5dPatient.html` (แบบวัดคุณภาพชีวิต 5 มิติ + VAS Scale 0-100)
- [x] สร้าง API `submitEq5dData` ใน `รหัส.js` คำนวณ Thai Utility Index และจัดเก็บ Log ละเอียด
- [x] เชื่อมโยงข้อมูลลงตาราง `LOG_EQ5D5L` และอัปเดตเข้า `MASTER_SUMMARY` (คอลัมน์ EQ5D5L)
- [x] ปรับเวอร์ชันเป็น `Version 1.3.0 (Build 2026.09.16)` และเพิ่ม Icon ใน `Index.html`

### Phase 6: พัฒนาและปรับปรุงแดชบอร์ดสรุปผล (Master Summary Dashboard)
- [x] ปรับปรุงหน้า `Dashboard.html` ให้รองรับการแสดงผลตาราง Matrix 4 ช่วงเวลา พร้อม Micro Badges สวยงามตามมาตรฐาน Master Blueprint
- [x] เพิ่มระบบค้นหาด่วนตาม HN หรือชื่อผู้ป่วย (Instant Search-as-you-type) และตัวเลือกจำนวนแถวต่อหน้า (10, 25, 50, 100 แถว)
- [x] เพิ่ม Hero Stats Cards สรุปตัวเลขสำคัญ (ผู้ป่วยทั้งหมด, การประเมินสะสม, อัตราติดตามผลหลังผ่าตัด)
- [x] เชื่อมโยงข้อมูลประวัติ EQ-5D-5L ในระบบหลังบ้าน `getPatientHistory` ให้แสดงผลครบทั้ง 5 เครื่องมือพร้อมส่งออก PDF
- [x] ปรับหมายเลขเวอร์ชันเป็น `Version 1.4.0 (Build 2026.09.17)`
- [x] Deploy ขึ้น Google Apps Script สำเร็จทับ Deployment ID เดิม (`@45`)
