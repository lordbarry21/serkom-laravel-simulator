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

export const BASE_LARAVEL_FILES: Record<string, string> = {
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
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=restaurant_db
DB_USERNAME=root
DB_PASSWORD=

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
        "mockery/mockery": "^1.6",
        "nunomaduro/collision": "^8.0",
        "phpunit/phpunit": "^11.0"
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
        // TODO Step 6: Buat user admin default dan panggil FoodSeeder
    }
}
`,

  'routes/web.php': `<?php

use Illuminate\\Support\\Facades\\Route;

Route::get('/', function () {
    return view('welcome');
});
`,
};

export const FOOD_MCR_FILES: Record<string, string> = {
  'app/Models/Food.php': `<?php

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Factories\\HasFactory;
use Illuminate\\Database\\Eloquent\\Model;

class Food extends Model
{
    use HasFactory;

    // TODO Step 5: Tambahkan properti $table dan $guarded
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
            // TODO Step 3: Lengkapi kolom name, category enum, price, description, image
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('foods');
    }
};
`,

  'app/Http/Controllers/FoodController.php': `<?php

namespace App\\Http\\Controllers;

use App\\Models\\Food;
use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\Storage;

class FoodController extends Controller
{
    // TODO Step 8: Implementasikan method index, create, store, edit, update, destroy
}
`,
};

export const ORDER_MCR_FILES: Record<string, string> = {
  'app/Models/Order.php': `<?php

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Factories\\HasFactory;
use Illuminate\\Database\\Eloquent\\Model;

class Order extends Model
{
    use HasFactory;

    // TODO Step 5: Tambahkan properti $guarded dan relasi orderDetails()
}
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
            // TODO Step 4: Lengkapi kolom customer_name, table_number, total_price, status
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
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
    // TODO Step 11 & 16: Implementasikan index, store, adminDashboard, updateStatus
}
`,
};

export const ORDER_DETAIL_M_FILES: Record<string, string> = {
  'app/Models/OrderDetail.php': `<?php

namespace App\\Models\\OrderDetail;
namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Factories\\HasFactory;
use Illuminate\\Database\\Eloquent\\Model;

class OrderDetail extends Model
{
    use HasFactory;

    // TODO Step 5: Tambahkan properti $table, $guarded, relasi food() dan order()
}
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
            // TODO Step 4: Sambungkan order_id dan food_id cascade serta quantity & subtotal
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_details');
    }
};
`,
};

export const UNWANTED_ORDER_DETAIL_CONTROLLER = `<?php

namespace App\\Http\\Controllers;

use App\\Models\\OrderDetail;
use Illuminate\\Http\\Request;

/**
 * ⚠️ PERINGATAN: File controller ini TIDAK DIBUTUHKAN pada modul Serkom!
 * Logika order detail diproses langsung di OrderController (Step 11).
 * Menjalankan -mcr pada OrderDetail menciptakan controller berlebih yang melanggar arsitektur modul.
 */
class OrderDetailController extends Controller
{
    public function index()
    {
        // Controller ini tidak digunakan dalam aplikasi Serkom.
    }
}
`;

export const FOOD_SEEDER_FILES: Record<string, string> = {
  'database/seeders/FoodSeeder.php': `<?php

namespace Database\\Seeders;

use Illuminate\\Database\\Seeder;
use Illuminate\\Support\\Facades\\DB;

class FoodSeeder extends Seeder
{
    public function run(): void
    {
        // TODO Step 6: Masukkan 5 data menu makanan dan minuman awal
    }
}
`,
};

export const BREEZE_BLADE_FILES: Record<string, string> = {
  'resources/views/foods/index.blade.php': `{{-- TODO Step 9: Tampilan Master Data Makanan (Admin) --}}
`,
  'resources/views/foods/create.blade.php': `{{-- TODO Step 10: Form Tambah Menu Makanan --}}
`,
  'resources/views/foods/edit.blade.php': `{{-- TODO Step 10: Form Edit Menu Makanan --}}
`,
  'resources/views/customer/index.blade.php': `{{-- TODO Step 12 & 13: Katalog Pelanggan & JavaScript Modal Checkout --}}
`,
  'resources/views/dashboard.blade.php': `{{-- TODO Step 17: Dashboard Rekap Pesanan Admin --}}
`,
};

// Convert flat path map into nested FileTreeNode[] hierarchy
export function buildFileTreeFromPaths(files: Record<string, string>): FileTreeNode[] {
  const rootNodes: FileTreeNode[] = [];
  const dirMap = new Map<string, FileTreeNode>();

  // Sort paths so parents are processed before or consistently with children
  const sortedPaths = Object.keys(files).sort();

  for (const filePath of sortedPaths) {
    const segments = filePath.split('/');

    if (segments.length === 1) {
      // Root file (e.g. .env, composer.json)
      rootNodes.push({
        id: filePath,
        name: filePath,
        path: filePath,
        type: 'file',
        language: detectLanguageFromPath(filePath),
      });
      continue;
    }

    let currentPath = '';
    let parentNode: FileTreeNode | null = null;

    for (let i = 0; i < segments.length - 1; i++) {
      const segment = segments[i];
      currentPath = currentPath ? `${currentPath}/${segment}` : segment;

      if (!dirMap.has(currentPath)) {
        const newDir: FileTreeNode = {
          id: currentPath,
          name: segment,
          path: currentPath,
          type: 'directory',
          isExpanded: true,
          children: [],
        };
        dirMap.set(currentPath, newDir);

        if (parentNode) {
          parentNode.children = parentNode.children || [];
          parentNode.children.push(newDir);
        } else {
          rootNodes.push(newDir);
        }
      }
      parentNode = dirMap.get(currentPath)!;
    }

    // Leaf file
    const fileName = segments[segments.length - 1];
    if (parentNode) {
      parentNode.children = parentNode.children || [];
      parentNode.children.push({
        id: filePath,
        name: fileName,
        path: filePath,
        type: 'file',
        language: detectLanguageFromPath(filePath),
      });
    }
  }

  return rootNodes;
}

// Initial state starts completely EMPTY until student runs composer create-project
export const initialVirtualFiles: Record<string, string> = {};
export const initialFileTree: FileTreeNode[] = [];
