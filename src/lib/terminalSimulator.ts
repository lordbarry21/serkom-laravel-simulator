import { SimulatorStep } from '@/types/simulator';
import {
  FOOD_MCR_FILES,
  ORDER_MCR_FILES,
  ORDER_DETAIL_M_FILES,
  BREEZE_BLADE_FILES,
  BASE_LARAVEL_FILES,
  UNWANTED_ORDER_DETAIL_CONTROLLER,
} from '@/data/laravelProjectTree';

export interface TerminalExecutionResult {
  output: string;
  type: 'output' | 'error' | 'success' | 'artisan' | 'info' | 'warning';
  newFiles?: Record<string, string>;
  isTargetMet?: boolean;
  isMistake: boolean;
  mistakeDetails?: {
    reasonTitle: string;
    explanation: string;
    expectedCommandText: string;
    unwantedFiles?: string[];
    generatedFiles?: Record<string, string>;
  };
}

export function simulateTerminalCommand(
  rawCommand: string,
  currentStep: SimulatorStep,
  isProjectCreated: boolean = false
): TerminalExecutionResult {
  const trimmed = rawCommand.trim();
  if (!trimmed) {
    return { output: '', type: 'output', isMistake: false };
  }

  const normalizedSpaces = trimmed.replace(/\s+/g, ' ');
  const lowerCmd = normalizedSpaces.toLowerCase();

  // 1. Safe Terminal Utility Commands
  if (lowerCmd === 'clear' || lowerCmd === 'cls') {
    return { output: '__CLEAR__', type: 'output', isMistake: false };
  }

  if (lowerCmd === 'help') {
    return {
      type: 'info',
      isMistake: false,
      output: [
        'Perintah yang didukung di simulator ini:',
        '  - composer create-project laravel/laravel pesanmakan',
        '  - cd pesanmakan',
        '  - php artisan make:model Food -mcr',
        '  - php artisan make:model Order -mcr',
        '  - php artisan make:model OrderDetail -m',
        '  - php artisan migrate:fresh --seed',
        '  - composer require laravel/breeze --dev',
        '  - php artisan breeze:install',
        '  - php artisan storage:link',
        '  - undo (membatalkan perintah yang salah dan menghapus file berlebih)',
        '  - clear (membersihkan layar terminal)',
      ].join('\n'),
    };
  }

  const expectedCommands = currentStep.expectedCommands || [];

  // 2. If the current step is a pure Code Edit step (No terminal commands expected)
  if (expectedCommands.length === 0) {
    return {
      type: 'warning',
      isMistake: true,
      isTargetMet: false,
      output: `[PERINGATAN] Langkah ini tidak memerlukan perintah terminal: "${trimmed}"`,
      mistakeDetails: {
        reasonTitle: 'Langkah Ini Berfokus Pada Editor Kode',
        expectedCommandText: '(Tidak ada perintah terminal pada langkah ini)',
        explanation: `Langkah "${currentStep.title}" berfokus pada pengeditan file ${
          currentStep.targetFilePath ? `"${currentStep.targetFilePath}"` : 'kode program'
        } di editor tengah. Silakan tulis kode yang diminta sesuai kriteria modul tanpa menjalankan perintah terminal.`,
      },
    };
  }

  // 3. Strict Check: Does command match one of the expected commands for this step?
  const matchedExpected = expectedCommands.find(
    (expected) => expected.trim().replace(/\s+/g, ' ') === normalizedSpaces
  );

  if (matchedExpected) {
    // Exact match found! Return legitimate output and target met
    return handleValidCommandExecution(normalizedSpaces, matchedExpected);
  }

  // 4. Command does NOT match module instructions: Diagnose specific mistake
  return diagnoseMistake(trimmed, normalizedSpaces, currentStep, isProjectCreated);
}

function handleValidCommandExecution(
  normalizedCmd: string,
  matchedExpected: string
): TerminalExecutionResult {
  const lower = normalizedCmd.toLowerCase();

  // 1. composer create-project
  if (lower.startsWith('composer create-project')) {
    return {
      type: 'success',
      isTargetMet: true,
      isMistake: false,
      newFiles: BASE_LARAVEL_FILES,
      output: [
        'Creating a "laravel/laravel" project at "./pesanmakan"',
        'Installing laravel/laravel (v11.0.0)',
        '  - Downloading laravel/laravel (v11.0.0)',
        '  - Installing laravel/laravel (v11.0.0): Extracting archive',
        'Created project in C:\\laragon\\www\\pesanmakan',
        '> @php artisan package:discover --ansi',
        'Discovered Package: laravel/tinker',
        'Discovered Package: nunomaduro/collision',
        'Package manifest generated successfully.',
        'Application ready! Build something amazing.',
      ].join('\n'),
    };
  }

  // 2. cd pesanmakan
  if (lower === 'cd pesanmakan') {
    return {
      type: 'info',
      isTargetMet: true,
      isMistake: false,
      output: 'Sekarang berada di direktori C:\\laragon\\www\\pesanmakan',
    };
  }

  // 3. php artisan make:model Food -mcr
  if (normalizedCmd === 'php artisan make:model Food -mcr') {
    return {
      type: 'artisan',
      isTargetMet: true,
      isMistake: false,
      newFiles: FOOD_MCR_FILES,
      output: [
        '   INFO  Model [app/Models/Food.php] created successfully.',
        '   INFO  Migration [database/migrations/2025_01_01_000001_create_foods_table.php] created successfully.',
        '   INFO  Controller [app/Http/Controllers/FoodController.php] created successfully.',
      ].join('\n'),
    };
  }

  // 4. php artisan make:model Order -mcr
  if (normalizedCmd === 'php artisan make:model Order -mcr') {
    return {
      type: 'artisan',
      isTargetMet: true,
      isMistake: false,
      newFiles: ORDER_MCR_FILES,
      output: [
        '   INFO  Model [app/Models/Order.php] created successfully.',
        '   INFO  Migration [database/migrations/2025_01_01_000002_create_orders_table.php] created successfully.',
        '   INFO  Controller [app/Http/Controllers/OrderController.php] created successfully.',
      ].join('\n'),
    };
  }

  // 5. php artisan make:model OrderDetail -m (EXACT: only -m, NO controller!)
  if (normalizedCmd === 'php artisan make:model OrderDetail -m') {
    return {
      type: 'artisan',
      isTargetMet: true,
      isMistake: false,
      newFiles: ORDER_DETAIL_M_FILES,
      output: [
        '   INFO  Model [app/Models/OrderDetail.php] created successfully.',
        '   INFO  Migration [database/migrations/2025_01_01_000003_create_order_details_table.php] created successfully.',
      ].join('\n'),
    };
  }

  // 6. php artisan migrate:fresh --seed
  if (normalizedCmd === 'php artisan migrate:fresh --seed') {
    return {
      type: 'artisan',
      isTargetMet: true,
      isMistake: false,
      output: [
        '   INFO  Dropping all tables.',
        '   INFO  Preparing database.',
        '   INFO  Running migrations.',
        '  2025_01_01_000000_create_users_table ....................... 14ms DONE',
        '  2025_01_01_000001_create_foods_table ....................... 18ms DONE',
        '  2025_01_01_000002_create_orders_table ...................... 12ms DONE',
        '  2025_01_01_000003_create_order_details_table ............... 22ms DONE',
        '   INFO  Running seeders.',
        '  Database\\Seeders\\DatabaseSeeder ........................... 45ms DONE',
        '  - Akun Admin: admin@gmail.com / password123 [SUCCESS]',
        '  - 5 Master Data Makanan & Minuman [SEEDED]',
      ].join('\n'),
    };
  }

  // 7. composer require laravel/breeze --dev
  if (normalizedCmd === 'composer require laravel/breeze --dev') {
    return {
      type: 'success',
      isTargetMet: true,
      isMistake: false,
      output: [
        './composer.json has been updated',
        'Running composer update laravel/breeze',
        'Loading composer repositories with package information',
        'Updating dependencies',
        'Lock file operations: 1 install, 0 updates, 0 removals',
        '  - Locking laravel/breeze (v2.0.0)',
        'Writing lock file',
        'Installing dependencies from lock file (including require-dev)',
        'Package operations: 1 install, 0 updates, 0 removals',
        '  - Installing laravel/breeze (v2.0.0): Extracting archive',
        '1 package was added successfully.',
      ].join('\n'),
    };
  }

  // 8. php artisan breeze:install
  if (normalizedCmd === 'php artisan breeze:install') {
    return {
      type: 'artisan',
      isTargetMet: true,
      isMistake: false,
      newFiles: BREEZE_BLADE_FILES,
      output: [
        '   INFO  Installing Breeze stack [blade]...',
        '   INFO  Publishing Breeze service provider, controllers, and Blade views.',
        '   INFO  Authentication scaffolding installed successfully.',
        '   INFO  Please run [npm install && npm run dev] to compile your fresh assets.',
      ].join('\n'),
    };
  }

  // 9. php artisan storage:link
  if (normalizedCmd === 'php artisan storage:link') {
    return {
      type: 'artisan',
      isTargetMet: true,
      isMistake: false,
      output: [
        '   INFO  The [public/storage] link has been connected to [storage/app/public].',
        '   ✓ Folder upload makanan kini siap diakses via asset("storage/foods/...")',
      ].join('\n'),
    };
  }

  return {
    type: 'artisan',
    isTargetMet: true,
    isMistake: false,
    output: `Perintah "${normalizedCmd}" berhasil dijalankan sesuai modul.`,
  };
}

function diagnoseMistake(
  trimmed: string,
  normalizedCmd: string,
  currentStep: SimulatorStep,
  isProjectCreated: boolean
): TerminalExecutionResult {
  const lower = normalizedCmd.toLowerCase();
  const expectedList = currentStep.expectedCommands || [];
  const expectedText = expectedList.join(' ATAU ');

  // DIAGNOSIS 1: OrderDetail with -mcr or controller flags (User's specific request!)
  if (
    lower.includes('make:model') &&
    lower.includes('orderdetail') &&
    (lower.includes('-mcr') ||
      lower.includes('-c') ||
      lower.includes('-r') ||
      lower.includes('--controller') ||
      lower.includes('--resource') ||
      lower.includes('-a'))
  ) {
    const unwantedFiles = ['app/Http/Controllers/OrderDetailController.php'];
    const generatedFiles = {
      ...ORDER_DETAIL_M_FILES,
      'app/Http/Controllers/OrderDetailController.php': UNWANTED_ORDER_DETAIL_CONTROLLER,
    };

    return {
      type: 'warning',
      isMistake: true,
      isTargetMet: false,
      newFiles: generatedFiles,
      output: [
        '   INFO  Model [app/Models/OrderDetail.php] created successfully.',
        '   INFO  Migration [database/migrations/2025_01_01_000003_create_order_details_table.php] created successfully.',
        '   WARNING  Controller [app/Http/Controllers/OrderDetailController.php] created (TIDAK SESUAI MODUL).',
        '',
        '⚠️ PERINGATAN: Perintah tidak sesuai modul Serkom!',
        '   Perintah dijalankan: ' + trimmed,
        '   Perintah seharusnya: php artisan make:model OrderDetail -m',
        '   Penjelasan: OrderDetail hanya butuh flag -m. File OrderDetailController.php tidak diperlukan.',
        '   -> Harap lakukan UNDO untuk membatalkan perintah dan menghapus file controller berlebih.',
      ].join('\n'),
      mistakeDetails: {
        reasonTitle: 'Kelebihan Flag Controller (-mcr pada OrderDetail)',
        expectedCommandText: 'php artisan make:model OrderDetail -m',
        explanation:
          'Pada modul Serkom, Model OrderDetail HANYA memerlukan flag "-m" (Model & Migrasi). Logika penyimpanan rincian pesanan (food_id, quantity, subtotal) ditangani secara terpusat di dalam OrderController saat transaksi checkout. Menambahkan flag "-mcr" keliru membuat controller berlebih "OrderDetailController.php" yang tidak ada dalam silabus Serkom dan berpotensi mengurangi poin kerapihan arsitektur.',
        unwantedFiles,
        generatedFiles,
      },
    };
  }

  // DIAGNOSIS 2: Food without -mcr (e.g. only -m or missing controller)
  if (
    lower.includes('make:model') &&
    lower.includes('food') &&
    !normalizedCmd.includes('-mcr')
  ) {
    return {
      type: 'warning',
      isMistake: true,
      isTargetMet: false,
      output: `⚠️ PERINGATAN: Model Food memerlukan flag "-mcr" lengkap, bukan hanya flag parsial.`,
      mistakeDetails: {
        reasonTitle: 'Kekurangan Flag Controller Resource (-mcr pada Food)',
        expectedCommandText: 'php artisan make:model Food -mcr',
        explanation:
          'Model Food wajib menggunakan flag "-mcr" agar Laravel membuat Model (Food.php), Migrasi (create_foods_table.php), dan Controller Resource (FoodController.php) sekaligus dalam 1 perintah. Jika hanya "-m", FoodController.php tidak akan terbuat sehingga fitur CRUD makanan admin tidak dapat berfungsi.',
      },
    };
  }

  // DIAGNOSIS 3: Order without -mcr (e.g. only -m or missing controller)
  if (
    lower.includes('make:model') &&
    lower.includes('order') &&
    !lower.includes('orderdetail') &&
    !normalizedCmd.includes('-mcr')
  ) {
    return {
      type: 'warning',
      isMistake: true,
      isTargetMet: false,
      output: `⚠️ PERINGATAN: Model Order memerlukan flag "-mcr" lengkap agar OrderController terbuat.`,
      mistakeDetails: {
        reasonTitle: 'Kekurangan Flag Controller Resource (-mcr pada Order)',
        expectedCommandText: 'php artisan make:model Order -mcr',
        explanation:
          'Model Order wajib menggunakan flag "-mcr" agar Laravel membuat OrderController.php untuk mengelola alur checkout kasir dan dashboard pesanan admin. Flag "-m" saja tidak membuat controller.',
      },
    };
  }

  // DIAGNOSIS 4: Model casing lowercase (food, order, orderdetail)
  if (
    /make:model\s+(food|order|orderdetail)\b/i.test(normalizedCmd) &&
    !/make:model\s+(Food|Order|OrderDetail)\b/.test(normalizedCmd)
  ) {
    return {
      type: 'warning',
      isMistake: true,
      isTargetMet: false,
      output: `⚠️ PERINGATAN: Penulisan nama Model harus menggunakan huruf kapital (PascalCase).`,
      mistakeDetails: {
        reasonTitle: 'Format Nama Model Wajib PascalCase',
        expectedCommandText: expectedText,
        explanation:
          'Standar PSR-4 Laravel mewajibkan penamaan Model menggunakan PascalCase (huruf kapital di awal, contoh: "Food", "Order", "OrderDetail"). Mengetik huruf kecil akan menghasilkan nama file dan nama class yang melanggar standar pengkodean.',
      },
    };
  }

  // DIAGNOSIS 5: Running artisan before project creation in Step 1
  if (!isProjectCreated && lower.startsWith('php artisan')) {
    return {
      type: 'warning',
      isMistake: true,
      isTargetMet: false,
      output: `⚠️ PERINGATAN: Proyek Laravel belum dibuat. Jalankan composer create-project terlebih dahulu.`,
      mistakeDetails: {
        reasonTitle: 'Aplikasi Laravel Belum Diinisialisasi',
        expectedCommandText: 'composer create-project laravel/laravel pesanmakan',
        explanation:
          'Anda belum membuat proyek Laravel. Perintah artisan hanya dapat dieksekusi di dalam proyek Laravel yang sudah terinstal.',
      },
    };
  }

  // DIAGNOSIS 6: Wrong project directory name in composer create-project
  if (lower.startsWith('composer create-project') && !lower.endsWith('pesanmakan')) {
    return {
      type: 'warning',
      isMistake: true,
      isTargetMet: false,
      output: `⚠️ PERINGATAN: Nama folder proyek harus "pesanmakan" sesuai modul ujian Serkom.`,
      mistakeDetails: {
        reasonTitle: 'Nama Folder Proyek Tidak Sesuai Modul',
        expectedCommandText: 'composer create-project laravel/laravel pesanmakan',
        explanation:
          'Modul Serkom menentukan nama folder proyek adalah "pesanmakan". Pastikan menuliskan "pesanmakan" di akhir perintah: composer create-project laravel/laravel pesanmakan.',
      },
    };
  }

  // DIAGNOSIS 7: Running migrate without --seed in Step 6
  if (lower.includes('migrate') && !lower.includes('--seed')) {
    return {
      type: 'warning',
      isMistake: true,
      isTargetMet: false,
      output: `⚠️ PERINGATAN: Modul Serkom mewajibkan perintah "php artisan migrate:fresh --seed".`,
      mistakeDetails: {
        reasonTitle: 'Flag --seed Belum Disertakan',
        expectedCommandText: 'php artisan migrate:fresh --seed',
        explanation:
          'Perintah "php artisan migrate" biasa tidak akan membersihkan database dan tidak mengeksekusi FoodSeeder maupun pembuatan akun admin default. Gunakan "php artisan migrate:fresh --seed" agar data siap diuji.',
      },
    };
  }

  // DIAGNOSIS 8: Breeze require without --dev in Step 7
  if (lower.includes('require') && lower.includes('breeze') && !lower.includes('--dev')) {
    return {
      type: 'warning',
      isMistake: true,
      isTargetMet: false,
      output: `⚠️ PERINGATAN: Laravel Breeze harus dipasang dengan flag "--dev".`,
      mistakeDetails: {
        reasonTitle: 'Flag --dev Belum Disertakan pada Breeze',
        expectedCommandText: 'composer require laravel/breeze --dev',
        explanation:
          'Laravel Breeze adalah paket scaffolding autentikasi development, sehingga wajib dipasang menggunakan flag "--dev": composer require laravel/breeze --dev.',
      },
    };
  }

  // DIAGNOSIS 9: Breeze install with non-blade stack (react/vue)
  if (
    lower.includes('breeze:install') &&
    (lower.includes('react') || lower.includes('vue') || lower.includes('api'))
  ) {
    return {
      type: 'warning',
      isMistake: true,
      isTargetMet: false,
      output: `⚠️ PERINGATAN: Modul Serkom mewajibkan stack Blade, bukan React atau Vue.`,
      mistakeDetails: {
        reasonTitle: 'Stack Autentikasi Harus Blade',
        expectedCommandText: 'php artisan breeze:install',
        explanation:
          'Ujikom Serkom menggunakan Blade template engine bawaan Laravel. Cukup jalankan "php artisan breeze:install" (atau pilih stack Blade).',
      },
    };
  }

  // DIAGNOSIS 10: storage without :link
  if (lower.includes('storage') && !lower.includes('storage:link')) {
    return {
      type: 'warning',
      isMistake: true,
      isTargetMet: false,
      output: `⚠️ PERINGATAN: Perintah storage link adalah "php artisan storage:link".`,
      mistakeDetails: {
        reasonTitle: 'Perintah Storage Link Tidak Tepat',
        expectedCommandText: 'php artisan storage:link',
        explanation:
          'Gunakan "php artisan storage:link" untuk menghubungkan storage/app/public ke public/storage agar file foto makanan dapat dimuat di browser.',
      },
    };
  }

  // DIAGNOSIS 11: General Mismatch
  return {
    type: 'warning',
    isMistake: true,
    isTargetMet: false,
    output: [
      `⚠️ PERINGATAN: Perintah "${trimmed}" tidak sesuai dengan modul Serkom!`,
      `   Perintah yang diharapkan pada langkah "${currentStep.title}":`,
      ...expectedList.map((cmd) => `   $ ${cmd}`),
    ].join('\n'),
    mistakeDetails: {
      reasonTitle: 'Perintah Tidak Sesuai Modul Serkom',
      expectedCommandText: expectedText || 'Lihat panduan modul',
      explanation: `Perintah "${trimmed}" tidak sesuai dengan instruksi modul untuk langkah "${
        currentStep.title
      }". Perintah yang diharapkan adalah:\n${expectedList.map((cmd) => `  $ ${cmd}`).join('\n')}`,
    },
  };
}
