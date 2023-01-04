<?php

namespace DavidArl\ApiDaerah\Database\Seeders;

use DavidArl\ApiDaerah\Models\Kabupaten;
use DavidArl\ApiDaerah\Models\Kecamatan;
use DavidArl\ApiDaerah\Models\Provinsi;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class DaerahSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        echo "\n Inserting Data Lokasi Indonesia";
        
        $data_provinsi = $this->_getJson('provinsi');
        $total = count($data_provinsi);
        Provinsi::insert($data_provinsi);
        echo "\n Success.... Provinsi ({$total})";

        $data_kabupaten = $this->_getJson('kabupaten');
        $total = count($data_kabupaten);
        Kabupaten::insert($data_kabupaten);
        echo "\n Success.... Kabupaten ({$total})";

        $data_kecamatan = $this->_getJson('kecamatan');
        $total = count($data_kecamatan);
        Kecamatan::insert($data_kecamatan);
        echo "\n Success.... Kecamatan ({$total})\n\n";
    }

    private function _getJson(string $filename): array
    {
        $path = __DIR__."/../json/{$filename}.json";
        $data = File::get($path);
        return json_decode($data, true);
    }
}
