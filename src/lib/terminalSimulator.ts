export interface TerminalExecutionResult {
  output: string;
  type: 'output' | 'error' | 'success' | 'artisan' | 'info';
  newFiles?: Record<string, string>;
  isTargetMet?: boolean;
}

export function simulateTerminalCommand(
  rawCommand: string,
  expectedCommands: string[] = [],
  stepTitle = ''
): TerminalExecutionResult {
  const trimmed = rawCommand.trim();
  const normalized = trimmed.toLowerCase().replace(/\s+/g, ' ');

  if (!trimmed) {
    return { output: '', type: 'output' };
  }

  // Help command
  if (normalized === 'help') {
    return {
      type: 'info',
      output: [
        '\x1b[1mPerintah yang didukung di simulator ini:\x1b[0m',
        '  - composer create-project laravel/laravel pesanmakan',
        '  - php artisan make:model <Name> [-mcr | -m]',
        '  - php artisan make:seeder <Name>',
        '  - php artisan storage:link',
        '  - php artisan migrate:fresh --seed',
        '  - composer require laravel/breeze --dev',
        '  - php artisan breeze:install',
        '  - clear (membersihkan layar terminal)',
      ].join('\n'),
    };
  }

  // Clear handled separately in UI, but if requested:
  if (normalized === 'clear') {
    return { output: '__CLEAR__', type: 'output' };
  }

  // Check matching with expected command
  const matchesExpected = expectedCommands.some((expected) => {
    const normExpected = expected.trim().toLowerCase().replace(/\s+/g, ' ');
    return normalized === normExpected;
  });

  // 1. Composer create-project
  if (normalized.startsWith('composer create-project')) {
    if (normalized.includes('laravel/laravel')) {
      return {
        type: 'success',
        isTargetMet: matchesExpected,
        output: [
          'Creating a "laravel/laravel" project at "./pesanmakan"',
          'Installing laravel/laravel (v11.0.0)',
          '  - Downloading laravel/laravel (v11.0.0)',
          '  - Installing laravel/laravel (v11.0.0): Extracting archive',
          'Created project in /home/user/pesanmakan',
          '> @php artisan package:discover --ansi',
          'Discovered Package: laravel/tinker',
          'Discovered Package: nunomaduro/collision',
          'Package manifest generated successfully.',
          'Application ready! Build something amazing.',
        ].join('\n'),
      };
    }
  }

  // 2. cd pesanmakan
  if (normalized === 'cd pesanmakan' || normalized === 'cd .' || normalized === 'code .') {
    return {
      type: 'info',
      isTargetMet: matchesExpected,
      output: 'Sekarang berada di direktori ~/pesanmakan',
    };
  }

  // 3. php artisan make:model Food -mcr
  if (normalized.includes('make:model food')) {
    const isMcr = normalized.includes('-mcr');
    return {
      type: 'artisan',
      isTargetMet: matchesExpected,
      output: [
        '   INFO  Model [app/Models/Food.php] created successfully.',
        ...(isMcr
          ? [
              '   INFO  Migration [database/migrations/2025_01_01_000001_create_foods_table.php] created successfully.',
              '   INFO  Controller [app/Http/Controllers/FoodController.php] created successfully.',
            ]
          : []),
      ].join('\n'),
    };
  }

  // 4. php artisan make:model Order -mcr
  if (normalized.includes('make:model order') && !normalized.includes('orderdetail')) {
    const isMcr = normalized.includes('-mcr');
    return {
      type: 'artisan',
      isTargetMet: matchesExpected,
      output: [
        '   INFO  Model [app/Models/Order.php] created successfully.',
        ...(isMcr
          ? [
              '   INFO  Migration [database/migrations/2025_01_01_000002_create_orders_table.php] created successfully.',
              '   INFO  Controller [app/Http/Controllers/OrderController.php] created successfully.',
            ]
          : []),
      ].join('\n'),
    };
  }

  // 5. php artisan make:model OrderDetail -m
  if (normalized.includes('make:model orderdetail')) {
    return {
      type: 'artisan',
      isTargetMet: matchesExpected,
      output: [
        '   INFO  Model [app/Models/OrderDetail.php] created successfully.',
        '   INFO  Migration [database/migrations/2025_01_01_000003_create_order_details_table.php] created successfully.',
      ].join('\n'),
    };
  }

  // 6. php artisan make:seeder FoodSeeder
  if (normalized.includes('make:seeder foodseeder')) {
    return {
      type: 'artisan',
      isTargetMet: matchesExpected,
      output: '   INFO  Seeder [database/seeders/FoodSeeder.php] created successfully.',
    };
  }

  // 7. php artisan storage:link
  if (normalized.includes('storage:link')) {
    return {
      type: 'artisan',
      isTargetMet: matchesExpected,
      output: [
        '   INFO  The [public/storage] link has been connected to [storage/app/public].',
        '   ✓ Folder upload makanan kini siap diakses via asset("storage/foods/...")',
      ].join('\n'),
    };
  }

  // 8. php artisan migrate:fresh --seed
  if (normalized.includes('migrate:fresh') || (normalized.includes('migrate') && normalized.includes('--seed'))) {
    return {
      type: 'artisan',
      isTargetMet: matchesExpected,
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

  // 9. composer require laravel/breeze --dev
  if (normalized.includes('require') && normalized.includes('breeze')) {
    return {
      type: 'success',
      isTargetMet: matchesExpected,
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

  // 10. php artisan breeze:install
  if (normalized.includes('breeze:install')) {
    return {
      type: 'artisan',
      isTargetMet: matchesExpected,
      output: [
        '   INFO  Installing Breeze stack [blade]...',
        '   INFO  Publishing Breeze service provider, controllers, and Blade views.',
        '   INFO  Authentication scaffolding installed successfully.',
        '   INFO  Please run [npm install && npm run dev] to compile your fresh assets.',
      ].join('\n'),
    };
  }

  // 11. npm install / npm run build
  if (normalized === 'npm install' || normalized === 'npm run build' || normalized === 'npm run dev') {
    return {
      type: 'info',
      isTargetMet: matchesExpected,
      output: [
        'vite v5.2.0 building for production...',
        'transforming (14) resources/js/app.js',
        '✓ 14 modules transformed.',
        'public/build/manifest.json             0.26 kB │ gzip:  0.14 kB',
        'public/build/assets/app-Dl5w0.css      54.12 kB │ gzip: 10.22 kB',
        'public/build/assets/app-Cq21k.js       82.45 kB │ gzip: 26.81 kB',
        '✓ built in 420ms',
      ].join('\n'),
    };
  }

  // 12. php artisan serve
  if (normalized === 'php artisan serve') {
    return {
      type: 'artisan',
      isTargetMet: matchesExpected,
      output: [
        '   INFO  Server running on [http://127.0.0.1:8000].',
        '  Press Ctrl+C to stop the server',
      ].join('\n'),
    };
  }

  // If command was not recognized or has typo
  const suggestion = expectedCommands.length > 0
    ? `\n[Petunjuk] Perintah yang diharapkan pada langkah "${stepTitle}":\n   $ \x1b[32m${expectedCommands.join('\n   $ ')}\x1b[0m`
    : '\nKetik "help" untuk melihat daftar perintah yang didukung.';

  return {
    type: 'error',
    isTargetMet: false,
    output: `Perintah tidak dikenal atau terdapat salah ketik: "${rawCommand}"${suggestion}`,
  };
}
