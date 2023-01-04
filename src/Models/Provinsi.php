<?php

namespace DavidArl\ApiDaerah\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Provinsi extends Model
{
    use HasFactory;

    public function kabupaten()
    {
        return $this->hasMany(Kabupaten::class);
    }
}
