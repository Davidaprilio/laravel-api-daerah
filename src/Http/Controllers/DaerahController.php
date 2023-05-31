<?php

namespace DavidArl\ApiDaerah\Http\Controllers;

use Illuminate\Routing\Controller;
use DavidArl\ApiDaerah\Models\Kabupaten;
use DavidArl\ApiDaerah\Models\Kecamatan;
use DavidArl\ApiDaerah\Models\Provinsi;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class DaerahController extends Controller
{
    public function provinsi(Request $request)
    {
        return Provinsi::get();
    }

    public function kabupaten(Request $request)
    {
        $provinsi = Provinsi::find($request->provinsi_id);
        if($provinsi === null) {
            return response()->json([
                'message' => "Provinsi tidak ditemukan",
                'query' => $request->all()
            ], Response::HTTP_NOT_FOUND);
        }

        $data = Kabupaten::where('provinsi_id', $provinsi->id)->get();
        if ($request->type == 'option') {
            return $this->_createOption($data, 'id', 'full_name');
        } else {
            return $data;
        }
    }

    public function kecamatan(Request $request)
    {
        $kabupaten = Kabupaten::find($request->kabupaten_id);
        if($kabupaten === null) {
            return response()->json([
                'message' => "Kabupaten tidak ditemukan",
                'query' => $request->all()
            ], Response::HTTP_NOT_FOUND);
        }

        $data = Kecamatan::where('kabupaten_id', $kabupaten->id)->get();
        if ($request->type == 'option') {
            return $this->_createOption($data, 'id', 'name');
        } else {
            return $data;
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
