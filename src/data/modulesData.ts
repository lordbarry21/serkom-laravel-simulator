import { SimulatorModule } from '@/types/simulator';

export const simulatorModules: SimulatorModule[] = [
  // =========================================================================
  // MODUL 1: FONDASI PROYEK, DATABASE & ELOQUENT MODEL
  // =========================================================================
  {
    id: 1,
    title: 'Modul 1: Fondasi Proyek, Database & Model',
    subtitle: 'Setup Laravel 11, skema 3 tabel migrasi, relasi Eloquent, dan seeding database.',
    estimatedTime: '20 Menit',
    badge: 'Fondasi Database',
    steps: [
      {
        id: 'm1-step-1',
        moduleId: 1,
        stepNumber: 1,
        title: 'Setup Proyek & Konfigurasi .env',
        subtitle: 'Inisialisasi aplikasi Laravel baru dan hubungkan database',
        descriptionMarkdown: `### 🎯 Instruksi Langkah 1:
1. Pada terminal di sebelah kanan, jalankan perintah pembuatan proyek Laravel:
   \`composer create-project laravel/laravel pesanmakan\`
2. Masuk ke direktori: \`cd pesanmakan\`
3. Buka file \`.env\` pada editor dan pastikan nama database diatur ke \`pesanmakan\`:
   \`\`\`env
   DB_CONNECTION=mysql
   DB_DATABASE=pesanmakan
   \`\`\`
`,
        theorySummary: 'File `.env` menentukan ke mana Laravel menyimpan data. Selalu pastikan `DB_DATABASE` sesuai dengan database ujian Serkom.',
        targetFilePath: '.env',
        initialCode: `APP_NAME="Pesan Makan Serkom"
APP_ENV=local
APP_KEY=base64:7B5qL2j3K9s1P8x4M0v7R6t2W5y8Z1c4V3b9N0m2Q5=
APP_DEBUG=true
APP_TIMEZONE=Asia/Jakarta
APP_URL=http://127.0.0.1:8000

DB_CONNECTION=sqlite
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=restaurant_db
DB_USERNAME=root
DB_PASSWORD=
`,
        solutionCode: `APP_NAME="Pesan Makan Serkom"
APP_ENV=local
APP_KEY=base64:7B5qL2j3K9s1P8x4M0v7R6t2W5y8Z1c4V3b9N0m2Q5=
APP_DEBUG=true
APP_TIMEZONE=Asia/Jakarta
APP_URL=http://127.0.0.1:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=pesanmakan
DB_USERNAME=root
DB_PASSWORD=
`,
        criteria: [
          {
            id: 'c1-1',
            description: 'Jalankan perintah "composer create-project laravel/laravel pesanmakan" di terminal',
            type: 'terminal_command',
            targetCommand: 'composer create-project laravel/laravel pesanmakan',
            isCompleted: false,
          },
          {
            id: 'c1-2',
            description: 'Atur DB_DATABASE=pesanmakan di file .env',
            type: 'code_edit',
            targetPath: '.env',
            isCompleted: false,
          },
        ],
        validationRules: {
          requiredPatterns: ['DB_DATABASE=pesanmakan'],
          missingMessageMap: {
            'DB_DATABASE=pesanmakan': 'Pastikan baris "DB_DATABASE=pesanmakan" sudah tertulis di .env',
          },
        },
        expectedCommands: ['composer create-project laravel/laravel pesanmakan', 'cd pesanmakan'],
        hints: [
          'Gunakan perintah: composer create-project laravel/laravel pesanmakan di tab Terminal.',
          'Pada file .env di tengah editor, ubah "DB_DATABASE=restaurant_db" menjadi "DB_DATABASE=pesanmakan".',
        ],
        preferredTab: 'terminal',
      },

      {
        id: 'm1-step-2',
        moduleId: 1,
        stepNumber: 2,
        title: 'Generate Model, Migrasi, & Controller Artisan',
        subtitle: 'Gunakan shortcut flag -mcr untuk membuat arsitektur MVC dalam 1 perintah',
        descriptionMarkdown: `### 🎯 Instruksi Langkah 2:
Jalankan 3 perintah Artisan berikut pada Terminal:
1. \`php artisan make:model Food -mcr\` (Membuat Model, Migrasi, dan Controller Food)
2. \`php artisan make:model Order -mcr\` (Membuat Model, Migrasi, dan Controller Order)
3. \`php artisan make:model OrderDetail -m\` (Membuat Model dan Migrasi OrderDetail)

> **Tips Hafalan Singkatan:**
> \`-mcr\` = **M**odel + **C**ontroller Resource + **R**oute/Migration.
`,
        theorySummary: 'Otomasi Artisan menghemat 80% waktu setup saat Serkom. Cukup ketik `make:model Nama -mcr`.',
        criteria: [
          {
            id: 'c2-1',
            description: 'Jalankan "php artisan make:model Food -mcr"',
            type: 'terminal_command',
            targetCommand: 'php artisan make:model Food -mcr',
            isCompleted: false,
          },
          {
            id: 'c2-2',
            description: 'Jalankan "php artisan make:model Order -mcr"',
            type: 'terminal_command',
            targetCommand: 'php artisan make:model Order -mcr',
            isCompleted: false,
          },
          {
            id: 'c2-3',
            description: 'Jalankan "php artisan make:model OrderDetail -m"',
            type: 'terminal_command',
            targetCommand: 'php artisan make:model OrderDetail -m',
            isCompleted: false,
          },
        ],
        expectedCommands: [
          'php artisan make:model Food -mcr',
          'php artisan make:model Order -mcr',
          'php artisan make:model OrderDetail -m',
        ],
        hints: [
          'Jalankan perintah pertama: php artisan make:model Food -mcr',
          'Lanjutkan dengan Order (-mcr) dan OrderDetail (-m)',
        ],
        preferredTab: 'terminal',
      },

      {
        id: 'm1-step-3',
        moduleId: 1,
        stepNumber: 3,
        title: 'Definisi Skema Migrasi Tabel foods',
        subtitle: 'Siapkan kolom master data makanan dengan validasi tipe data yang tepat',
        descriptionMarkdown: `### 🎯 Instruksi Langkah 3:
Buka file \`database/migrations/2025_01_01_000001_create_foods_table.php\` dan lengkapi skema tabel \`foods\`:
- \`name\` (string)
- \`category\` (enum: \`['Makanan', 'Minuman', 'Cemilan']\`)
- \`price\` (integer)
- \`description\` (text)
- \`image\` (string nullable)

\`\`\`php
$table->id();
$table->string('name');
$table->enum('category', ['Makanan', 'Minuman', 'Cemilan']);
$table->integer('price');
$table->text('description');
$table->string('image')->nullable();
$table->timestamps();
\`\`\`
`,
        theorySummary: 'Menu makanan memiliki 5 atribut inti: nama, kategori (enum), harga satuan, deskripsi, dan foto path (nullable).',
        targetFilePath: 'database/migrations/2025_01_01_000001_create_foods_table.php',
        initialCode: `<?php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('foods', function (Blueprint $table) {
            $table->id();
            // TODO Step 3: Lengkapi kolom name, category, price, description, image
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('foods');
    }
};
`,
        solutionCode: `<?php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('foods', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->enum('category', ['Makanan', 'Minuman', 'Cemilan']);
            $table->integer('price');
            $table->text('description');
            $table->string('image')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('foods');
    }
};
`,
        criteria: [
          {
            id: 'c3-1',
            description: 'Lengkapi 5 kolom tabel foods (name, category enum, price, description, image nullable)',
            type: 'code_edit',
            targetPath: 'database/migrations/2025_01_01_000001_create_foods_table.php',
            isCompleted: false,
          },
        ],
        validationRules: {
          requiredPatterns: [
            "$table->string('name')",
            "$table->enum('category', ['Makanan', 'Minuman', 'Cemilan'])",
            "$table->integer('price')",
            "$table->text('description')",
            "$table->string('image')->nullable()",
          ],
          missingMessageMap: {
            "$table->string('name')": 'Kolom $table->string(\'name\'); belum didefinisikan',
            "$table->enum('category', ['Makanan', 'Minuman', 'Cemilan'])": 'Kolom enum category [Makanan, Minuman, Cemilan] belum lengkap',
            "$table->integer('price')": 'Kolom $table->integer(\'price\'); belum didefinisikan',
            "$table->text('description')": 'Kolom $table->text(\'description\'); belum didefinisikan',
            "$table->string('image')->nullable()": 'Kolom $table->string(\'image\')->nullable(); belum didefinisikan',
          },
        },
        hints: [
          'Periksa apakah nama kolom bertipe string, enum, integer, text, dan string nullable.',
          'Pastikan enum memiliki 3 opsi: [\'Makanan\', \'Minuman\', \'Cemilan\'].',
        ],
        preferredTab: 'terminal',
      },

      {
        id: 'm1-step-4',
        moduleId: 1,
        stepNumber: 4,
        title: 'Migrasi Tabel orders & order_details (Foreign Key)',
        subtitle: 'Konstruksi relasi One-to-Many dengan Foreign Key onDelete cascade',
        descriptionMarkdown: `### 🎯 Instruksi Langkah 4:
Lengkapi kedua skema migrasi pesanan:
1. Buka \`database/migrations/2025_01_01_000002_create_orders_table.php\`:
   - \`customer_name\` (string)
   - \`table_number\` (string)
   - \`total_price\` (integer)
   - \`status\` (string default 'pending')

2. Buka \`database/migrations/2025_01_01_000003_create_order_details_table.php\`:
   - \`$table->foreignId('order_id')->constrained('orders')->onDelete('cascade');\`
   - \`$table->foreignId('food_id')->constrained('foods')->onDelete('cascade');\`
   - \`quantity\` (integer)
   - \`subtotal\` (integer)
`,
        theorySummary: 'Tabel `order_details` adalah tabel perantara. Menggunakan `foreignId()->constrained()->onDelete(\'cascade\')` mencegah data yatim (*orphan records*) saat pesanan dihapus.',
        targetFilePath: 'database/migrations/2025_01_01_000003_create_order_details_table.php',
        initialCode: `<?php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('order_details', function (Blueprint $table) {
            $table->id();
            // TODO Step 4: Sambungkan order_id dan food_id serta catat quantity & subtotal
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_details');
    }
};
`,
        solutionCode: `<?php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('order_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->onDelete('cascade');
            $table->foreignId('food_id')->constrained('foods')->onDelete('cascade');
            $table->integer('quantity');
            $table->integer('subtotal');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_details');
    }
};
`,
        criteria: [
          {
            id: 'c4-1',
            description: 'Definisikan Foreign Key order_id dan food_id dengan onDelete("cascade")',
            type: 'code_edit',
            targetPath: 'database/migrations/2025_01_01_000003_create_order_details_table.php',
            isCompleted: false,
          },
          {
            id: 'c4-2',
            description: 'Tambahkan kolom quantity dan subtotal integer',
            type: 'code_edit',
            targetPath: 'database/migrations/2025_01_01_000003_create_order_details_table.php',
            isCompleted: false,
          },
        ],
        validationRules: {
          requiredPatterns: [
            "$table->foreignId('order_id')->constrained('orders')->onDelete('cascade')",
            "$table->foreignId('food_id')->constrained('foods')->onDelete('cascade')",
            "$table->integer('quantity')",
            "$table->integer('subtotal')",
          ],
          missingMessageMap: {
            "$table->foreignId('order_id')->constrained('orders')->onDelete('cascade')": 'Foreign key order_id cascade belum ada',
            "$table->foreignId('food_id')->constrained('foods')->onDelete('cascade')": 'Foreign key food_id cascade belum ada',
            "$table->integer('quantity')": 'Kolom quantity integer belum didefinisikan',
            "$table->integer('subtotal')": 'Kolom subtotal integer belum didefinisikan',
          },
        },
        hints: [
          'Gunakan sintaks: $table->foreignId(\'order_id\')->constrained(\'orders\')->onDelete(\'cascade\');',
          'Pastikan quantity dan subtotal bertipe integer.',
        ],
        preferredTab: 'terminal',
      },

      {
        id: 'm1-step-5',
        moduleId: 1,
        stepNumber: 5,
        title: 'Konfigurasi Eloquent Model & Relasi',
        subtitle: 'Hubungkan Food, Order, dan OrderDetail dengan hasMany dan belongsTo',
        descriptionMarkdown: `### 🎯 Instruksi Langkah 5:
Buka file Model dan pasang relasi:
1. Di \`app/Models/Order.php\`:
   \`\`\`php
   protected $guarded = ['id'];
   public function orderDetails() {
       return $this->hasMany(OrderDetail::class, 'order_id');
   }
   \`\`\`
2. Di \`app/Models/OrderDetail.php\`:
   \`\`\`php
   protected $guarded = ['id'];
   public function food() {
       return $this->belongsTo(Food::class, 'food_id');
   }
   public function order() {
       return $this->belongsTo(Order::class, 'order_id');
   }
   \`\`\`
`,
        theorySummary: 'Rumus hafalan: Induk ke Anak = `hasMany` (Order punya banyak OrderDetail). Anak ke Induk = `belongsTo` (OrderDetail milik Order & Food). Jangan lupa `protected $guarded = [\'id\'];` untuk mencegah MassAssignmentException.',
        targetFilePath: 'app/Models/Order.php',
        initialCode: `<?php

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Factories\\HasFactory;
use Illuminate\\Database\\Eloquent\\Model;

class Order extends Model
{
    use HasFactory;

    // TODO Step 5: Tambahkan properti $guarded dan relasi orderDetails()
}
`,
        solutionCode: `<?php

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Factories\\HasFactory;
use Illuminate\\Database\\Eloquent\\Model;

class Order extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    public function orderDetails()
    {
        return $this->hasMany(OrderDetail::class, 'order_id');
    }
}
`,
        criteria: [
          {
            id: 'c5-1',
            description: 'Tambahkan $guarded = [\'id\'] dan relasi orderDetails() hasMany pada Order.php',
            type: 'code_edit',
            targetPath: 'app/Models/Order.php',
            isCompleted: false,
          },
        ],
        validationRules: {
          requiredPatterns: [
            "$guarded = ['id']",
            "function orderDetails()",
            "hasMany(OrderDetail::class",
          ],
          missingMessageMap: {
            "$guarded = ['id']": 'Tambahkan properti "protected $guarded = [\'id\'];"',
            "function orderDetails()": 'Method relasi orderDetails() belum dibuat',
            "hasMany(OrderDetail::class": 'Gunakan return $this->hasMany(OrderDetail::class, \'order_id\');',
          },
        },
        hints: [
          'Tambahkan: protected $guarded = [\'id\']; di dalam class Order',
          'Buat function orderDetails() yang mengembalikan hasMany(OrderDetail::class, \'order_id\')',
        ],
        preferredTab: 'terminal',
      },

      {
        id: 'm1-step-6',
        moduleId: 1,
        stepNumber: 6,
        title: 'Seeding Data Awal & Eksekusi Migrasi',
        subtitle: 'Isi 5 menu makanan awal, 1 akun admin default, lalu jalankan migrate:fresh --seed',
        descriptionMarkdown: `### 🎯 Instruksi Langkah 6:
1. Pastikan \`database/seeders/FoodSeeder.php\` menginsert data 5 menu makanan.
2. Pastikan \`database/seeders/DatabaseSeeder.php\` membuat admin default (\`admin@gmail.com\` / \`password123\`) dan memanggil \`FoodSeeder\`.
3. Buka Terminal dan jalankan:
   \`php artisan migrate:fresh --seed\`
`,
        theorySummary: 'Perintah `migrate:fresh --seed` adalah penyelamat saat ujian: ia mereset bersih seluruh database dan langsung mengisinya kembali dengan data siap uji.',
        targetFilePath: 'database/seeders/DatabaseSeeder.php',
        initialCode: `<?php

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
        solutionCode: `<?php

namespace Database\\Seeders;

use Illuminate\\Database\\Seeder;
use App\\Models\\User;
use Illuminate\\Support\\Facades\\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Admin Toko',
            'email' => 'admin@gmail.com',
            'password' => Hash::make('password123'),
        ]);

        $this->call([
            FoodSeeder::class,
        ]);
    }
}
`,
        criteria: [
          {
            id: 'c6-1',
            description: 'Daftarkan admin@gmail.com dan pemanggilan FoodSeeder di DatabaseSeeder.php',
            type: 'code_edit',
            targetPath: 'database/seeders/DatabaseSeeder.php',
            isCompleted: false,
          },
          {
            id: 'c6-2',
            description: 'Jalankan "php artisan migrate:fresh --seed" di terminal',
            type: 'terminal_command',
            targetCommand: 'php artisan migrate:fresh --seed',
            isCompleted: false,
          },
        ],
        validationRules: {
          requiredPatterns: [
            "admin@gmail.com",
            "Hash::make('password123')",
            "FoodSeeder::class",
          ],
          missingMessageMap: {
            "admin@gmail.com": 'Akun admin@gmail.com belum didaftarkan di seeder',
            "Hash::make('password123')": 'Password admin wajib di-hash menggunakan Hash::make("password123")',
            "FoodSeeder::class": 'Panggil seeder makanan: $this->call([FoodSeeder::class]);',
          },
        },
        expectedCommands: ['php artisan migrate:fresh --seed'],
        hints: [
          'Daftarkan User::create dengan email admin@gmail.com',
          'Panggil $this->call([FoodSeeder::class]); di dalam run()',
          'Jalankan php artisan migrate:fresh --seed di terminal',
        ],
        preferredTab: 'terminal',
      },
    ],
  },

  // =========================================================================
  // MODUL 2: BREEZE AUTH & CRUD MASTER MAKANAN (SISI ADMIN)
  // =========================================================================
  {
    id: 2,
    title: 'Modul 2: Breeze Auth & CRUD Makanan Admin',
    subtitle: 'Instalasi autentikasi Breeze, storage:link foto menu, Controller CRUD, dan Blade views.',
    estimatedTime: '25 Menit',
    badge: 'CRUD & Upload File',
    steps: [
      {
        id: 'm2-step-7',
        moduleId: 2,
        stepNumber: 7,
        title: 'Instalasi Laravel Breeze & Storage Link',
        subtitle: 'Pasang scaffolding login bawaan dan buat symlink public untuk file foto',
        descriptionMarkdown: `### 🎯 Instruksi Langkah 7:
Jalankan perintah berikut di Terminal secara berurutan:
1. \`composer require laravel/breeze --dev\`
2. \`php artisan breeze:install\` (pilih Blade)
3. \`php artisan storage:link\`

> **PENTING:** Perintah \`php artisan storage:link\` **wajib** dijalankan agar foto makanan di \`storage/app/public/foods\` dapat diakses browser lewat URL \`asset('storage/foods/...')\`.
`,
        theorySummary: 'Tanpa `storage:link`, browser akan menghasilkan 404 saat memuat gambar menu makanan.',
        criteria: [
          {
            id: 'c7-1',
            description: 'Jalankan "composer require laravel/breeze --dev"',
            type: 'terminal_command',
            targetCommand: 'composer require laravel/breeze --dev',
            isCompleted: false,
          },
          {
            id: 'c7-2',
            description: 'Jalankan "php artisan breeze:install"',
            type: 'terminal_command',
            targetCommand: 'php artisan breeze:install',
            isCompleted: false,
          },
          {
            id: 'c7-3',
            description: 'Jalankan "php artisan storage:link"',
            type: 'terminal_command',
            targetCommand: 'php artisan storage:link',
            isCompleted: false,
          },
        ],
        expectedCommands: [
          'composer require laravel/breeze --dev',
          'php artisan breeze:install',
          'php artisan storage:link',
        ],
        hints: [
          'Jalankan perintah pertama: composer require laravel/breeze --dev',
          'Lanjutkan dengan php artisan breeze:install lalu php artisan storage:link',
        ],
        preferredTab: 'terminal',
      },

      {
        id: 'm2-step-8',
        moduleId: 2,
        stepNumber: 8,
        title: 'Logika CRUD FoodController Lengkap',
        subtitle: 'Implementasikan index, create, store, edit, update, dan destroy dengan hapus foto fisik',
        descriptionMarkdown: `### 🎯 Instruksi Langkah 8:
Buka \`app/Http/Controllers/FoodController.php\` dan implementasikan 6 method standar CRUD:
1. \`index()\`: Ambil data terbaru dengan pagination \`Food::latest()->paginate(10)\`.
2. \`create()\`: Tampilkan form view \`foods.create\`.
3. \`store()\`: Validasi input, upload foto ke folder \`foods\` di disk \`public\`, simpan ke DB.
4. \`edit(Food $food)\`: Tampilkan form view \`foods.edit\`.
5. \`update()\`: Validasi input, ganti foto lama bila ada file baru, simpan ke DB.
6. \`destroy(Food $food)\`: Hapus file foto fisik dari disk public menggunakan \`Storage::disk('public')->delete($food->image)\` lalu \`$food->delete()\`.
`,
        theorySummary: 'Perhatikan saat edit dan hapus: file foto lama harus dihapus dari storage fisik agar server tidak penuh dengan file sampah.',
        targetFilePath: 'app/Http/Controllers/FoodController.php',
        initialCode: `<?php

namespace App\\Http\\Controllers;

use App\\Models\\Food;
use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\Storage;

class FoodController extends Controller
{
    // TODO Step 8: Implementasikan index, create, store, edit, update, destroy
}
`,
        solutionCode: `<?php

namespace App\\Http\\Controllers;

use App\\Models\\Food;
use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\Storage;

class FoodController extends Controller
{
    public function index()
    {
        $foods = Food::latest()->paginate(10);
        return view('foods.index', compact('foods'));
    }

    public function create()
    {
        return view('foods.create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'        => 'required|string|max:255',
            'category'    => 'required|in:Makanan,Minuman,Cemilan',
            'price'       => 'required|numeric|min:0',
            'description' => 'required|string',
            'image'       => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('foods', 'public');
        }

        Food::create([
            'name'        => $request->name,
            'category'    => $request->category,
            'price'       => $request->price,
            'description' => $request->description,
            'image'       => $imagePath,
        ]);

        return redirect()->route('foods.index')->with('success', 'Data makanan berhasil ditambahkan!');
    }

    public function edit(Food $food)
    {
        return view('foods.edit', compact('food'));
    }

    public function update(Request $request, Food $food)
    {
        $request->validate([
            'name'        => 'required|string|max:255',
            'category'    => 'required|in:Makanan,Minuman,Cemilan',
            'price'       => 'required|numeric|min:0',
            'description' => 'required|string',
            'image'       => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $imagePath = $food->image;
        if ($request->hasFile('image')) {
            if ($food->image && Storage::disk('public')->exists($food->image)) {
                Storage::disk('public')->delete($food->image);
            }
            $imagePath = $request->file('image')->store('foods', 'public');
        }

        $food->update([
            'name'        => $request->name,
            'category'    => $request->category,
            'price'       => $request->price,
            'description' => $request->description,
            'image'       => $imagePath,
        ]);

        return redirect()->route('foods.index')->with('success', 'Data makanan berhasil diperbarui!');
    }

    public function destroy(Food $food)
    {
        if ($food->image && Storage::disk('public')->exists($food->image)) {
            Storage::disk('public')->delete($food->image);
        }

        $food->delete();
        return redirect()->route('foods.index')->with('success', 'Data makanan berhasil dihapus!');
    }
}
`,
        criteria: [
          {
            id: 'c8-1',
            description: 'Implementasikan method index, create, store dengan upload file ke folder foods',
            type: 'code_edit',
            targetPath: 'app/Http/Controllers/FoodController.php',
            isCompleted: false,
          },
          {
            id: 'c8-2',
            description: 'Implementasikan method update dan destroy dengan penghapusan file lama di disk public',
            type: 'code_edit',
            targetPath: 'app/Http/Controllers/FoodController.php',
            isCompleted: false,
          },
        ],
        validationRules: {
          requiredPatterns: [
            "public function index()",
            "public function store(Request $request)",
            "store('foods', 'public')",
            "public function update(Request $request, Food $food)",
            "Storage::disk('public')->delete",
            "public function destroy(Food $food)",
          ],
          missingMessageMap: {
            "public function index()": 'Method index() belum diimplementasikan',
            "public function store(Request $request)": 'Method store(Request $request) belum diimplementasikan',
            "store('foods', 'public')": 'Upload file wajib menyertakan store(\'foods\', \'public\')',
            "public function update(Request $request, Food $food)": 'Method update(Request $request, Food $food) belum diimplementasikan',
            "Storage::disk('public')->delete": 'Gunakan Storage::disk(\'public\')->delete(...) untuk menghapus foto fisik',
            "public function destroy(Food $food)": 'Method destroy(Food $food) belum diimplementasikan',
          },
        },
        hints: [
          'Pastikan menyertakan use Illuminate\\Support\\Facades\\Storage;',
          'Gunakan $request->file(\'image\')->store(\'foods\', \'public\') saat menyimpan foto baru.',
        ],
        preferredTab: 'terminal',
      },

      {
        id: 'm2-step-9',
        moduleId: 2,
        stepNumber: 9,
        title: 'Tampilan Blade Master Makanan (Admin)',
        subtitle: 'Tampilkan tabel data menu, thumbnail gambar, tombol edit, dan form hapus dengan konfirmasi',
        descriptionMarkdown: `### 🎯 Instruksi Langkah 9:
Buka \`resources/views/foods/index.blade.php\` dan buat tabel responsif:
- Kolom Gambar: Menampilkan \`<img src="{{ asset('storage/' . $food->image) }}">\`.
- Kolom Harga: Diformat dengan \`Rp {{ number_format($food->price) }}\`.
- Tombol Aksi: Edit mengarah ke \`route('foods.edit', $food->id)\` dan form Hapus dengan \`@csrf\` & \`@method('DELETE')\`.
`,
        theorySummary: 'Untuk form Delete di Laravel, method HTML selalu POST dengan directive `@method(\'DELETE\')` dan token perlindungan `@csrf`.',
        targetFilePath: 'resources/views/foods/index.blade.php',
        initialCode: `{{-- TODO Step 9: Tampilan Master Data Makanan (Admin) --}}
`,
        solutionCode: `<div class="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">Master Data Menu Makanan</h2>
        <a href="{{ route('foods.create') }}" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold shadow-sm transition">
            + Tambah Menu Baru
        </a>
    </div>

    @if(session('success'))
        <div class="bg-green-100 border border-green-400 text-green-700 p-3 rounded-lg mb-4">{{ session('success') }}</div>
    @endif

    <div class="bg-white border shadow-sm rounded-xl overflow-hidden">
        <table class="w-full text-left border-collapse">
            <thead>
                <tr class="bg-gray-100 border-b text-gray-600 text-sm uppercase">
                    <th class="p-3">Gambar</th>
                    <th class="p-3">Nama Menu</th>
                    <th class="p-3">Kategori</th>
                    <th class="p-3">Harga</th>
                    <th class="p-3 text-center">Aksi</th>
                </tr>
            </thead>
            <tbody class="divide-y text-sm">
                @foreach($foods as $food)
                <tr class="hover:bg-gray-50 text-center">
                    <td class="p-3">
                        @if($food->image)
                            <img src="{{ asset('storage/' . $food->image) }}" class="w-14 h-14 object-cover mx-auto rounded-md shadow-sm">
                        @else
                            <span class="text-gray-400 text-xs">No Image</span>
                        @endif
                    </td>
                    <td class="p-3 font-semibold text-gray-800 text-left">{{ $food->name }}</td>
                    <td class="p-3 text-left"><span class="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-semibold">{{ $food->category }}</span></td>
                    <td class="p-3 font-bold text-green-600 text-left">Rp {{ number_format($food->price) }}</td>
                    <td class="p-3 text-center">
                        <a href="{{ route('foods.edit', $food->id) }}" class="text-blue-600 hover:underline mr-3 font-semibold">Edit</a>
                        <form action="{{ route('foods.destroy', $food->id) }}" method="POST" class="inline">
                            @csrf
                            @method('DELETE')
                            <button type="submit" onclick="return confirm('Yakin hapus data ini?')" class="text-red-600 hover:underline font-semibold">Hapus</button>
                        </form>
                    </td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>
</div>
`,
        criteria: [
          {
            id: 'c9-1',
            description: 'Tampilkan perulangan @foreach($foods as $food) dengan thumbnail dan format rupiah',
            type: 'code_edit',
            targetPath: 'resources/views/foods/index.blade.php',
            isCompleted: false,
          },
          {
            id: 'c9-2',
            description: 'Sertakan form action destroy dengan @csrf dan @method("DELETE")',
            type: 'code_edit',
            targetPath: 'resources/views/foods/index.blade.php',
            isCompleted: false,
          },
        ],
        validationRules: {
          requiredPatterns: [
            "@foreach($foods as $food)",
            "asset('storage/' . $food->image)",
            "number_format($food->price)",
            "@method('DELETE')",
            "@csrf",
          ],
          missingMessageMap: {
            "@foreach($foods as $food)": 'Tabel harus mengulang data menu dengan @foreach($foods as $food)',
            "asset('storage/' . $food->image)": 'Gunakan asset(\'storage/\' . $food->image) untuk memuat gambar',
            "number_format($food->price)": 'Format harga menggunakan number_format($food->price)',
            "@method('DELETE')": 'Form hapus wajib memuat directive @method(\'DELETE\')',
            "@csrf": 'Form hapus wajib menyertakan token @csrf',
          },
        },
        hints: [
          'Gunakan asset(\'storage/\' . $food->image) untuk menampilkan gambar.',
          'Pastikan tombol hapus berada di dalam <form method="POST"> dengan @csrf dan @method(\'DELETE\').',
        ],
        defaultPreviewRoute: '/admin/foods',
        preferredTab: 'preview',
      },

      {
        id: 'm2-step-10',
        moduleId: 2,
        stepNumber: 10,
        title: 'Form Tambah & Edit Menu Makanan',
        subtitle: 'Pastikan enctype="multipart/form-data" dan directive @method("PUT") pada form edit',
        descriptionMarkdown: `### 🎯 Instruksi Langkah 10:
Buka file form \`resources/views/foods/create.blade.php\` dan pastikan:
1. Tag \`<form>\` memiliki atribut \`enctype="multipart/form-data"\` (karena ada input file foto).
2. Terdapat input \`name\`, dropdown select \`category\`, input angka \`price\`, textarea \`description\`, dan file input \`image\`.
3. Pada \`resources/views/foods/edit.blade.php\`, sertakan directive \`@method('PUT')\` dan tampilkan foto lama sebagai acuan.
`,
        theorySummary: 'Lupa menuliskan `enctype="multipart/form-data"` adalah penyebab 90% kegagalan upload foto saat ujian Serkom!',
        targetFilePath: 'resources/views/foods/create.blade.php',
        initialCode: `{{-- TODO Step 10: Form Tambah Menu Makanan --}}
`,
        solutionCode: `<div class="py-8 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="bg-white p-6 rounded-xl shadow-sm border">
        <h2 class="text-xl font-bold text-gray-800 mb-4 pb-2 border-b">Tambah Menu Makanan Baru</h2>
        
        <form action="{{ route('foods.store') }}" method="POST" enctype="multipart/form-data" class="space-y-4">
            @csrf
            <div>
                <label class="block font-semibold text-sm text-gray-700 mb-1">Nama Makanan</label>
                <input type="text" name="name" class="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500" required>
            </div>
            <div>
                <label class="block font-semibold text-sm text-gray-700 mb-1">Kategori</label>
                <select name="category" class="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500" required>
                    <option value="Makanan">Makanan</option>
                    <option value="Minuman">Minuman</option>
                    <option value="Cemilan">Cemilan</option>
                </select>
            </div>
            <div>
                <label class="block font-semibold text-sm text-gray-700 mb-1">Harga (Rp)</label>
                <input type="number" name="price" class="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500" required>
            </div>
            <div>
                <label class="block font-semibold text-sm text-gray-700 mb-1">Deskripsi Makanan</label>
                <textarea name="description" rows="3" class="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500" required></textarea>
            </div>
            <div>
                <label class="block font-semibold text-sm text-gray-700 mb-1">Foto Makanan (Opsional)</label>
                <input type="file" name="image" accept="image/*" class="w-full border rounded-lg p-2 text-sm">
            </div>
            <div class="pt-4 flex justify-end gap-3">
                <a href="{{ route('foods.index') }}" class="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-100 font-semibold text-sm">Batal</a>
                <button type="submit" class="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold text-sm shadow transition">Simpan Menu</button>
            </div>
        </form>
    </div>
</div>
`,
        criteria: [
          {
            id: 'c10-1',
            description: 'Gunakan atribut enctype="multipart/form-data" pada form create.blade.php',
            type: 'code_edit',
            targetPath: 'resources/views/foods/create.blade.php',
            isCompleted: false,
          },
          {
            id: 'c10-2',
            description: 'Sertakan input name, category select, price, description, dan image',
            type: 'code_edit',
            targetPath: 'resources/views/foods/create.blade.php',
            isCompleted: false,
          },
        ],
        validationRules: {
          requiredPatterns: [
            'enctype="multipart/form-data"',
            '@csrf',
            'name="name"',
            'name="category"',
            'name="price"',
            'name="description"',
            'name="image"',
          ],
          missingMessageMap: {
            'enctype="multipart/form-data"': 'Wajib sertakan enctype="multipart/form-data" untuk unggah gambar',
            '@csrf': 'Wajib menyertakan token @csrf',
            'name="name"': 'Input name="name" belum ditemukan',
            'name="category"': 'Pilihan select name="category" belum ditemukan',
            'name="price"': 'Input number name="price" belum ditemukan',
            'name="description"': 'Input textarea name="description" belum ditemukan',
            'name="image"': 'Input file name="image" belum ditemukan',
          },
        },
        hints: [
          'Pastikan atribut form: <form action="{{ route(\'foods.store\') }}" method="POST" enctype="multipart/form-data">',
          'Sertakan seluruh nama input sesuai skema database.',
        ],
        defaultPreviewRoute: '/admin/foods/create',
        preferredTab: 'preview',
      },
    ],
  },

  // =========================================================================
  // MODUL 3: SISI PELANGGAN (KATALOG MENU & CHECKOUT TRANSAKSI)
  // =========================================================================
  {
    id: 3,
    title: 'Modul 3: Sisi Pelanggan & Checkout Transaksi',
    subtitle: 'Katalog interaktif, filter kategori JavaScript, modal konfirmasi, dan transaksi DB multi-tabel.',
    estimatedTime: '25 Menit',
    badge: 'Database Transaction',
    steps: [
      {
        id: 'm3-step-11',
        moduleId: 3,
        stepNumber: 11,
        title: 'Controller Pemesanan & DB::transaction',
        subtitle: 'Logika transaksi multi-tabel aman dengan beginTransaction, commit, dan rollBack',
        descriptionMarkdown: `### 🎯 Instruksi Langkah 11:
Buka \`app/Http/Controllers/OrderController.php\` dan buat method \`store(Request $request)\`:
1. Validasi input: \`customer_name\`, \`table_number\`, dan array \`items\`.
2. Saring item dengan jumlah pesanan > 0 menggunakan \`array_filter\`.
3. Bungkus pembuatan pesanan dengan \`DB::beginTransaction()\`:
   - Buat order induk \`Order::create([... 'total_price' => 0, 'status' => 'pending'])\`.
   - Looping setiap item: ambil harga satuan, hitung subtotal (\`price * quantity\`), buat \`OrderDetail::create([...])\`.
   - Perbarui \`$order->update(['total_price' => $totalPrice])\`.
   - Eksekusi \`DB::commit()\`.
4. Bila terjadi kesalahan, tangkap di \`catch (\\Exception $e)\` dan panggil \`DB::rollBack()\`.
`,
        theorySummary: 'Database Transaction memastikan jika ada 1 saja detail item yang gagal disimpan, seluruh pesanan dibatalkan sehingga database tidak korup atau selisih nominal uang.',
        targetFilePath: 'app/Http/Controllers/OrderController.php',
        initialCode: `<?php

namespace App\\Http\\Controllers;

use App\\Models\\Food;
use App\\Models\\Order;
use App\\Models\\OrderDetail;
use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\DB;

class OrderController extends Controller
{
    // TODO Step 11: Implementasikan method index() dan store() dengan DB::transaction
}
`,
        solutionCode: `<?php

namespace App\\Http\\Controllers;

use App\\Models\\Food;
use App\\Models\\Order;
use App\\Models\\OrderDetail;
use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\DB;

class OrderController extends Controller
{
    public function index()
    {
        $foods = Food::all();
        return view('customer.index', compact('foods'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'customer_name' => 'required|string|max:255',
            'table_number'  => 'required|integer|min:1',
            'items'         => 'required|array',
            'items.*'       => 'nullable|integer|min:0',
        ]);

        $orderedItems = array_filter($request->items, fn ($qty) => $qty > 0);

        if (empty($orderedItems)) {
            return back()->with('error', 'Pilih minimal satu menu makanan!');
        }

        DB::beginTransaction();
        try {
            $order = Order::create([
                'customer_name' => $request->customer_name,
                'table_number'  => $request->table_number,
                'total_price'   => 0,
                'status'        => 'pending',
            ]);

            $totalPrice = 0;

            foreach ($orderedItems as $foodId => $quantity) {
                $food = Food::findOrFail($foodId);
                $subtotal = $food->price * $quantity;
                $totalPrice += $subtotal;

                OrderDetail::create([
                    'order_id' => $order->id,
                    'food_id'  => $food->id,
                    'quantity' => $quantity,
                    'subtotal' => $subtotal,
                ]);
            }

            $order->update(['total_price' => $totalPrice]);
            DB::commit();

            return redirect()->route('customer.index')->with('success', 'Pesanan berhasil dibuat! Nomor Meja: ' . $order->table_number);
        } catch (\\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Gagal memproses pesanan: ' . $e->getMessage());
        }
    }
}
`,
        criteria: [
          {
            id: 'c11-1',
            description: 'Gunakan DB::beginTransaction(), DB::commit(), dan DB::rollBack()',
            type: 'code_edit',
            targetPath: 'app/Http/Controllers/OrderController.php',
            isCompleted: false,
          },
          {
            id: 'c11-2',
            description: 'Hitung subtotal = food->price * quantity dan simpan ke OrderDetail',
            type: 'code_edit',
            targetPath: 'app/Http/Controllers/OrderController.php',
            isCompleted: false,
          },
        ],
        validationRules: {
          requiredPatterns: [
            'DB::beginTransaction()',
            'DB::commit()',
            'DB::rollBack()',
            'Order::create',
            'OrderDetail::create',
            '$totalPrice',
          ],
          missingMessageMap: {
            'DB::beginTransaction()': 'Wajib memanggil DB::beginTransaction() sebelum membuat order',
            'DB::commit()': 'Wajib memanggil DB::commit() jika looping berhasil',
            'DB::rollBack()': 'Wajib memanggil DB::rollBack() di dalam blok catch',
            'Order::create': 'Data order induk belum dibuat dengan Order::create',
            'OrderDetail::create': 'Rincian belum disimpan dengan OrderDetail::create',
            '$totalPrice': 'Perhitungan total harga $totalPrice belum diakumulasikan',
          },
        },
        hints: [
          'Awali dengan DB::beginTransaction(); di dalam try block.',
          'Akhiri looping dengan $order->update([\'total_price\' => $totalPrice]); lalu DB::commit();',
        ],
        preferredTab: 'terminal',
      },

      {
        id: 'm3-step-12',
        moduleId: 3,
        stepNumber: 12,
        title: 'Tampilan Katalog Pelanggan & Filter Kategori',
        subtitle: 'Buat tombol filter kategori (Semua, Makanan, Minuman, Cemilan) dengan JavaScript dinamis',
        descriptionMarkdown: `### 🎯 Instruksi Langkah 12:
Buka \`resources/views/customer/index.blade.php\` dan buat:
1. Tombol filter kategori: \`Semua Menu\`, \`Makanan\`, \`Minuman\`, \`Cemilan\` yang memicu \`filterCategory(cat, this)\`.
2. Grid kartu makanan dengan atribut \`data-category="{{ $food->category }}"\`.
3. Input nomor meja dan nama pelanggan.
`,
        theorySummary: 'Atribut `data-category` pada kartu menu memungkinkan fungsi JavaScript sederhana menyembunyikan atau menampilkan kartu secara instan tanpa reload halaman.',
        targetFilePath: 'resources/views/customer/index.blade.php',
        initialCode: `{{-- TODO Step 12 & 13: Katalog Pelanggan & JavaScript Modal Checkout --}}
`,
        solutionCode: `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Menu Restoran</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 p-6 font-sans">
    <div class="max-w-5xl mx-auto">
        <div class="text-center mb-6">
            <h1 class="text-3xl font-bold text-gray-800">Katalog Menu Restoran</h1>
            <p class="text-gray-500 text-sm mt-1">Pilih menu lezat dan masukkan nomor meja Anda</p>
        </div>

        <!-- FILTER KATEGORI -->
        <div class="flex flex-wrap justify-center gap-3 mb-8">
            <button type="button" onclick="filterCategory('all', this)" class="btn-category px-5 py-2 rounded-full font-semibold text-sm bg-blue-600 text-white shadow-md">Semua Menu</button>
            <button type="button" onclick="filterCategory('Makanan', this)" class="btn-category px-5 py-2 rounded-full font-semibold text-sm bg-white text-gray-600 hover:bg-gray-200 border">Makanan</button>
            <button type="button" onclick="filterCategory('Minuman', this)" class="btn-category px-5 py-2 rounded-full font-semibold text-sm bg-white text-gray-600 hover:bg-gray-200 border">Minuman</button>
            <button type="button" onclick="filterCategory('Cemilan', this)" class="btn-category px-5 py-2 rounded-full font-semibold text-sm bg-white text-gray-600 hover:bg-gray-200 border">Cemilan</button>
        </div>

        <form id="orderForm" action="{{ route('customer.checkout') }}" method="POST">
            @csrf
            <!-- Informasi Pemesan -->
            <div class="bg-white p-6 rounded-xl shadow-sm border mb-6">
                <h2 class="text-lg font-bold text-gray-700 mb-4 pb-2 border-b">1. Informasi Pemesan</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-semibold text-gray-600 mb-1">Nama Lengkap</label>
                        <input type="text" id="customer_name" name="customer_name" required placeholder="Nama Anda" class="w-full border rounded-lg px-4 py-2">
                    </div>
                    <div>
                        <label class="block text-sm font-semibold text-gray-600 mb-1">Nomor Meja</label>
                        <input type="number" id="table_number" name="table_number" required placeholder="Contoh: 05" class="w-full border rounded-lg px-4 py-2">
                    </div>
                </div>
            </div>

            <!-- Pilih Menu -->
            <h2 class="text-lg font-bold text-gray-700 mb-4">2. Pilih Menu</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                @foreach($foods as $food)
                    <div class="food-card bg-white rounded-xl shadow-sm border overflow-hidden flex flex-col justify-between" data-category="{{ $food->category }}">
                        <div>
                            @if($food->image)
                                <img src="{{ asset('storage/' . $food->image) }}" alt="{{ $food->name }}" class="w-full h-40 object-cover">
                            @else
                                <div class="bg-gray-200 h-40 flex items-center justify-center text-gray-400 font-medium">Tanpa Gambar</div>
                            @endif
                            <div class="p-4">
                                <div class="flex justify-between items-center mb-2">
                                    <span class="text-xs bg-blue-100 text-blue-700 font-semibold px-2.5 py-0.5 rounded">{{ $food->category }}</span>
                                    <span class="font-bold text-green-600">Rp {{ number_format($food->price) }}</span>
                                </div>
                                <h3 class="font-bold text-gray-800 text-lg">{{ $food->name }}</h3>
                                <p class="text-xs text-gray-500 mt-1 line-clamp-2">{{ $food->description }}</p>
                            </div>
                        </div>
                        <div class="p-4 bg-gray-50 border-t">
                            <label class="block text-xs font-semibold text-gray-500 mb-1">Jumlah Porsi</label>
                            <input type="number" name="items[{{ $food->id }}]" min="0" value="0" data-name="{{ $food->name }}" data-price="{{ $food->price }}" class="item-qty w-full border rounded-lg px-3 py-1.5 text-center font-bold text-gray-700">
                        </div>
                    </div>
                @endforeach
            </div>
        </form>
    </div>

    <script>
        function filterCategory(category, element) {
            document.querySelectorAll('.btn-category').forEach(btn => {
                btn.className = "btn-category px-5 py-2 rounded-full font-semibold text-sm transition bg-white text-gray-600 hover:bg-gray-200 border";
            });
            element.className = "btn-category px-5 py-2 rounded-full font-semibold text-sm transition bg-blue-600 text-white shadow-md";
            const cards = document.querySelectorAll('.food-card');
            cards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                card.style.display = (category === 'all' || cardCategory === category) ? 'flex' : 'none';
            });
        }
    </script>
</body>
</html>
`,
        criteria: [
          {
            id: 'c12-1',
            description: 'Buat fungsi JavaScript filterCategory dan tombol filter kategori',
            type: 'code_edit',
            targetPath: 'resources/views/customer/index.blade.php',
            isCompleted: false,
          },
          {
            id: 'c12-2',
            description: 'Sertakan kartu makanan ber-atribut data-category="{{ $food->category }}"',
            type: 'code_edit',
            targetPath: 'resources/views/customer/index.blade.php',
            isCompleted: false,
          },
        ],
        validationRules: {
          requiredPatterns: [
            'function filterCategory(category, element)',
            'data-category="{{ $food->category }}"',
            'class="food-card',
            'name="customer_name"',
            'name="table_number"',
          ],
          missingMessageMap: {
            'function filterCategory(category, element)': 'Fungsi filterCategory(category, element) belum dibuat',
            'data-category="{{ $food->category }}"': 'Atribut data-category="{{ $food->category }}" wajib disematkan pada setiap kartu menu',
            'class="food-card': 'Kartu menu wajib memiliki class "food-card"',
            'name="customer_name"': 'Input nama pemesan name="customer_name" belum ditemukan',
            'name="table_number"': 'Input nomor meja name="table_number" belum ditemukan',
          },
        },
        hints: [
          'Gunakan querySelectorAll(\'.food-card\') untuk memeriksa atribut data-category.',
          'Tombol kategori mengubah display kartu menu menjadi \'flex\' atau \'none\'.',
        ],
        defaultPreviewRoute: '/',
        preferredTab: 'preview',
      },

      {
        id: 'm3-step-13',
        moduleId: 3,
        stepNumber: 13,
        title: 'Modal Konfirmasi Pesanan & Kalkulasi Total',
        subtitle: 'Hitung subtotal dinamis dan tampilkan popup rincian pesanan sebelum submit',
        descriptionMarkdown: `### 🎯 Instruksi Langkah 13:
Di dalam \`resources/views/customer/index.blade.php\`, tambahkan modal konfirmasi pesanan:
1. Tombol "Pesan Sekarang" bertipe \`button\` memanggil \`showConfirmationModal()\`.
2. Fungsi \`showConfirmationModal()\` memvalidasi nama & meja, menghitung grand total dari seluruh \`.item-qty\`, dan menampilkan rincian dalam modal.
3. Modal diletakkan **di dalam tag \`<form>\`** sehingga tombol "Ya, Kirim Pesanan" bertipe \`submit\` dapat langsung mengirim data form.
`,
        theorySummary: 'Meletakkan modal konfirmasi di dalam tag `<form>` adalah rahasia praktis agar tidak perlu AJAX atau script transfer form yang rumit!',
        targetFilePath: 'resources/views/customer/index.blade.php',
        initialCode: `// Masih menggunakan kode Step 12 tanpa modal...
`,
        solutionCode: `<!-- Tambahkan potongan modal ini sebelum penutup </form> pada customer/index.blade.php -->
<div class="mt-8 text-right">
    <button type="button" onclick="showConfirmationModal()" class="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-xl shadow-md transition">Pesan Sekarang</button>
</div>

<div id="confirmModal" class="fixed inset-0 bg-black/50 hidden items-center justify-center z-50 p-4">
    <div class="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
        <h3 class="text-xl font-bold text-gray-800 border-b pb-3 mb-4">Konfirmasi Pesanan</h3>
        <div class="space-y-2 text-sm text-gray-600 mb-4">
            <div class="flex justify-between"><span class="font-semibold">Nama:</span> <span id="modalName" class="text-gray-900 font-bold"></span></div>
            <div class="flex justify-between"><span class="font-semibold">No. Meja:</span> <span id="modalTable" class="text-gray-900 font-bold"></span></div>
        </div>
        <div class="border-t border-b py-3 mb-4 max-h-48 overflow-y-auto">
            <p class="font-semibold text-xs text-gray-400 uppercase mb-2">Rincian Item</p>
            <ul id="modalItemList" class="space-y-2 text-sm"></ul>
        </div>
        <div class="flex justify-between items-center text-lg font-bold text-gray-800 mb-6">
            <span>Total Pembayaran:</span>
            <span id="modalTotalPrice" class="text-green-600 text-xl font-bold">Rp 0</span>
        </div>
        <div class="flex gap-3">
            <button type="button" onclick="closeConfirmationModal()" class="w-1/2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2.5 rounded-xl transition">Batal</button>
            <button type="submit" class="w-1/2 bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 rounded-xl shadow transition">Ya, Kirim Pesanan</button>
        </div>
    </div>
</div>
`,
        criteria: [
          {
            id: 'c13-1',
            description: 'Tambahkan modal konfirmasi #confirmModal dan fungsi showConfirmationModal()',
            type: 'code_edit',
            targetPath: 'resources/views/customer/index.blade.php',
            isCompleted: false,
          },
        ],
        validationRules: {
          requiredPatterns: [
            'id="confirmModal"',
            'showConfirmationModal()',
            'closeConfirmationModal()',
            'id="modalTotalPrice"',
            'type="submit"',
          ],
          missingMessageMap: {
            'id="confirmModal"': 'Elemen modal dengan id="confirmModal" belum ditemukan',
            'showConfirmationModal()': 'Fungsi JavaScript showConfirmationModal() belum didefinisikan',
            'closeConfirmationModal()': 'Fungsi JavaScript closeConfirmationModal() belum didefinisikan',
            'id="modalTotalPrice"': 'Elemen penampil total harga id="modalTotalPrice" belum ada',
            'type="submit"': 'Tombol konfirmasi di modal harus bertipe type="submit"',
          },
        },
        hints: [
          'Pastikan ada tombol type="button" onclick="showConfirmationModal()".',
          'Tombol pengirim formulir di dalam modal harus type="submit".',
        ],
        defaultPreviewRoute: '/',
        preferredTab: 'preview',
      },

      {
        id: 'm3-step-14',
        moduleId: 3,
        stepNumber: 14,
        title: 'Uji Coba Checkout Interaktif di Live Preview',
        subtitle: 'Praktekkan pemesanan menu makanan secara langsung di panel simulator sebelah kanan',
        descriptionMarkdown: `### 🎯 Instruksi Langkah 14:
Mari buktikan fitur ini bekerja langsung di panel **Live Preview** sebelah kanan:
1. Masukkan Nama Lengkap: \`Budi\` dan Nomor Meja: \`04\`.
2. Tambahkan jumlah porsi minimal 1 menu makanan (misal: 2 Nasi Goreng Spesial).
3. Klik tombol **Pesan Sekarang** (perhatikan animasi sorotan lampu biru).
4. Di modal konfirmasi yang muncul, klik **Ya, Kirim Pesanan**.
`,
        theorySummary: 'Pengujian langsung mensimulasikan apa yang akan diperiksa oleh Asesor di meja ujian.',
        criteria: [
          {
            id: 'c14-1',
            description: 'Lakukan checkout pesanan uji coba di panel Live Preview',
            type: 'ui_action',
            isCompleted: false,
          },
        ],
        spotlightTarget: '#btn-order-checkout',
        hints: [
          'Gunakan panel Live Preview di kanan.',
          'Isi nama dan nomor meja, ubah qty > 0, lalu klik tombol biru "Pesan Sekarang".',
        ],
        defaultPreviewRoute: '/',
        preferredTab: 'preview',
      },
    ],
  },

  // =========================================================================
  // MODUL 4: DASHBOARD ADMIN REKAP PESANAN & MANAJEMEN RUTE
  // =========================================================================
  {
    id: 4,
    title: 'Modul 4: Dashboard Admin & Monitoring Rute',
    subtitle: 'Manajemen rute terpadu, query Eager Loading, tabel rekap pesanan, dan realtime patch status.',
    estimatedTime: '20 Menit',
    badge: 'Monitoring & Rute',
    steps: [
      {
        id: 'm4-step-15',
        moduleId: 4,
        stepNumber: 15,
        title: 'Penyusunan Rute Terpadu routes/web.php',
        subtitle: 'Pisahkan rute publik pelanggan dan grup middleware auth untuk admin',
        descriptionMarkdown: `### 🎯 Instruksi Langkah 15:
Buka file \`routes/web.php\` dan atur arsitektur rute:
1. Rute Publik Pelanggan:
   - \`Route::get('/', [OrderController::class, 'index'])->name('customer.index');\`
   - \`Route::post('/checkout', [OrderController::class, 'store'])->name('customer.checkout');\`
2. Rute Dashboard Utama:
   - \`Route::get('/dashboard', [OrderController::class, 'adminDashboard'])->middleware(['auth'])->name('dashboard');\`
3. Grup Admin Auth (\`Route::middleware('auth')->group(...)\`):
   - \`Route::get('/admin/dashboard', [OrderController::class, 'adminDashboard'])->name('admin.dashboard');\`
   - \`Route::patch('/admin/orders/{id}/status', [OrderController::class, 'updateStatus'])->name('admin.orders.updateStatus');\`
   - \`Route::resource('/admin/foods', FoodController::class);\`
`,
        theorySummary: 'Mengelompokkan rute admin di dalam `Route::middleware(\'auth\')->group(...)` menjamin tidak ada orang asing yang bisa melihat atau mengubah status pesanan.',
        targetFilePath: 'routes/web.php',
        initialCode: `<?php

use Illuminate\\Support\\Facades\\Route;
use App\\Http\\Controllers\\FoodController;
use App\\Http\\Controllers\\OrderController;

// TODO Step 15: Susun rute publik dan grup admin auth
Route::get('/', function () {
    return view('welcome');
});
`,
        solutionCode: `<?php

use Illuminate\\Support\\Facades\\Route;
use App\\Http\\Controllers\\FoodController;
use App\\Http\\Controllers\\OrderController;

Route::get('/', [OrderController::class, 'index'])->name('customer.index');
Route::post('/checkout', [OrderController::class, 'store'])->name('customer.checkout');

Route::get('/dashboard', [OrderController::class, 'adminDashboard'])
    ->middleware(['auth'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/admin/dashboard', [OrderController::class, 'adminDashboard'])->name('admin.dashboard');
    Route::patch('/admin/orders/{id}/status', [OrderController::class, 'updateStatus'])->name('admin.orders.updateStatus');
    Route::resource('/admin/foods', FoodController::class);
});
`,
        criteria: [
          {
            id: 'c15-1',
            description: 'Daftarkan rute publik "/" dan "/checkout" mengarah ke OrderController',
            type: 'code_edit',
            targetPath: 'routes/web.php',
            isCompleted: false,
          },
          {
            id: 'c15-2',
            description: 'Buat grup Route::middleware("auth") berisi /admin/dashboard, status update, dan resource foods',
            type: 'code_edit',
            targetPath: 'routes/web.php',
            isCompleted: false,
          },
        ],
        validationRules: {
          requiredPatterns: [
            "[OrderController::class, 'index']",
            "[OrderController::class, 'store']",
            "Route::middleware('auth')->group",
            "Route::patch('/admin/orders/{id}/status'",
            "Route::resource('/admin/foods', FoodController::class)",
          ],
          missingMessageMap: {
            "[OrderController::class, 'index']": 'Rute "/" wajib mengarah ke [OrderController::class, \'index\']',
            "[OrderController::class, 'store']": 'Rute "/checkout" wajib mengarah ke [OrderController::class, \'store\']',
            "Route::middleware('auth')->group": 'Grup middleware auth wajib dibuat: Route::middleware(\'auth\')->group(...)',
            "Route::patch('/admin/orders/{id}/status'": 'Rute update status pesanan PATCH belum terdaftar',
            "Route::resource('/admin/foods', FoodController::class)": 'Rute resource foods belum terdaftar di dalam grup auth',
          },
        },
        hints: [
          'Gunakan Route::patch(\'/admin/orders/{id}/status\', [OrderController::class, \'updateStatus\'])',
          'Pastikan Route::resource(\'/admin/foods\', FoodController::class) berada di dalam grup auth.',
        ],
        preferredTab: 'terminal',
      },

      {
        id: 'm4-step-16',
        moduleId: 4,
        stepNumber: 16,
        title: 'Controller Rekap & Eager Loading',
        subtitle: 'Cegah N+1 Query Problem dengan Order::with("orderDetails.food") dan method updateStatus',
        descriptionMarkdown: `### 🎯 Instruksi Langkah 16:
Lengkapi \`app/Http/Controllers/OrderController.php\` dengan 2 method admin:
1. \`adminDashboard()\`:
   \`\`\`php
   public function adminDashboard()
   {
       $orders = Order::with('orderDetails.food')->latest()->get();
       return view('dashboard', compact('orders'));
   }
   \`\`\`
2. \`updateStatus(Request $request, $id)\`:
   \`\`\`php
   public function updateStatus(Request $request, $id)
   {
       $request->validate(['status' => 'required|string']);
       $order = Order::findOrFail($id);
       $order->update(['status' => $request->status]);

       return back()->with('success', 'Status pesanan #' . $order->id . ' berhasil diperbarui!');
   }
   \`\`\`
`,
        theorySummary: 'Query `with(\'orderDetails.food\')` adalah Eager Loading yang mengambil pesanan, detailnya, dan nama makanan dalam 1 tarikan query efisien, bukan puluhan query lambat.',
        targetFilePath: 'app/Http/Controllers/OrderController.php',
        initialCode: `// Tambahkan adminDashboard() dan updateStatus() di OrderController.php...
`,
        solutionCode: `    public function adminDashboard()
    {
        $orders = Order::with('orderDetails.food')->latest()->get();
        return view('dashboard', compact('orders'));
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate(['status' => 'required|string']);
        $order = Order::findOrFail($id);
        $order->update(['status' => $request->status]);

        return back()->with('success', 'Status pesanan #' . $order->id . ' berhasil diperbarui!');
    }
`,
        criteria: [
          {
            id: 'c16-1',
            description: 'Implementasikan adminDashboard() dengan Order::with("orderDetails.food")->latest()->get()',
            type: 'code_edit',
            targetPath: 'app/Http/Controllers/OrderController.php',
            isCompleted: false,
          },
          {
            id: 'c16-2',
            description: 'Implementasikan updateStatus(Request $request, $id) untuk update kolom status',
            type: 'code_edit',
            targetPath: 'app/Http/Controllers/OrderController.php',
            isCompleted: false,
          },
        ],
        validationRules: {
          requiredPatterns: [
            "Order::with('orderDetails.food')",
            'public function adminDashboard()',
            'public function updateStatus(Request $request, $id)',
            '$order->update([\'status\' => $request->status])',
          ],
          missingMessageMap: {
            "Order::with('orderDetails.food')": 'Eager Loading Order::with(\'orderDetails.food\') wajib digunakan',
            'public function adminDashboard()': 'Method adminDashboard() belum didefinisikan',
            'public function updateStatus(Request $request, $id)': 'Method updateStatus(Request $request, $id) belum didefinisikan',
            '$order->update([\'status\' => $request->status])': 'Baris update status $order->update([\'status\' => $request->status]) belum ada',
          },
        },
        hints: [
          'Gunakan $orders = Order::with(\'orderDetails.food\')->latest()->get();',
          'Di updateStatus, cari order dengan findOrFail($id) lalu update statusnya.',
        ],
        preferredTab: 'terminal',
      },

      {
        id: 'm4-step-17',
        moduleId: 4,
        stepNumber: 17,
        title: 'Tampilan Dashboard Rekap Pesanan (Admin)',
        subtitle: 'Sajikan tabel rekap pesanan, daftar detail item makanan, dan dropdown patch otomatis',
        descriptionMarkdown: `### 🎯 Instruksi Langkah 17:
Buka \`resources/views/dashboard.blade.php\` dan susun tabel rekap pesanan admin:
- Tampilkan ID Pesanan, Nama Pelanggan, Nomor Meja.
- Tampilkan rincian pesanan dengan looping \`@foreach($order->orderDetails as $detail)\` menampilkan \`{{ $detail->food->name }} x{{ $detail->quantity }}\`.
- Kolom Aksi Status: Form dengan \`@method('PATCH')\` dan dropdown select yang otomatis submit saat diganti (\`onchange="this.form.submit()"\`).
`,
        theorySummary: 'Atribut `onchange="this.form.submit()"` mempermudah kasir/admin: cukup pilih status di dropdown, halaman otomatis mengupdate database seketika.',
        targetFilePath: 'resources/views/dashboard.blade.php',
        initialCode: `{{-- TODO Step 17: Dashboard Rekap Pesanan Admin --}}
`,
        solutionCode: `<div class="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">Daftar Pesanan Masuk (Monitoring)</h2>
        <div class="flex gap-2">
            <a href="{{ route('foods.index') }}" class="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm">Kelola Menu</a>
            <a href="{{ route('customer.index') }}" target="_blank" class="bg-gray-800 hover:bg-gray-700 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm">Katalog Customer</a>
        </div>
    </div>

    @if(session('success'))
        <div class="mb-4 p-4 bg-green-100 border-l-4 border-green-500 text-green-700 rounded font-medium">{{ session('success') }}</div>
    @endif

    <div class="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-200">
        <table class="w-full text-left border-collapse">
            <thead class="bg-gray-100 text-gray-700 uppercase text-xs">
                <tr>
                    <th class="p-4 border-b"># ID</th>
                    <th class="p-4 border-b">Pelanggan</th>
                    <th class="p-4 border-b">No. Meja</th>
                    <th class="p-4 border-b">Rincian Pesanan</th>
                    <th class="p-4 border-b">Total Harga</th>
                    <th class="p-4 border-b">Status</th>
                    <th class="p-4 border-b text-center">Aksi Status</th>
                </tr>
            </thead>
            <tbody class="divide-y text-sm">
                @forelse($orders as $order)
                <tr class="hover:bg-gray-50">
                    <td class="p-4 font-bold text-gray-700">#{{ $order->id }}</td>
                    <td class="p-4 font-medium">{{ $order->customer_name }}</td>
                    <td class="p-4"><span class="bg-blue-100 text-blue-800 font-bold px-2.5 py-1 rounded-full text-xs">Meja {{ $order->table_number }}</span></td>
                    <td class="p-4">
                        <ul class="list-disc list-inside space-y-1 text-gray-600">
                            @foreach($order->orderDetails as $detail)
                                <li><strong>{{ $detail->food->name ?? 'Menu' }}</strong> x{{ $detail->quantity }} <span class="text-xs text-gray-400">(Rp {{ number_format($detail->subtotal) }})</span></li>
                            @endforeach
                        </ul>
                    </td>
                    <td class="p-4 font-bold text-green-600">Rp {{ number_format($order->total_price) }}</td>
                    <td class="p-4">
                        @if(strtolower($order->status) == 'pending')
                            <span class="bg-yellow-100 text-yellow-800 text-xs font-bold px-2.5 py-1 rounded">PENDING</span>
                        @elseif(strtolower($order->status) == 'completed' || strtolower($order->status) == 'selesai')
                            <span class="bg-green-100 text-green-800 text-xs font-bold px-2.5 py-1 rounded">SELESAI</span>
                        @else
                            <span class="bg-red-100 text-red-800 text-xs font-bold px-2.5 py-1 rounded">{{ strtoupper($order->status) }}</span>
                        @endif
                    </td>
                    <td class="p-4 text-center">
                        <form action="{{ route('admin.orders.updateStatus', $order->id) }}" method="POST">
                            @csrf
                            @method('PATCH')
                            <select name="status" onchange="this.form.submit()" class="text-xs border border-gray-300 rounded p-1.5 bg-white shadow-sm font-semibold">
                                <option value="pending" {{ strtolower($order->status) == 'pending' ? 'selected' : '' }}>Pending</option>
                                <option value="completed" {{ strtolower($order->status) == 'completed' || strtolower($order->status) == 'selesai' ? 'selected' : '' }}>Selesai / Lunas</option>
                                <option value="cancelled" {{ strtolower($order->status) == 'cancelled' || strtolower($order->status) == 'batal' ? 'selected' : '' }}>Batalkan</option>
                            </select>
                        </form>
                    </td>
                </tr>
                @empty
                <tr><td colspan="7" class="p-6 text-center text-gray-500">Belum ada pesanan masuk.</td></tr>
                @endforelse
            </tbody>
        </table>
    </div>
</div>
`,
        criteria: [
          {
            id: 'c17-1',
            description: 'Tampilkan perulangan @forelse($orders as $order) dan nested loop @foreach($order->orderDetails as $detail)',
            type: 'code_edit',
            targetPath: 'resources/views/dashboard.blade.php',
            isCompleted: false,
          },
          {
            id: 'c17-2',
            description: 'Sertakan form PATCH status dengan select onchange="this.form.submit()"',
            type: 'code_edit',
            targetPath: 'resources/views/dashboard.blade.php',
            isCompleted: false,
          },
        ],
        validationRules: {
          requiredPatterns: [
            '@forelse($orders as $order)',
            '@foreach($order->orderDetails as $detail)',
            '@method(\'PATCH\')',
            'onchange="this.form.submit()"',
          ],
          missingMessageMap: {
            '@forelse($orders as $order)': 'Gunakan @forelse($orders as $order) untuk merender baris pesanan',
            '@foreach($order->orderDetails as $detail)': 'Gunakan @foreach($order->orderDetails as $detail) untuk rincian item pesanan',
            '@method(\'PATCH\')': 'Form update status harus menggunakan @method(\'PATCH\')',
            'onchange="this.form.submit()"': 'Select status harus memiliki atribut onchange="this.form.submit()"',
          },
        },
        hints: [
          'Looping detail: @foreach($order->orderDetails as $detail)...',
          'Gunakan tag <select name="status" onchange="this.form.submit()"> di dalam form PATCH.',
        ],
        defaultPreviewRoute: '/dashboard',
        preferredTab: 'preview',
      },

      {
        id: 'm4-step-18',
        moduleId: 4,
        stepNumber: 18,
        title: 'Uji Update Status Realtime di Live Preview',
        subtitle: 'Ubah status pesanan pelanggan dari Pending menjadi Selesai / Lunas langsung di antarmuka',
        descriptionMarkdown: `### 🎯 Instruksi Langkah 18:
1. Perhatikan panel **Live Preview** sebelah kanan yang saat ini membuka rute \`/dashboard\` (Admin).
2. Temukan pesanan dengan status **PENDING** (warna kuning).
3. Pada kolom **Aksi Status**, ubah pilihan dropdown menjadi **Selesai / Lunas**.
4. Amati perubahan instan: badge status otomatis berubah menjadi hijau **SELESAI**!
`,
        theorySummary: 'Perubahan status pesanan membuktikan integrasi penuh antara Form, Route PATCH, Controller, dan Database.',
        criteria: [
          {
            id: 'c18-1',
            description: 'Ubah status salah satu pesanan menjadi "completed" di panel Live Preview',
            type: 'ui_action',
            isCompleted: false,
          },
        ],
        spotlightTarget: '#select-order-status-101',
        hints: [
          'Gunakan dropdown status pada baris pesanan di panel Live Preview.',
          'Pilih opsi "Selesai / Lunas".',
        ],
        defaultPreviewRoute: '/dashboard',
        preferredTab: 'preview',
      },

      {
        id: 'm4-step-19',
        moduleId: 4,
        stepNumber: 19,
        title: 'Checklist Pengujian Asesor (100% KOMPETEN)',
        subtitle: 'Verifikasi seluruh 10 poin kriteria penilaian uji kompetensi dan raih sertifikasi',
        descriptionMarkdown: `### 🏆 UJI KOMPETENSI SELESAI (10 Poin Pengujian Asesor):
Selamat! Anda telah mengonstruksi seluruh 4 Modul Aplikasi Pemesanan Makanan:

| No | Fitur yang Diuji | Status |
| :--- | :--- | :--- |
| 1 | Database & Seeder (\`migrate:fresh --seed\`) | ✅ Terpenuhi |
| 2 | Login Admin Breeze (\`admin@gmail.com\`) | ✅ Terpenuhi |
| 3 | CRUD Tambah Menu & Upload Foto | ✅ Terpenuhi |
| 4 | CRUD Edit Menu & Update Foto | ✅ Terpenuhi |
| 5 | CRUD Hapus Menu & Hapus Foto Fisik | ✅ Terpenuhi |
| 6 | Katalog Pelanggan & Filter Kategori JS | ✅ Terpenuhi |
| 7 | Keranjang & Modal Konfirmasi Pesanan | ✅ Terpenuhi |
| 8 | Multi-tabel \`DB::transaction\` Checkout | ✅ Terpenuhi |
| 9 | Monitoring Dashboard Admin Eager Loading | ✅ Terpenuhi |
| 10 | Instant Patch Status Pesanan | ✅ Terpenuhi |

Klik tombol **"Selesaikan Sertifikasi"** di bawah untuk merayakan kelulusan 100% Kompeten Serkom!
`,
        theorySummary: 'Kombinasi ketenangan, pemahaman alur kehidupan data (Fondasi -> Master Data -> Transaksi -> Monitoring), dan pengujian teliti menjamin nilai maksimal saat Serkom.',
        criteria: [
          {
            id: 'c19-1',
            description: 'Verifikasi 10 kriteria pengujian asesor Serkom',
            type: 'ui_action',
            isCompleted: true,
          },
        ],
        hints: [
          'Klik tombol Selesaikan Sertifikasi untuk menyelesaikan seluruh simulasi!',
        ],
        defaultPreviewRoute: '/dashboard',
        preferredTab: 'preview',
      },
    ],
  },
];
