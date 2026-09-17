# ตาราง `APP_CONFIG` (การตั้งค่าหน้าหลักและการ์ดแบบประเมิน)

- **วัตถุประสงค์:** จัดเก็บข้อมูลแบบประเมินต่างๆ เพื่อนำไปแสดงผลบนหน้า Hub (`Index.html`) แบบ Dynamic แยกหมวดหมู่ PATIENT และ STAFF
- **ฟังก์ชันที่เรียกใช้:** `getAppConfigData()` ใน `รหัส.js`

| module_id | title | subtitle | description | tag_score | tag_qty | tag_joint | theme_color | qr_drive_id | action_link | is_active | user_type |
|---|---|---|---|---|---|---|---|---|---|---|---|
| womac | แบบประเมินอาการข้อสะโพก | WOMAC | Chaophraya Yommarat Hospital | 0-96 คะแนน | 24 คำถาม | เข่า + สะโพก | #2e7d32 | 1lnRR1OLi86xkXIL1CR4tNMg4NY43-ULA | https://script.google.com/macros/s/AKfycbzIjgtVWAcpKvcHI8P_IQ-vrFeoNubGy5WtWBaBUZMRXPfRe3ahRhcuGTk3_Kq6knJg9w/exec?page=womac | TRUE | PATIENT |
| kss_pre | แบบประเมินข้อเข่า KSS ก่อน-หลังผ่าตัด | KSS Pre-Post Op (สำหรับผู้ป่วย) | แบบประเมินสมรรถภาพและการใช้งานข้อเข่าสำหรับผู้ป่วย ก่อน-หลัง ผ่าตัด | 0-180 คะแนน | คำถาม 4 หมวด | ข้อเข่า | #e65100 | 1IwifrbPwxQ4rDMSI9PduQ0lE1Ls9sbSG | https://script.google.com/macros/s/AKfycbzIjgtVWAcpKvcHI8P_IQ-vrFeoNubGy5WtWBaBUZMRXPfRe3ahRhcuGTk3_Kq6knJg9w/exec?page=kss_patient | TRUE | PATIENT |
| kss_physician | บันทึกข้อมูลข้อเข่าทางคลินิก (สำหรับแพทย์) | KSS Objective Indicators | ระบบบันทึกผลมุมการงอเข่า ความมั่นคง และความโก่งเกของเข่าผู้ป่วย | คะแนนเต็ม 100 | สำหรับแพทย์ | ข้อเข่า | #b91c1c | 1w9nDnZEyAugJIEkxviwdmBW00PVArBsn | https://script.google.com/macros/s/AKfycbzIjgtVWAcpKvcHI8P_IQ-vrFeoNubGy5WtWBaBUZMRXPfRe3ahRhcuGTk3_Kq6knJg9w/exec?page=kss_physician | TRUE | STAFF |
| fjs | แบบประเมิน Forgotten Joint Score | FJS-12 | ประเมินความรู้สึกรับรู้ข้อเทียม | 0-100 คะแนน | 12 คำถาม | ข้อเข่า / ข้อสะโพก | #0288d1 | 1e5bSMrw-5fIAUs2jYA_Tn3hE6tH94tgz | https://script.google.com/macros/s/AKfycbzIjgtVWAcpKvcHI8P_IQ-vrFeoNubGy5WtWBaBUZMRXPfRe3ahRhcuGTk3_Kq6knJg9w/exec?page=fjs | TRUE | PATIENT |
