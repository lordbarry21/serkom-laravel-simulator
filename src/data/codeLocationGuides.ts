export interface CodeLocationGuide {
  stepId: string;
  stepNumber: number;
  targetFile: string;
  locationTitle: string;
  locationDetail: string;
  snippetDescription: string;
  snippetToInsert: string;
  tips?: string;
}

export const CODE_LOCATION_GUIDES: Record<string, CodeLocationGuide> = {
  // Step 1: .env
  'm1-step-1': {
    stepId: 'm1-step-1',
    stepNumber: 1,
    targetFile: '.env',
    locationTitle: 'Baris 9 - 14 (Konfigurasi Database)',
    locationDetail:
      'Buka file .env di root proyek. Cari bagian "DB_CONNECTION" dan "DB_DATABASE". Ubah nilainya agar terhubung ke MySQL dengan database "pesanmakan".',
    snippetDescription: 'Pengaturan koneksi MySQL & nama database pesanmakan',
    snippetToInsert: `DB_CONNECTION=mysql\nDB_HOST=127.0.0.1\nDB_PORT=3306\nDB_DATABASE=pesanmakan\nDB_USERNAME=root\nDB_PASSWORD=`,
    tips: 'Pastikan nama database "pesanmakan" huruf kecil semua sesuai panduan modul.',
  },

  // Step 3: Migration foods
  'm1-step-3': {
    stepId: 'm1-step-3',
    stepNumber: 3,
    targetFile: 'database/migrations/2025_01_01_000001_create_foods_table.php',
    locationTitle: 'Di dalam method public function up()',
    locationDetail:
      'Cari fungsi "public function up(): void". Letakkan 5 kolom berikut di dalam "Schema::create(\'foods\', function (Blueprint $table) { ... });" tepat di antara "$table->id();" dan "$table->timestamps();" menggantikan komentar TODO.',
    snippetDescription: 'Skema kolom tabel foods',
    snippetToInsert: `$table->string('name');\n$table->enum('category', ['Makanan', 'Minuman', 'Cemilan']);\n$table->integer('price');\n$table->text('description');\n$table->string('image')->nullable();`,
    tips: 'Kolom image harus nullable() agar data seeder awal yang belum memiliki foto tidak error.',
  },

  // Step 4: Migration orders & order_details
  'm1-step-4': {
    stepId: 'm1-step-4',
    stepNumber: 4,
    targetFile: 'database/migrations/2025_01_01_000003_create_order_details_table.php',
    locationTitle: 'Di dalam method up() pada order_details',
    locationDetail:
      'Buka migrasi order_details. Di dalam "Schema::create(\'order_details\', ...)", tambahkan Foreign Key order_id dan food_id cascade, serta kolom quantity dan subtotal integer.',
    snippetDescription: 'Relasi foreignId cascade & kolom kalkulasi order_details',
    snippetToInsert: `$table->foreignId('order_id')->constrained('orders')->onDelete('cascade');\n$table->foreignId('food_id')->constrained('foods')->onDelete('cascade');\n$table->integer('quantity');\n$table->integer('subtotal');`,
    tips: 'Wajib pasang ->onDelete(\'cascade\') agar jika pesanan dihapus, rinciannya ikut terhapus.',
  },

  // Step 5: Eloquent Model Order & OrderDetail
  'm1-step-5': {
    stepId: 'm1-step-5',
    stepNumber: 5,
    targetFile: 'app/Models/Order.php',
    locationTitle: 'Di dalam class Order extends Model { ... }',
    locationDetail:
      'Buka app/Models/Order.php. Di dalam kurung kurawal class Order (di bawah "use HasFactory;"), tambahkan "$guarded = [\'id\'];" dan method relasi "orderDetails()".',
    snippetDescription: 'Properti $guarded dan relasi hasMany ke OrderDetail',
    snippetToInsert: `protected $guarded = ['id'];\n\npublic function orderDetails()\n{\n    return $this->hasMany(OrderDetail::class, 'order_id');\n}`,
    tips: 'Rumus: Order (induk) ke OrderDetail (anak) menggunakan relasi hasMany().',
  },

  // Step 6: DatabaseSeeder
  'm1-step-6': {
    stepId: 'm1-step-6',
    stepNumber: 6,
    targetFile: 'database/seeders/DatabaseSeeder.php',
    locationTitle: 'Di dalam public function run(): void',
    locationDetail:
      'Buka database/seeders/DatabaseSeeder.php. Di dalam method run(), tambahkan kode pembuatan akun User Admin default dan panggil FoodSeeder.',
    snippetDescription: 'Akun Admin default & pemanggilan FoodSeeder',
    snippetToInsert: `User::create([\n    'name' => 'Admin Toko',\n    'email' => 'admin@gmail.com',\n    'password' => Hash::make('password123'),\n]);\n\n$this->call([\n    FoodSeeder::class,\n]);`,
    tips: 'Password wajib dibungkus Hash::make("password123") agar login Breeze berhasil.',
  },

  // Step 8: FoodController CRUD
  'm1-step-8': {
    stepId: 'm1-step-8',
    stepNumber: 8,
    targetFile: 'app/Http/Controllers/FoodController.php',
    locationTitle: 'Di dalam class FoodController extends Controller',
    locationDetail:
      'Buka app/Http/Controllers/FoodController.php. Implementasikan method index, create, store, edit, update, dan destroy untuk mengelola menu makanan dan upload foto.',
    snippetDescription: 'Method CRUD lengkap dan upload/delete foto fisik',
    snippetToInsert: `public function index()\n{\n    $foods = Food::latest()->paginate(10);\n    return view('foods.index', compact('foods'));\n}\n\npublic function store(Request $request)\n{\n    $validated = $request->validate([\n        'name' => 'required|string|max:255',\n        'category' => 'required|in:Makanan,Minuman,Cemilan',\n        'price' => 'required|integer|min:0',\n        'description' => 'required|string',\n        'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',\n    ]);\n\n    if ($request->hasFile('image')) {\n        $validated['image'] = $request->file('image')->store('foods', 'public');\n    }\n\n    Food::create($validated);\n    return redirect()->route('foods.index')->with('success', 'Menu makanan berhasil ditambahkan');\n}`,
    tips: 'Saat hapus makanan, gunakan Storage::disk("public")->delete($food->image) agar storage bersih.',
  },

  // Step 9: View foods/index.blade.php
  'm2-step-9': {
    stepId: 'm2-step-9',
    stepNumber: 9,
    targetFile: 'resources/views/foods/index.blade.php',
    locationTitle: 'Di dalam <x-app-layout>',
    locationDetail:
      'Buka resources/views/foods/index.blade.php. Di dalam layout, buat tabel yang menampilkan foto (asset storage), nama, kategori, harga rupiah, serta tombol edit dan delete.',
    snippetDescription: 'Tabel daftar makanan admin dengan looping @forelse',
    snippetToInsert: `<table class="w-full text-left">\n    <thead>\n        <tr>\n            <th>Foto</th><th>Nama</th><th>Kategori</th><th>Harga</th><th>Aksi</th>\n        </tr>\n    </thead>\n    <tbody>\n        @forelse($foods as $food)\n        <tr>\n            <td><img src="{{ asset('storage/' . $food->image) }}" class="w-12 h-12 rounded"></td>\n            <td>{{ $food->name }}</td>\n            <td>{{ $food->category }}</td>\n            <td>Rp {{ number_format($food->price, 0, ',', '.') }}</td>\n        </tr>\n        @empty\n        <tr><td colspan="5">Belum ada makanan.</td></tr>\n        @endforelse\n    </tbody>\n</table>`,
  },

  // Step 10: View foods/create.blade.php
  'm2-step-10': {
    stepId: 'm2-step-10',
    stepNumber: 10,
    targetFile: 'resources/views/foods/create.blade.php',
    locationTitle: 'Di dalam form tambah menu',
    locationDetail:
      'Buka resources/views/foods/create.blade.php. Pastikan tag <form> memiliki atribut "enctype=\'multipart/form-data\'" dan input type="file" dengan name="image".',
    snippetDescription: 'Form upload makanan dengan multipart/form-data',
    snippetToInsert: `<form action="{{ route('foods.store') }}" method="POST" enctype="multipart/form-data">\n    @csrf\n    <input type="text" name="name" placeholder="Nama Menu" required>\n    <select name="category">\n        <option value="Makanan">Makanan</option>\n        <option value="Minuman">Minuman</option>\n        <option value="Cemilan">Cemilan</option>\n    </select>\n    <input type="number" name="price" placeholder="Harga" required>\n    <textarea name="description" placeholder="Deskripsi" required></textarea>\n    <input type="file" name="image" accept="image/*">\n    <button type="submit">Simpan Menu</button>\n</form>`,
    tips: 'Tanpa enctype="multipart/form-data", file gambar tidak akan terkirim ke server!',
  },

  // Step 11: OrderController store transaction
  'm3-step-11': {
    stepId: 'm3-step-11',
    stepNumber: 11,
    targetFile: 'app/Http/Controllers/OrderController.php',
    locationTitle: 'Di dalam public function store(Request $request)',
    locationDetail:
      'Buka app/Http/Controllers/OrderController.php. Di method store(), bungkus simpan tabel Order dan OrderDetail di dalam DB::transaction(...) agar atomik.',
    snippetDescription: 'Transaksi penyimpanan pesanan multi-tabel DB::transaction',
    snippetToInsert: `DB::transaction(function () use ($request, &$order) {\n    $order = Order::create([\n        'customer_name' => $request->customer_name,\n        'table_number' => $request->table_number,\n        'total_price' => $request->total_price,\n        'status' => 'pending',\n    ]);\n\n    foreach ($request->items as $item) {\n        $order->orderDetails()->create([\n            'food_id' => $item['food_id'],\n            'quantity' => $item['quantity'],\n            'subtotal' => $item['subtotal'],\n        ]);\n    }\n});`,
    tips: 'DB::transaction menjamin jika salah satu detail gagal, pesanan induk akan di-rollback otomatis.',
  },

  // Step 12: View customer/index.blade.php
  'm3-step-12': {
    stepId: 'm3-step-12',
    stepNumber: 12,
    targetFile: 'resources/views/customer/index.blade.php',
    locationTitle: 'Di dalam view katalog pelanggan',
    locationDetail:
      'Buka resources/views/customer/index.blade.php. Tampilkan menu makanan dengan kartu, tombol filter kategori, dan tombol pesan untuk membuka modal keranjang.',
    snippetDescription: 'Grid kartu menu makanan pelanggan',
    snippetToInsert: `<div class="grid grid-cols-1 md:grid-cols-3 gap-4">\n    @foreach($foods as $food)\n    <div class="card">\n        <img src="{{ asset('storage/' . $food->image) }}">\n        <h3>{{ $food->name }}</h3>\n        <p>Rp {{ number_format($food->price, 0, ',', '.') }}</p>\n    </div>\n    @endforeach\n</div>`,
  },

  // Step 13: routes/web.php
  'm3-step-13': {
    stepId: 'm3-step-13',
    stepNumber: 13,
    targetFile: 'routes/web.php',
    locationTitle: 'Di baris paling bawah routes/web.php',
    locationDetail:
      'Buka routes/web.php. Tambahkan route customer "/" dan "/order", serta group route admin dengan middleware(["auth"]) dan prefix "admin".',
    snippetDescription: 'Definisi Route customer & group admin middleware auth',
    snippetToInsert: `Route::get('/', [OrderController::class, 'customerIndex'])->name('customer.index');\nRoute::post('/order', [OrderController::class, 'store'])->name('orders.store');\n\nRoute::middleware(['auth'])->prefix('admin')->group(function () {\n    Route::resource('foods', FoodController::class);\n    Route::get('/orders', [OrderController::class, 'adminDashboard'])->name('admin.orders');\n    Route::patch('/orders/{order}/status', [OrderController::class, 'updateStatus'])->name('orders.updateStatus');\n});`,
    tips: 'Pastikan route admin dibungkus middleware([\'auth\']) agar tidak bisa diakses publik tanpa login.',
  },

  // Step 15: View admin/orders.blade.php
  'm4-step-15': {
    stepId: 'm4-step-15',
    stepNumber: 15,
    targetFile: 'resources/views/admin/orders.blade.php',
    locationTitle: 'Di dalam tabel pesanan admin',
    locationDetail:
      'Buka resources/views/admin/orders.blade.php. Buat tabel daftar pesanan masuk dengan rincian customer, nomor meja, total harga, dan form update status dropdown.',
    snippetDescription: 'Tabel riwayat pesanan dengan form update status',
    snippetToInsert: `@foreach($orders as $order)\n<tr>\n    <td>#{{ $order->id }}</td>\n    <td>{{ $order->customer_name }}</td>\n    <td>Meja {{ $order->table_number }}</td>\n    <td>Rp {{ number_format($order->total_price, 0, ',', '.') }}</td>\n    <td>\n        <form action="{{ route('orders.updateStatus', $order) }}" method="POST">\n            @csrf @method('PATCH')\n            <select name="status" onchange="this.form.submit()">\n                <option value="pending" {{ $order->status == 'pending' ? 'selected' : '' }}>Pending</option>\n                <option value="completed" {{ $order->status == 'completed' ? 'selected' : '' }}>Completed</option>\n            </select>\n        </form>\n    </td>\n</tr>\n@endforeach`,
  },

  // Step 16: OrderController status update
  'm4-step-16': {
    stepId: 'm4-step-16',
    stepNumber: 16,
    targetFile: 'app/Http/Controllers/OrderController.php',
    locationTitle: 'Di dalam class OrderController (bagian bawah)',
    locationDetail:
      'Buka app/Http/Controllers/OrderController.php. Tambahkan method adminDashboard() dan method updateStatus(Request $request, Order $order).',
    snippetDescription: 'Method adminDashboard() dan updateStatus()',
    snippetToInsert: `public function adminDashboard()\n{\n    $orders = Order::with('orderDetails.food')->latest()->get();\n    return view('admin.orders', compact('orders'));\n}\n\npublic function updateStatus(Request $request, Order $order)\n{\n    $request->validate([\n        'status' => 'required|in:pending,processing,completed,cancelled',\n    ]);\n    $order->update(['status' => $request->status]);\n    return back()->with('success', 'Status pesanan berhasil diperbarui');\n}`,
    tips: 'Gunakan Order::with(\'orderDetails.food\') untuk mencegah N+1 query problem.',
  },

  // Step 17: navigation.blade.php
  'm4-step-17': {
    stepId: 'm4-step-17',
    stepNumber: 17,
    targetFile: 'resources/views/layouts/navigation.blade.php',
    locationTitle: 'Di dalam link navigasi navbar Breeze',
    locationDetail:
      'Buka resources/views/layouts/navigation.blade.php. Di bagian Navigation Links, tambahkan link "Kelola Makanan" (route foods.index) dan "Riwayat Pesanan" (route admin.orders).',
    snippetDescription: 'Tautan menu navigasi admin Breeze',
    snippetToInsert: `<x-nav-link :href="route('foods.index')" :active="request()->routeIs('foods.*')">\n    Kelola Makanan\n</x-nav-link>\n<x-nav-link :href="route('admin.orders')" :active="request()->routeIs('admin.orders')">\n    Daftar Pesanan\n</x-nav-link>`,
  },

  // Step 19: Final route audit
  'm4-step-19': {
    stepId: 'm4-step-19',
    stepNumber: 19,
    targetFile: 'routes/web.php',
    locationTitle: 'Pemeriksaan akhir routes/web.php',
    locationDetail:
      'Pastikan seluruh route tersambung dengan rapi dan aman di bawah auth middleware.',
    snippetDescription: 'Struktur akhir routes/web.php',
    snippetToInsert: `Route::middleware(['auth'])->prefix('admin')->group(function () {\n    Route::resource('foods', FoodController::class);\n    Route::get('/orders', [OrderController::class, 'adminDashboard'])->name('admin.orders');\n    Route::patch('/orders/{order}/status', [OrderController::class, 'updateStatus'])->name('orders.updateStatus');\n});`,
  },
};

export function getCodeLocationGuide(
  stepId: string,
  stepNumber: number
): CodeLocationGuide | null {
  // Check exact ID first
  if (CODE_LOCATION_GUIDES[stepId]) {
    return CODE_LOCATION_GUIDES[stepId];
  }

  // Find by step number
  const found = Object.values(CODE_LOCATION_GUIDES).find(
    (g) => g.stepNumber === stepNumber
  );
  return found || null;
}
