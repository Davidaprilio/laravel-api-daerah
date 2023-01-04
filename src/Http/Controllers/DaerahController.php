<?php

namespace DavidArl\ApiDaerah\Http\Controllers;

use Illuminate\Routing\Controller;
use DavidArl\ApiDaerah\Models\Kabupaten;
use DavidArl\ApiDaerah\Models\Kecamatan;
use DavidArl\ApiDaerah\Models\Provinsi;
use Illuminate\Http\Request;

class DaerahController extends Controller
{
    public function provinsi(Request $request)
    {
        return Provinsi::get();
    }

    public function kabupaten(Request $request)
    {
        // return Kabupaten::where('province_id', $request->province_id)->get();
        if ($request->provinsi_id) {
            $data = Kabupaten::where('provinsi_id', $request->provinsi_id)->get();
            if ($request->type == 'option') {
                return $this->_createOption($data, 'id', 'full_name');
            } else {
                return $data;
            }
        } else {
            return Kabupaten::all();
        }
    }

    public function kecamatan(Request $request)
    {
        if ($request->kabupaten_id) {
            $data = Kecamatan::where('kabupaten_id', $request->kabupaten_id)->get();
            if ($request->type == 'option') {
                return $this->_createOption($data, 'id', 'name');
            } else {
                return $data;
            }
        } else {
            return Kecamatan::all();
        }
    }

    private function _createOption($data, string $value, string $text): string
    {
        $options = [];
        foreach ($data as $item) {
            $options[] = "<option value=\"{$item[$value]}\">{$item[$text]}</option>";
        }
        return implode("\n", $options);
    }
}
