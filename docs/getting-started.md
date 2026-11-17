# Getting started

## Prerequisites
PHP 8.3+ (extensions: mbstring, intl, bcmath, pdo_sqlite), Composer 2, Node 22+.

## Install
```bash
git clone https://github.com/robotjaol/open-laravel.git my-app && cd my-app
composer install && npm install
cp .env.example .env && php artisan key:generate
touch database/database.sqlite
php artisan migrate --seed
composer dev
```
Open http://localhost:8000. Local seed account (from `.env.example`, **development only**): `admin@example.com` / `ChangeMe-Local-Only-123!`. In non-production the seeder also creates demo users (`admin@`, `manager@`, `viewer@demo.test`, password `Password-12345!`) and 12 projects.

## Just want to look at the UI?
```bash
npm install && npm run build:preview   # outputs docs/preview
python3 -m http.server 4173 -d docs/preview   # then open http://localhost:4173
```
The preview needs no PHP or database. It uses sample data and does not save changes.

## Docker
```bash
cp .env.example .env   # set APP_KEY, DB_PASSWORD
docker compose up --build
```

## Make it yours
1. Rename the app: `APP_NAME` in `.env`, brand in `resources/js/components/app/brand.tsx`.
2. Remove the example `Projects` module if you do not need it: delete `app/Modules/Projects`, `resources/js/pages/projects`, `resources/js/components/forms/project-form.tsx`, the nav entry in `resources/js/lib/navigation.ts`, and the factory.
3. Add your first module: [module guide](module-guide.md).
