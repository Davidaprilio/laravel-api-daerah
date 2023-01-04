<?php

namespace DavidArl\ApiDaerah;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Route;

class ApiDaerahServiceProvider extends ServiceProvider
{
    public function register()
    {
        //
    }

    public function boot()
    {
        Route::group(['prefix' => 'api', 'middleware' => ['api']], function () {
            $this->loadRoutesFrom(__DIR__ . '/../routes/api.php');
        });

        $this->loadMigrationsFrom(__DIR__ . '/../database/migrations');

        if ($this->app->runningInConsole()) {
            // Publish assets
            $this->publishes([
                __DIR__ . '/../resources/js' => public_path('api-daerah/js'),
            ], 'assets-api-daerah');
        }
    }
}
