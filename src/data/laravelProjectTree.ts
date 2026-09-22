import { FileTreeNode, SupportedLanguage } from '@/types/laravelFileSystem';

export function detectLanguageFromPath(path: string): SupportedLanguage {
  if (path.endsWith('.blade.php')) return 'blade';
  if (path.endsWith('.php')) return 'php';
  if (path.endsWith('.sql')) return 'sql';
  if (path.endsWith('.sh') || path.endsWith('.bash')) return 'bash';
  if (path.endsWith('.json')) return 'json';
  if (path.endsWith('.env') || path.includes('.env.')) return 'env';
  if (path.endsWith('.js') || path.endsWith('.ts')) return 'javascript';
  if (path.endsWith('.html')) return 'html';
  return 'php';
}

export const initialVirtualFiles: Record<string, string> = {
  '.env': `APP_NAME="Pesan Makan Serkom"
APP_ENV=local
APP_KEY=base64:7B5qL2j3K9s1P8x4M0v7R6t2W5y8Z1c4V3b9N0m2Q5=
APP_DEBUG=true
APP_TIMEZONE=Asia/Jakarta
APP_URL=http://127.0.0.1:8000

APP_LOCALE=id
APP_FALLBACK_LOCALE=en
APP_FAKER_LOCALE=id_ID

DB_CONNECTION=sqlite
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=restaurant_db
# DB_USERNAME=root
# DB_PASSWORD=

SESSION_DRIVER=database
SESSION_LIFETIME=120
`,

  'composer.json': `{
    "name": "laravel/laravel",
    "type": "project",
    "description": "Aplikasi Pesan Makan Ujikom Serkom SMK",
    "keywords": ["laravel", "framework", "serkom", "ujikom"],
    "license": "MIT",
    "require": {
        "php": "^8.2",
        "laravel/framework": "^11.0",
        "laravel/tinker": "^2.9"
    },
    "require-dev": {
        "fakerphp/faker": "^1.23",
        "laravel/breeze": "^2.0",
        "mockery/mockery": "^1.6",
        "nunomaduro/collision": "^8.0",
        "phpunit/phpunit": "^11.0"
    },
    "autoload": {
        "psr-4": {
            "App\\\\": "app/",
            "Database\\\\Factories\\\\": "database/factories/",
            "Database\\\\Seeders\\\\": "database/seeders/"
        }
    }
}
`,

  'app/Models/User.php': `<?php

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Factories\\HasFactory;
use Illuminate\\Foundation\\Auth\\User as Authenticatable;
use Illuminate\\Notifications\\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $guarded = ['id'];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}
`,

  'app/Models/Food.php': `<?php

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Factories\\HasFactory;
use Illuminate\\Database\\Eloquent\\Model;

class Food extends Model
{
    use HasFactory;

    // TODO Step 3: Tambahkan properti $guarded dan relasi orderDetails()
}
`,

  'app/Models/Order.php': `<?php

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Factories\\HasFactory;
use Illuminate\\Database\\Eloquent\\Model;

class Order extends Model
{
    use HasFactory;

    // TODO Step 3: Tambahkan properti $guarded dan relasi orderDetails()
}
`,

  'app/Models/OrderDetail.php': `<?php

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Factories\\HasFactory;
use Illuminate\\Database\\Eloquent\\Model;

class OrderDetail extends Model
{
    use HasFactory;

    // TODO Step 3: Tambahkan properti $guarded dan relasi order() & food()
}
`,

  'database/migrations/2025_01_01_000001_create_foods_table.php': `<?php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('foods', function (Blueprint $table) {
            $table->id();
            // TODO Step 2: Lengkapi kolom name, category, price, description, image
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('foods');
    }
};
`,

  'database/migrations/2025_01_01_000002_create_orders_table.php': `<?php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            // TODO Step 2: Lengkapi kolom customer_name, table_number, total_price, status
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
`,

  'database/migrations/2025_01_01_000003_create_order_details_table.php': `<?php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('order_details', function (Blueprint $table) {
            $table->id();
            // TODO Step 2: Lengkapi relasi order_id (cascade), food_id, quantity, subtotal
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_details');
    }
};
`,

  'database/seeders/FoodSeeder.php': `<?php

namespace Database\\Seeders;

use Illuminate\\Database\\Seeder;
use App\\Models\\Food;

class FoodSeeder extends Seeder
{
    public function run(): void
    {
        // TODO Step 4: Masukkan 5 data menu makanan dan minuman awal
    }
}
`,

  'database/seeders/DatabaseSeeder.php': `<?php

namespace Database\\Seeders;

use Illuminate\\Database\\Seeder;
use App\\Models\\User;
use Illuminate\\Support\\Facades\\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // TODO Step 4: Panggil FoodSeeder dan buat akun admin default
    }
}
`,

  'app/Http/Controllers/Controller.php': `<?php

namespace App\\Http\\Controllers;

abstract class Controller
{
    //
}
`,

  'app/Http/Controllers/FoodController.php': `<?php

namespace App\\Http\\Controllers;

use App\\Models\\Food;
use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\Storage;

class FoodController extends Controller
{
    // TODO Modul 2: Implementasikan index, create, store, edit, update, destroy
}
`,

  'app/Http/Controllers/OrderController.php': `<?php

namespace App\\Http\\Controllers;

use App\\Models\\Food;
use App\\Models\\Order;
use App\\Models\\OrderDetail;
use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\DB;

class OrderController extends Controller
{
    // TODO Modul 3 & 4: Implementasikan index, store, adminDashboard, updateStatus
}
`,

  'resources/views/foods/index.blade.php': `{{-- TODO Step 9: Tampilan Master Data Makanan (Admin) --}}
`,

  'resources/views/foods/create.blade.php': `{{-- TODO Step 10: Form Tambah Menu Makanan --}}
`,

  'resources/views/foods/edit.blade.php': `{{-- TODO Step 10: Form Edit Menu Makanan --}}
`,

  'resources/views/customer/index.blade.php': `{{-- TODO Step 12 & 13: Katalog Pelanggan & JavaScript Modal Checkout --}}
`,

  'resources/views/dashboard.blade.php': `{{-- TODO Step 19: Dashboard Rekap Pesanan Admin --}}
`,

  'routes/web.php': `<?php

use Illuminate\\Support\\Facades\\Route;
use App\\Http\\Controllers\\FoodController;
use App\\Http\\Controllers\\OrderController;

// TODO Modul 4: Susun rute publik dan grup admin auth
Route::get('/', function () {
    return view('welcome');
});
`,

  'routes/auth.php': `<?php

use App\\Http\\Controllers\\Auth\\AuthenticatedSessionController;
use Illuminate\\Support\\Facades\\Route;

Route::middleware('guest')->group(function () {
    Route::get('login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('login', [AuthenticatedSessionController::class, 'store']);
});

Route::middleware('auth')->group(function () {
    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');
});
`,
};

export const initialFileTree: FileTreeNode[] = [
  {
    id: 'app',
    name: 'app',
    path: 'app',
    type: 'directory',
    isExpanded: true,
    children: [
      {
        id: 'app/Http',
        name: 'Http',
        path: 'app/Http',
        type: 'directory',
        isExpanded: true,
        children: [
          {
            id: 'app/Http/Controllers',
            name: 'Controllers',
            path: 'app/Http/Controllers',
            type: 'directory',
            isExpanded: true,
            children: [
              {
                id: 'app/Http/Controllers/Controller.php',
                name: 'Controller.php',
                path: 'app/Http/Controllers/Controller.php',
                type: 'file',
                language: 'php',
              },
              {
                id: 'app/Http/Controllers/FoodController.php',
                name: 'FoodController.php',
                path: 'app/Http/Controllers/FoodController.php',
                type: 'file',
                language: 'php',
              },
              {
                id: 'app/Http/Controllers/OrderController.php',
                name: 'OrderController.php',
                path: 'app/Http/Controllers/OrderController.php',
                type: 'file',
                language: 'php',
              },
            ],
          },
        ],
      },
      {
        id: 'app/Models',
        name: 'Models',
        path: 'app/Models',
        type: 'directory',
        isExpanded: true,
        children: [
          {
            id: 'app/Models/User.php',
            name: 'User.php',
            path: 'app/Models/User.php',
            type: 'file',
            language: 'php',
          },
          {
            id: 'app/Models/Food.php',
            name: 'Food.php',
            path: 'app/Models/Food.php',
            type: 'file',
            language: 'php',
          },
          {
            id: 'app/Models/Order.php',
            name: 'Order.php',
            path: 'app/Models/Order.php',
            type: 'file',
            language: 'php',
          },
          {
            id: 'app/Models/OrderDetail.php',
            name: 'OrderDetail.php',
            path: 'app/Models/OrderDetail.php',
            type: 'file',
            language: 'php',
          },
        ],
      },
    ],
  },
  {
    id: 'database',
    name: 'database',
    path: 'database',
    type: 'directory',
    isExpanded: true,
    children: [
      {
        id: 'database/migrations',
        name: 'migrations',
        path: 'database/migrations',
        type: 'directory',
        isExpanded: true,
        children: [
          {
            id: 'database/migrations/2025_01_01_000001_create_foods_table.php',
            name: '2025_01_01_000001_create_foods_table.php',
            path: 'database/migrations/2025_01_01_000001_create_foods_table.php',
            type: 'file',
            language: 'php',
          },
          {
            id: 'database/migrations/2025_01_01_000002_create_orders_table.php',
            name: '2025_01_01_000002_create_orders_table.php',
            path: 'database/migrations/2025_01_01_000002_create_orders_table.php',
            type: 'file',
            language: 'php',
          },
          {
            id: 'database/migrations/2025_01_01_000003_create_order_details_table.php',
            name: '2025_01_01_000003_create_order_details_table.php',
            path: 'database/migrations/2025_01_01_000003_create_order_details_table.php',
            type: 'file',
            language: 'php',
          },
        ],
      },
      {
        id: 'database/seeders',
        name: 'seeders',
        path: 'database/seeders',
        type: 'directory',
        isExpanded: true,
        children: [
          {
            id: 'database/seeders/DatabaseSeeder.php',
            name: 'DatabaseSeeder.php',
            path: 'database/seeders/DatabaseSeeder.php',
            type: 'file',
            language: 'php',
          },
          {
            id: 'database/seeders/FoodSeeder.php',
            name: 'FoodSeeder.php',
            path: 'database/seeders/FoodSeeder.php',
            type: 'file',
            language: 'php',
          },
        ],
      },
    ],
  },
  {
    id: 'resources',
    name: 'resources',
    path: 'resources',
    type: 'directory',
    isExpanded: true,
    children: [
      {
        id: 'resources/views',
        name: 'views',
        path: 'resources/views',
        type: 'directory',
        isExpanded: true,
        children: [
          {
            id: 'resources/views/customer',
            name: 'customer',
            path: 'resources/views/customer',
            type: 'directory',
            isExpanded: true,
            children: [
              {
                id: 'resources/views/customer/index.blade.php',
                name: 'index.blade.php',
                path: 'resources/views/customer/index.blade.php',
                type: 'file',
                language: 'blade',
              },
            ],
          },
          {
            id: 'resources/views/foods',
            name: 'foods',
            path: 'resources/views/foods',
            type: 'directory',
            isExpanded: true,
            children: [
              {
                id: 'resources/views/foods/index.blade.php',
                name: 'index.blade.php',
                path: 'resources/views/foods/index.blade.php',
                type: 'file',
                language: 'blade',
              },
              {
                id: 'resources/views/foods/create.blade.php',
                name: 'create.blade.php',
                path: 'resources/views/foods/create.blade.php',
                type: 'file',
                language: 'blade',
              },
              {
                id: 'resources/views/foods/edit.blade.php',
                name: 'edit.blade.php',
                path: 'resources/views/foods/edit.blade.php',
                type: 'file',
                language: 'blade',
              },
            ],
          },
          {
            id: 'resources/views/dashboard.blade.php',
            name: 'dashboard.blade.php',
            path: 'resources/views/dashboard.blade.php',
            type: 'file',
            language: 'blade',
          },
        ],
      },
    ],
  },
  {
    id: 'routes',
    name: 'routes',
    path: 'routes',
    type: 'directory',
    isExpanded: true,
    children: [
      {
        id: 'routes/web.php',
        name: 'web.php',
        path: 'routes/web.php',
        type: 'file',
        language: 'php',
      },
      {
        id: 'routes/auth.php',
        name: 'auth.php',
        path: 'routes/auth.php',
        type: 'file',
        language: 'php',
      },
    ],
  },
  {
    id: '.env',
    name: '.env',
    path: '.env',
    type: 'file',
    language: 'env',
  },
  {
    id: 'composer.json',
    name: 'composer.json',
    path: 'composer.json',
    type: 'file',
    language: 'json',
  },
];
