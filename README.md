# 🏥 Dental SaaS - Magic Solutions

نظام كامل لإدارة عيادات الأسنان بتصميم طبي احترافي

## ✨ المميزات الجديدة (v2.0):

- 🎨 **تصميم طبي عصري** - ألوان أبيض/أزرق/فيروزي
- 🔴 **Realtime Updates** - تحديثات لحظية في كل الصفحات
- 📸 **رفع الصور** - لوجو العيادة + صور الأطباء + الأشعة (عبر Supabase Storage)
- 🔔 **إشعارات داخل النظام** - عند الحجز/التأكيد/الإلغاء
- 💎 **Glassmorphism + Animations** ساحرة

## 🗄️ قاعدة البيانات (مشتركة مع نظام الجيمات)

المشروع متصل بـ Supabase:
`https://khzrapojrkhxjsjgnflr.supabase.co`

جداول العيادات موجودة جنب جداول الجيم **بدون تعديل جداول الجيم**.

لتفعيل أعمدة/جداول العيادات الناقصة (مرة واحدة فقط):

1. افتح [Supabase SQL Editor](https://supabase.com/dashboard/project/khzrapojrkhxjsjgnflr/sql)
2. الصق محتوى الملف `supabase/dental_compat.sql`
3. اضغط **Run**

الملف آمن: يستخدم `IF NOT EXISTS` فقط ولا يلمس جداول الجيم.

## 🚀 التشغيل

```bash
npm install
npm run dev
```

## 📦 Build / Deploy

```bash
npm run build
npm run deploy
```

## 🔑 بيانات الدخول

| النوع | اسم المستخدم | كلمة المرور |
|------|--------------|-------------|
| 👑 المالك | `owner` | `owner123` |
| ⚙️ الأدمن | `admin` | `admin123` |
| 👨‍⚕️ الدكتور | `doctor` | `123456` |
| 👤 المريض | `0501234567` | `123456` |

عيادة تجريبية جاهزة: `/smile-clinic`
