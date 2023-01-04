# API Daerah Indonesia

## Installation
```
composer require davidarl/api-daerah-indonesia
```

Jalankan migrasi untuk membuat table provinsi, kabupaten, kecamatan
```
php artisan migrate
```
Mengisikan data provinsi
```
php artisan db:seed --class=DavidArl\ApiDaerah\Database\Seeders\DaerahSeeder
```
php artisan vendor:publish --provider="DavidArl\ApiDaerah\ApiDaerahServiceProvider" --tag="assets-api-daerah"

## Usage
Database seeder 
```
use DavidArl\ApiDaerah\Database\Seeders\DaerahSeeder;

class DatabaseSeeder extends Seeder
...
$this->call([
    DaerahSeeder::class
]);
```