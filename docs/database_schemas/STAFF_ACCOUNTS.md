# ตาราง `STAFF_ACCOUNTS` (บัญชีและสิทธิ์การเข้าใช้งานของบุคลากร)

- **วัตถุประสงค์:** จัดการสิทธิ์และรหัสผ่าน Passcode 6 หลักสำหรับบุคลากรทางการแพทย์ในการเข้าสู่ระบบประเมินฝั่งแพทย์ (Physician View)
- **ฟังก์ชันที่เรียกใช้:** `verifyStaffPasscode(passcode)` ใน `รหัส.js`

| Staff_Name  | Staff_Email      | Passcode  | Is_Active  |
|-------------|------------------|-----------|------------|
| Admin1      | admin1@gmail.com | 159357    | TRUE       |
| Admin2      | admin2@gmail.com | 456258    | TRUE       |
| Admin3      | admin3@gmail.com | 147258    | FALSE      |
