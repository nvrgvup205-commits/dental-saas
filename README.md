# 🦷 Dental SaaS - نظام إدارة عيادات الأسنان

نظام كامل لإدارة عيادات الأسنان (SaaS) — مبني بـ React + Vite + Tailwind + Supabase

## 🌟 المميزات

- 👤 **بوابة المريض** (`/`): تسجيل، حجز، إلغاء، شكاوى
- ⚙️ **بوابة الموظفين** (`/staff`): أدمن + دكتور
- 👑 **بوابة المالك** (`/owner`): إدارة العيادات

## 🔑 بيانات الدخول التجريبية

| النوع | الحساب |
|------|--------|
| 👑 مالك | `owner` / `owner123` |
| ⚙️ أدمن | `admin` / `admin123` |
| 👨‍⚕️ دكتور | `doctor` / `123456` |
| 👤 مريض | `0501234567` / `123456` |

## 🚀 التشغيل المحلي

```bash
npm install
npm run dev
```

## 📦 Build للنشر

```bash
npm run build
npm run start
```

## 🚂 النشر على Railway

المشروع جاهز للنشر على Railway مباشرة:
1. اربط Repo من GitHub
2. Railway هيكتشف Node تلقائياً
3. هيستخدم `nixpacks.toml` للبناء
4. اعمل Generate Domain من Settings

## 🛠️ التقنيات

- React 18 + Vite
- Tailwind CSS 3
- React Router 6
- Supabase (Auth + DB)
- Lucide React Icons
