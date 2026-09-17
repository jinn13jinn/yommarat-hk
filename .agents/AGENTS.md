# Workspace Rules & Guidelines

## Language Requirements for Assessments
1. **Physician / Staff Forms**: All questions, options, descriptions, and UI controls intended for medical staff or physicians (such as the Objective Knee Indicators) must be written entirely in **English**.
2. **Patient Forms**: All questions, options, instructions, help texts, descriptions, and UI controls intended for patient self-assessment (such as WOMAC, OKS, and KSS PROM sections) must be written entirely in **Thai**.

## Code Deployment and Planning Rules
1. **No Unauthorized Deployments**: Absolutely **DO NOT** run `clasp push` or deploy code to production unless the user explicitly requests/authorizes code deployment (e.g., "กรุณานำโค้ดขึ้น" or similar command) OR explicitly approves an implementation plan.
2. **Mandatory Planning Step**: Always present a detailed implementation plan explaining proposed code changes and database structures, and obtain user approval BEFORE writing any code or making file modifications.
3. **Mandatory Version Update**: ทุกครั้งที่มีการแก้ไขหรืออัปเดตโค้ด จะต้องไปเปลี่ยนเลข Version และวัน-เวลาที่อัปเดตล่าสุดที่ไฟล์ `Index.html` บริเวณส่วนท้ายของหน้า (Footer) เสมอ เพื่อให้ทราบว่าระบบมีการอัปเดตแล้ว
4. **Auto-Deployment and Summary on Plan Approval**: เมื่อผู้ใช้อนุมัติ Implementation Plan ให้ดำเนินการแก้โค้ด และเมื่อเสร็จสิ้นให้ทำการอัปโหลดขึ้น GAS อัตโนมัติ (เป็น Version ใหม่แต่ใช้ Link เดิม) และหลังจากเสร็จสิ้นกระบวนการทั้งหมด ต้องสรุปให้ผู้ใช้ทราบเสมอว่ามีการแก้ไขอะไรไปบ้าง และมีส่วนไหนที่ได้รับผลกระทบจากการแก้ไขนั้นบ้าง

## UI/UX Rules
1. **Loading Indicators**: Always display a loading overlay/pop-up (e.g., "กำลังโหลดข้อมูล...") when navigating between major pages (like returning to the main menu) or when executing long-running processes (saving data, fetching configuration) to improve user experience.
