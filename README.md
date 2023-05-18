
# API Daerah Indonesia - Laravel

Ini adalah package laravel yang lengkap untuk mambantu mambuat layanan RestAPI nama daerah di Indonesia. Meskipun sebenarnya mudah membuat layanan api yang menyediakan nama daerah seperti ini tapi itu cukup ribet dan males, maka ini cocok untuk anda yang MALAS :)

Sudah dilengkapi migration dan seeder, plus Client API nya untuk mempermudah penggunaan api di case input select

> Suport Laravel 8.* - latest
> PHP 7.1/8.*

 - [Instalasi](#instalasi)
 - [API Endpoint](#api-endpoint)
 - Implementasi
	 - [Database seeder](#database-seeder)
	 - [Models](#models)
 - [Api Client](#api-client)

## Instalasi
install package dengan composer
```
composer require davidarl/api-daerah-indonesia
```

Jalankan migrasi untuk membuat table provinsi, kabupaten, kecamatan
```
php artisan migrate
```

Membuat data provinsi, kabupaten, kecamatan

```
php artisan db:seed --class=DavidArl\ApiDaerah\Database\Seeders\DaerahSeeder

// or on gitbash
php artisan db:seed --class=DavidArl\\ApiDaerah\\Database\\Seeders\\DaerahSeeder
```

## API Endpoint
- Provinsi `GET: /api/provinsi`
- Kabupaten `GET: /api/kabupaten/{provinsi_id}`
- Kecamatan `GET: /api/kecamatan/{kabupaten_id}`
  

## Implementasi

### Database seeder
kamu bisa memanggil class DaerahSeeder di DatabaseSeeder
```php
use DavidArl\ApiDaerah\Database\Seeders\DaerahSeeder;


class DatabaseSeeder extends Seeder

...

$this->call([
	DaerahSeeder::class
]);
```

### Models
Misal kamu ingin custom model pada Model Provinsi
```php
<?php

namespace App\Models;

DavidArl\ApiDaerah\Models\Provinsi as ModelProvinsi;

class Provinsi extends ModelProvinsi
{
	// Your Code ...
}
```

## Api Client
Ini bisa digunakan untuk request ke api nya atau membuat input select berfungsi

publish dulu script nya jika ingin menggunakan secara local
```
php artisan vendor:publish --provider="DavidArl\ApiDaerah\ApiDaerahServiceProvider" --tag="assets-api-daerah"
```
akan muncul 2 script `api-daerah.js` dan `api-daerah.min.js` pada directory `/public/api-daerah/js`.


### Usage / Cara Penggunaan
jangan lupa panggil script nya dulu.
```html
<!-- Local - pilih salah satu -->
<script src="{{ url('/api-daerah/js/api-daerah.js') }}"></script>
<script src="{{ url('/api-daerah/js/api-daerah.min.js') }}"></script>

... Atau ...

<!-- CDN - pilih salah satu -->
<script src="https://cdn.jsdelivr.net/gh/davidaprilio/laravel-api-daerah@1.0.4/resources/js/api-daerah.js" integrity="sha256-KeGOK3pTjMh17s/n1Z12Y6omGBHdNHvVZNo+tEXEoqE=" crossorigin="anonymous"></script>

<script src="https://cdn.jsdelivr.net/gh/davidaprilio/laravel-api-daerah@1.0.4/resources/js/api-daerah.min.js" integrity="sha256-jC/ka/iUEGk62hbbt6ag1xB317rnFw8THraxuioY/98=" crossorigin="anonymous"></script>

```


#### Basic Usage
cukup sediakan element select dengan id default lalu panggil class `ApiDaerah()` maka akan langsung berfungsi
```html
<select id="provinsi-select"></select>
<select id="kabupaten-select"></select>
<select id="kecamatan-select"></select>

...

<script>
	const apiDaerah = new ApiDaerah()
</script>
```
kamu bisa custom id nya
```html
<select id="provinsi-custom"></select>
<select id="kabupaten-custom"></select>
<select id="kecamatan-custom"></select>

...

<script>
	const apiDaerah = new ApiDaerah({
		idProvinsi: 'provinsi-custom',
		idKabupaten: 'kabupaten-custom',
		idKecamatan: 'kecamatan-custom'
	})
</script>
```
set value saat pertama render (on load):
 ```html
<select id="provinsi-select" value="JAWA TIMUR"></select>
<select id="kabupaten-select" value="SURABAYA"></select>
<select id="kecamatan-select" value="TAMBAKSARI"></select>

...

<script>
	const apiDaerah = new ApiDaerah({
		supportSelectValue: true, // untuk mengambil data dari attr value select
		provinsi:  {
			value: 'name', // key dari data json
		},
		kabupaten:  {
			value: 'name',
		},
		kecamatan:  {
			value: 'name',
		},
	})
</script>
 ```


Masih ada lagi configurasinya? ada dong ini config lengkap nya dengan default value-nya juga
```javascript
new ApiDaerah({
	baseUrl: window.location.origin, // base_url yang dari API
	event: true, // jika diaktifkan maka akan memberikan event pada select dan select akan berfungsi
	placeholder: true, // jika diaktifkan akan memberikan text placeholder pada select sebelum select dipilih, text dapat di custom pada attribute 'placeholder' pada masing-masing element select		
	supportSelectValue: false, // jika diaktifkan akan mengambil attribute 'value' pada masing-masing select dan akan di atur sebagai nilai selected saat baru di load
	provinsi:  {
		id: null, // sama seperti 'idProvinsi' atau alias dari property 'idProvinsi'
		value: 'id', // value pada option, bisa diisi apapun key name dari json api
		text: 'name', // text pada option, bisa diisi apapun key name dari json api
		selected: null, // alih-alih mengatur dari attribute value untuk memberikan opsi yang terseleksi kamu juga bisa mengatur nilai value dari sini
		endpoint: '/api/provinsi', // custom endpoint
	},
	kabupaten:  {
		id: null,
		value: 'id',
		text: 'name',
		selected: null,
		endpoint: '/api/kabupaten/:id', // :id wajib diisi jika mau custom
	},
	kecamatan:  {
		id: null,
		value: 'id',
		text: 'name',
		selected: null,
		endpoint: '/api/kecamatan/:id',
	},
	enabled: {
		kabupaten: true, // mematikan fungsi select saat di set ke false
		kecamatan: true
	}
})
```

#### Method yang tersedia
```javascript
const apiDaerah = new ApiDaerah()

// Mendapatkan data
apiDaerah.getProvinsi()
apiDaerah.getKabupaten(provinsiID)
apiDaerah.getKecamatan(kabupatenID)
/* contoh data kabupaten
[
	{
		id: 31, 
		name: 'JAKARTA',
		full_name: 'JAKARTA PUSAT'
	}
]
*/

// merender option select
// selected: 'JAKARTA', sesuai nilai value pada option yang dirender
apiDaerah.renderProvinsi(selected)
apiDaerah.renderKabupaten(provinsiID, selected)
apiDaerah.renderKecamatan(kabupatenID, selected)

// mendapatkan element select
apiDaerah.getSelectProvinsiElement()
apiDaerah.getSelectKabupatenElement()
apiDaerah.getSelectKecamatanElement()

// mendapatkan data id dari option yang dipilih
apiDaerah.getSelectedProvinsiID()
apiDaerah.getSelectedKecamatanID()
apiDaerah.getSelectedKabupatenID()

// mumbuat placholder option
apiDaerah.makePlaceholder(elementSelect, customText = null, disabled = true)
// merender semua select dengan configurasi yang telah diberikan
apiDaerah.renderAllSelect()
// memberikan true akan merender initial value juga 
apiDaerah.renderAllSelect(true)
```

Contoh Jika ingin membuat metode select sendiri 

```javascript
const apiDaerah = new ApiDaerah({event: false})

apiDaerah.makePlaceholder(apiDaerah.getSelectProvinsiElement(), 'Memuat Provinsi')
apiDaerah.makePlaceholder(apiDaerah.getSelectKabupatenElement())
apiDaerah.makePlaceholder(apiDaerah.getSelectKecamatanElement())
apiDaerah.renderProvinsi()

apiDaerah.elProvinsi.addEventListener('change', function()  {
	const ProvinsiID = apiDaerah.getSelectedProvinsiID()
	apiDaerah.makePlaceholder(apiDaerah.elKabupaten, 'Memuat Kabupaten')
	apiDaerah.renderKabupaten(ProvinsiID)
	apiDaerah.makePlaceholder(apiDaerah.elKecamatan)
})

apiDaerah.renderProvinsi().elKabupaten.addEventListener('change', function()  {
	apiDaerah.makePlaceholder(apiDaerah.elKecamatan, 'Memuat Kecamatan')
	const KabupatenID  = apiDaerah.getSelectedKabupatenID()
	apiDaerah.renderKecamatan(KabupatenID)
})
```
