# ข้อกำหนดและเป้าหมายระบบ (System Specification & Project Goal)
**ระบบประเมินผลลัพธ์การผ่าตัดเปลี่ยนข้อเทียม (Arthroplasty Score System) - โรงพยาบาลเจ้าพระยายมราช**

---

## 1. เป้าหมายโครงการ (Project Overview & Goal)

### เป้าหมายหลัก (Core Mission)
สร้างฐานข้อมูลสรุปผลการรักษาผู้ป่วย (Master Analysis Data) แบบรวมศูนย์ เพื่อติดตามผลลัพธ์ของผู้ป่วยแต่ละราย (ติดตามตาม HN และ ชื่อ-สกุล) อย่างต่อเนื่องใน 4 ช่วงเวลาสำคัญของการรักษา:
1. **ก่อนผ่าตัด (Pre-Op)**
2. **หลังผ่าตัด 3 เดือน (Post-Op 3 Months)**
3. **หลังผ่าตัด 6 เดือน (Post-Op 6 Months)**
4. **หลังผ่าตัด 1 ปี (Post-Op 1 Year)**

โดยในแต่ละช่วงเวลา จะต้องรวบรวมคะแนนจากเครื่องมือประเมินผล 4 มาตรฐาน ได้แก่:
- **KSS (Knee Society Score)**
- **FJS (Forgotten Joint Score)**
- **Oxford Knee/Hip Score**
- **EQ-5D-5L**
(รวมถึงแบบประเมินเดิม **WOMAC Score**) มาแสดงผลในบรรทัดเดียวกัน เพื่อให้แพทย์และนักวิจัยสามารถเปรียบเทียบพัฒนาการและคุณภาพชีวิตของผู้ป่วยได้อย่างชัดเจนแบบรอบด้าน

### แผนงานการพัฒนา (Roadmap)
- [x] **KSS (Knee Society Score)**: พัฒนาเสร็จสิ้น ทั้งในส่วนของคนไข้ (`KssPatient.html`) และแพทย์ (`KssPhysician.html`) และเชื่อมข้อมูลลงตารางหลักแล้ว
- [ ] **FJS (Forgotten Joint Score)**: เตรียมหน้าฟอร์ม Frontend (`FjsPatient.html`) แล้ว อยู่ระหว่างตรวจสอบและแก้ไขการส่งข้อมูลเข้าตารางรวมให้สมบูรณ์
- [ ] **Oxford Score**: สร้างแบบประเมินและเชื่อมโยงฐานข้อมูล
- [ ] **EQ-5D-5L**: สร้างแบบประเมินและเชื่อมโยงฐานข้อมูล
- [ ] **Data Consolidation**: ปรับปรุงสูตรหรือโค้ดใน Backend (`รหัส.js`) เพื่อให้ข้อมูลทั้งหมดจากทุกแบบประเมิน ถูกรวมเข้าสู่ตาราง `MASTER_SUMMARY` ได้อย่างถูกต้อง

---

## 2. สถาปัตยกรรมทางเทคนิค (Technical Architecture)

- **แพลตฟอร์ม:** Google Apps Script (GAS)
- **Backend API & Server:** `รหัส.js` จัดการ Routing, API Endpoints, และการคำนวณผล
- **Frontend Client:** HTML5, Vanilla CSS / Bootstrap 5, Modern JavaScript
- **ฐานข้อมูล:** Google Sheets (ทำหน้าที่เป็น Relational Database Wrapper)
- **Script ID:** `19GnYnq4plH8q_bHvqhT9aiyoBKZRft1hB2O47A_Yxn91eQEDJwJ18fNL`

---

## 3. มาตรฐานภาษาของแบบประเมิน (Language Requirements)
1. **แบบประเมินสำหรับแพทย์ / เจ้าหน้าที่ (Physician / Staff Forms):** เช่น Objective Knee Indicators ใน KSS ต้องใช้ภาษาอังกฤษ (**English**) ทั้งหมด
2. **แบบประเมินสำหรับผู้ป่วย (Patient Forms):** เช่น WOMAC, FJS, KSS PROM ต้องใช้ภาษาไทย (**Thai**) ทั้งหมด เพื่อให้ผู้ป่วยเข้าใจง่าย ชัดเจน และทำแบบประเมินได้ด้วยตนเอง

---

## 4. โครงสร้างและการเข้าถึงระบบ (Security & Access Control)

### A. Patient Flow (Public Access)
- **หน้าหลัก:** `Index.html` (Main Hub) และหน้าแบบฟอร์มคนไข้ เช่น `Womac.html`, `KssPatient.html`, `FjsPatient.html`
- **การเข้าถึง:** สาธารณะ (Public) ไม่ต้องล็อกอิน เพื่อความสะดวกสูงสุดของผู้ป่วยในการสแกน QR Code เข้าทำแบบประเมิน

### B. Staff Flow (Secure Access)
- **การยืนยันตัวตน:** เข้าใช้งานผ่าน Popup Modal บนหน้า `Index.html` ด้วย **Passcode ตัวเลข 6 หลัก** (ตรวจสอบกับชีต `STAFF_ACCOUNTS`)
- **เงื่อนไข:** `Is_Active` ต้องเป็น `TRUE` เท่านั้น
- **Audit Trail:** เมื่อรหัสผ่านถูกต้อง ระบบจะส่งต่อข้อมูล `Staff_Email` เข้าสู่หน้าแบบประเมินสำหรับแพทย์ เพื่อบันทึกประวัติผู้ประเมิน

---

## 5. การจัดเก็บข้อมูลและ Schema ของชีต (Database Schemas)
เอกสารและตัวอย่างข้อมูลของตารางแต่ละชีตใน Google Sheets ถูกจัดเก็บแยกไว้ที่:
- [`APP_CONFIG`](./database_schemas/APP_CONFIG.md) : รายการแบบประเมินบนหน้าหลัก การตั้งค่า QR Code และสีประจำการประเมิน
- [`WOMAC_DATA`](./database_schemas/WOMAC_DATA.md) : ประวัติการทำแบบประเมิน WOMAC
- [`LOG_WOMAC`](./database_schemas/LOG_WOMAC.md) : บันทึกสรุปประวัติแบบประเมิน WOMAC
- [`STAFF_ACCOUNTS`](./database_schemas/STAFF_ACCOUNTS.md) : รายชื่อและรหัสผ่านบุคลากรทางการแพทย์
