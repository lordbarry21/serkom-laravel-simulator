export interface CheatSheetCommand {
  command: string;
  useCase: string;
  tips: string;
}

export const CHEAT_SHEET_COMMANDS: CheatSheetCommand[] = [
  {
    command: 'composer create-project laravel/laravel pesanmakan',
    useCase: 'Buat project Laravel baru',
    tips: 'Selalu gunakan nama folder huruf kecil tanpa spasi',
  },
  {
    command: 'php artisan make:model Food -mcr',
    useCase: 'Buat Model, Migration, Controller Resource sekaligus',
    tips: 'Singkatan -mcr = Model, Controller, Resource',
  },
  {
    command: 'php artisan make:model Order -mcr',
    useCase: 'Model & Controller untuk Pesanan',
    tips: 'Sama, gunakan flag -mcr',
  },
  {
    command: 'php artisan make:model OrderDetail -m',
    useCase: 'Model & Migration untuk Detail Pesanan',
    tips: 'Hanya -m (karena controllernya digabung ke Order)',
  },
  {
    command: 'php artisan make:seeder FoodSeeder',
    useCase: 'Buat file seeder data makanan',
    tips: 'Nama Seeder wajib berakhiran Seeder',
  },
  {
    command: 'php artisan storage:link',
    useCase: 'Hubungkan folder upload storage ke public',
    tips: 'Wajib dijalankan agar foto menu bisa muncul di browser',
  },
  {
    command: 'php artisan migrate:fresh --seed',
    useCase: 'Reset database dan jalankan seeder',
    tips: 'Gunakan dua tanda strip --seed',
  },
];

export const FOUR_STAGES_MINDMAP = [
  {
    stage: 'Babak 1: Fondasi',
    title: 'Database & Struktur Eloquent',
    color: 'from-blue-600 to-indigo-700',
    summary: 'Komputer butuh wadah data dulu. Buat 3 migration (foods, orders, order_details), pasang relasi Model, dan isi data seeder.',
    items: [
      '.env: DB_DATABASE=pesanmakan',
      'Migration: foods (name, category enum, price, description, image)',
      'Migration: orders (customer_name, table_number, total_price, status)',
      'Migration: order_details (order_id cascade, food_id cascade, quantity, subtotal)',
      'Model Food: protected $table = "foods"; protected $guarded = ["id"];',
      'Model Order: orderDetails() hasMany',
      'Model OrderDetail: food() belongsTo, order() belongsTo',
      'FoodSeeder & DatabaseSeeder (admin@gmail.com / password123)',
    ],
  },
  {
    stage: 'Babak 2: Dapur Admin',
    title: 'Master Data & CRUD Makanan',
    color: 'from-amber-600 to-orange-700',
    summary: 'Siapkan menu makanan yang mau dijual. Pasang Breeze auth, CRUD FoodController lengkap, dan upload foto.',
    items: [
      'Install Laravel Breeze (stack blade) & php artisan storage:link',
      'FoodController@index: latest()->paginate(10)',
      'FoodController@store: validasi, $request->file("image")->store("foods", "public")',
      'FoodController@update: Storage::disk("public")->delete($food->image)',
      'FoodController@destroy: hapus foto fisik dulu baru $food->delete()',
      'Blade: enctype="multipart/form-data" pada form create & edit',
      'Blade: @method("PUT") untuk edit, @method("DELETE") untuk hapus',
    ],
  },
  {
    stage: 'Babak 3: Meja Tamu',
    title: 'Katalog Menu & Transaksi Checkout',
    color: 'from-emerald-600 to-teal-700',
    summary: 'Customer memilih menu makanan dan melakukan checkout. Disimpan dengan database transaction aman.',
    items: [
      'OrderController@index: tampilkan seluruh menu ke publik',
      'OrderController@store: DB::beginTransaction()',
      'Looping item pesanan: hitung subtotal = price * qty',
      'OrderDetail::create() rincian pesanan',
      'Perbarui total harga order induk lalu DB::commit()',
      'catch (\\Exception $e) { DB::rollBack(); }',
      'customer/index.blade.php: filter category javascript',
      'Modal konfirmasi di dalam tag <form> untuk submit instan',
    ],
  },
  {
    stage: 'Babak 4: Monitoring Kasir',
    title: 'Dashboard Rekap & Update Status',
    color: 'from-purple-600 to-pink-700',
    summary: 'Admin memantau pesanan yang masuk dan mengubah status secara realtime.',
    items: [
      'routes/web.php: kelompokkan rute admin di Route::middleware("auth")->group(...)',
      'OrderController@adminDashboard: Order::with("orderDetails.food")->latest()->get()',
      'Mencegah N+1 query problem dengan eager loading with()',
      'OrderController@updateStatus: patch order status',
      'dashboard.blade.php: dropdown <select onchange="this.form.submit()">',
      'Badge status warna: Pending (kuning), Selesai (hijau), Batal (merah)',
    ],
  },
];

export const ASSESSOR_CHECKLIST_FULL = [
  { no: 1, feature: 'Database & Seeder', testScenario: 'Jalankan php artisan migrate:fresh --seed', expected: '3 Tabel terbuat, 1 admin terbuat, 5 menu terisi otomatis tanpa error' },
  { no: 2, feature: 'Login Admin', testScenario: 'Login di /login dengan admin@gmail.com / password123', expected: 'Masuk ke dashboard admin dengan sukses' },
  { no: 3, feature: 'CRUD Tambah Menu', testScenario: 'Buka /admin/foods/create, isi form & upload foto', expected: 'Data masuk ke database dan foto tampil via asset("storage/...")' },
  { no: 4, feature: 'CRUD Edit Menu', testScenario: 'Ubah harga atau ganti foto makanan', expected: 'Data terupdate dan foto lama terhapus dari storage' },
  { no: 5, feature: 'CRUD Hapus Menu', testScenario: 'Klik tombol hapus dengan konfirmasi alert', expected: 'Data terhapus dari tabel dan foto fisik terhapus dari storage' },
  { no: 6, feature: 'Katalog Customer', testScenario: 'Buka http://127.0.0.1:8000/ tanpa login', expected: 'Tampil seluruh menu makanan, filter tab kategori berfungsi' },
  { no: 7, feature: 'Keranjang & Checkout', testScenario: 'Isi nama, nomor meja, pilih jumlah > 0, klik Pesan Sekarang', expected: 'Muncul popup modal konfirmasi dengan kalkulasi total yang akurat' },
  { no: 8, feature: 'Submit Pesanan', testScenario: 'Klik "Ya, Kirim Pesanan" di modal', expected: 'Muncul alert sukses, data tersimpan di tabel orders dan order_details' },
  { no: 9, feature: 'Monitoring Admin', testScenario: 'Cek /dashboard di browser admin', expected: 'Pesanan baru langsung tampil di urutan teratas' },
  { no: 10, feature: 'Update Status', testScenario: 'Ganti dropdown status jadi "Selesai / Lunas"', expected: 'Status langsung berubah jadi hijau SELESAI secara instan' },
];
