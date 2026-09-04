# Rebirth Champions — My World Online v4

هذه النسخة جاهزة للنشر كلعبة ويب 3D Multiplayer.

## ما فيها
- عالم 3D.
- حركة لاعب.
- لاعبين متعددين في الغرفة نفسها.
- اسم لكل لاعب.
- غرف خاصة برمز.
- رابط دعوة: `https://YOUR-DOMAIN/?room=ROOMCODE`
- Coins / Gems / Power / Level / Rebirth.
- Pets.
- حفظ التقدم محليًا على جهاز اللاعب.
- Health endpoint للخادم: `/health`.

## تشغيل على الكمبيوتر
ثبّت Node.js ثم داخل المجلد:
1. `npm install`
2. `npm start`
3. افتح `http://localhost:3000`

## نشرها كرابط عام
الخادم يحتاج استضافة Node.js تدعم WebSockets.
يمكن نشره على Render كـ Web Service أو Railway. بعد النشر ستحصل على نطاق عام، وتشارك الرابط مع أصدقائك.

### Render
- اربط مستودع GitHub.
- اختر Web Service.
- Build Command: `npm install`
- Start Command: `npm start`
- Health Check: `/health`

### Railway
- Deploy من مستودع GitHub.
- Start Command: `npm start`.
- Generate Domain.

ملاحظة: إنشاء الحساب/المستودع والضغط على Deploy يحتاج أن يتم من حسابك؛ لا أستطيع تسجيل الدخول إلى حسابات خارجية بالنيابة عنك.
