<?php

use DavidArl\ApiDaerah\Http\Controllers\DaerahController;
use Illuminate\Support\Facades\Route;

Route::get('/provinsi', [DaerahController::class, 'provinsi'])->name('daerah.provinsi');
Route::get('/kabupaten/{provinsi_id}', [DaerahController::class, 'kabupaten'])->name('daerah.kabupaten');
Route::get('/kecamatan/{kabupaten_id}', [DaerahController::class, 'kecamatan'])->name('daerah.kecamatan');
