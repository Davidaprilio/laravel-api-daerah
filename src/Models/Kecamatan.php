<?php

namespace DavidArl\ApiDaerah\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Kecamatan extends Model
{
    use HasFactory;

    public function kabupaten()
    {
        return $this->belongsTo(Kabupaten::class);
    }
}
