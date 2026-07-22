# سعودي ترند — بوابة الأنظمة

صفحة هبوط داخلية بأربع بوابات:

- المطاعم → `sulalah-menu.../platform`
- العيادات → `dental-saas`
- النوادي → `gym-saas`
- الأبحاث → `data-collections`

## Deploy standalone

```bash
cd hub
npm install
# copy public assets into dist first if needed
npx wrangler deploy
```

Currently also published via dental-saas at `/hub/`.
