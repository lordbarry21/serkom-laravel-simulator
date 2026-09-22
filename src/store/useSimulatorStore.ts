import { create } from 'zustand';
import {
  BASE_LARAVEL_FILES,
  FOOD_MCR_FILES,
  ORDER_MCR_FILES,
  ORDER_DETAIL_M_FILES,
  FOOD_SEEDER_FILES,
  BREEZE_BLADE_FILES,
  buildFileTreeFromPaths,
  initialFileTree,
  initialVirtualFiles,
} from '@/data/laravelProjectTree';
import { simulatorModules } from '@/data/modulesData';
import { createInitialMockDatabase } from '@/lib/mockDatabase';
import { simulateTerminalCommand } from '@/lib/terminalSimulator';
import { validateCodeContent } from '@/lib/validator';
import { FileTreeNode } from '@/types/laravelFileSystem';
import { FoodCategory, FoodItem, MockDatabase, OrderRecord, OrderStatus } from '@/types/preview';
import {
  CodeValidationResult,
  SimulatorModule,
  SimulatorStep,
  TerminalLogEntry,
  TerminalMistake,
  TerminalSnapshot,
} from '@/types/simulator';

interface SimulatorStore {
  // Modules & Step State
  modules: SimulatorModule[];
  currentModuleId: number;
  currentStepIndex: number;
  completedStepIds: Set<string>;
  criteriaStatus: Record<string, boolean>;

  // Project lifecycle state (starts from zero!)
  isProjectCreated: boolean;
  isMigrated: boolean;
  isStorageLinked: boolean;
  isBreezeInstalled: boolean;

  // VFS State
  virtualFiles: Record<string, string>;
  fileTree: FileTreeNode[];
  activeFilePath: string;
  openTabs: string[];

  // Terminal State
  terminalLogs: TerminalLogEntry[];
  commandHistory: string[];
  historyIndex: number;
  terminalCwd: string;
  activeMistake: TerminalMistake | null;

  // Code Validation State
  validationResult: CodeValidationResult;
  hintLevel: number;
  isHintModalOpen: boolean;
  isGraduationModalOpen: boolean;
  isPanduanModalOpen: boolean;

  // Preview & Mock DB State
  mockDb: MockDatabase;
  activeRoute: string;
  activeRightTab: 'terminal' | 'preview';
  activeCategoryFilter: FoodCategory | 'all';
  spotlightTarget: string | null;

  // Getters
  getCurrentStep: () => SimulatorStep;
  isCurrentStepCompleted: () => boolean;

  // Step Navigation
  setModule: (moduleId: number) => void;
  setStep: (stepNumber: number) => void;
  nextStep: () => void;
  prevStep: () => void;

  // Editor Actions
  openFile: (path: string) => void;
  closeTab: (path: string) => void;
  updateFileContent: (path: string, content: string) => void;
  validateCurrentFile: () => void;
  applyAutocomplete: () => void;

  // Terminal Actions
  executeTerminalCommand: (command: string) => void;
  undoMistake: () => void;
  clearTerminal: () => void;

  // Hint & Modal
  setHintLevel: (level: number) => void;
  setIsHintModalOpen: (open: boolean) => void;
  setIsGraduationModalOpen: (open: boolean) => void;
  setIsPanduanModalOpen: (open: boolean) => void;

  // Preview Actions
  setRightTab: (tab: 'terminal' | 'preview') => void;
  setPreviewRoute: (route: string) => void;
  setCategoryFilter: (cat: FoodCategory | 'all') => void;
  submitCustomerOrder: (payload: {
    customer_name: string;
    table_number: string;
    items: Record<number, number>;
  }) => { success: boolean; message: string; orderId?: number };
  updateOrderStatus: (orderId: number, status: OrderStatus) => void;
  createFoodItem: (item: Omit<FoodItem, 'id' | 'created_at'>) => void;
  deleteFoodItem: (foodId: number) => void;
  resetAll: () => void;
}

export const useSimulatorStore = create<SimulatorStore>((set, get) => ({
  modules: simulatorModules,
  currentModuleId: 1,
  currentStepIndex: 0,
  completedStepIds: new Set<string>(),
  criteriaStatus: {},

  // Starts from 0: project not created yet!
  isProjectCreated: false,
  isMigrated: false,
  isStorageLinked: false,
  isBreezeInstalled: false,

  virtualFiles: {},
  fileTree: [],
  activeFilePath: '',
  openTabs: [],

  terminalLogs: [
    {
      id: 'init-1',
      type: 'info',
      content: 'Windows PowerShell\nCopyright (C) Microsoft Corporation. All rights reserved.\n\nWorkspace siap. Silakan ketik perintah sesuai langkah panduan.',
      timestamp: Date.now(),
    },
  ],
  commandHistory: [],
  historyIndex: -1,
  terminalCwd: 'C:\\laragon\\www',
  activeMistake: null,

  validationResult: { isValid: false, missingRequirements: [], hasError: false },
  hintLevel: 0,
  isHintModalOpen: false,
  isGraduationModalOpen: false,
  isPanduanModalOpen: false,

  // Initially empty database before migrate:fresh --seed
  mockDb: {
    foods: [],
    orders: [],
    order_details: [],
    users: [],
  },
  activeRoute: '/',
  activeRightTab: 'terminal',
  activeCategoryFilter: 'all',
  spotlightTarget: null,

  getCurrentStep: () => {
    const { modules, currentModuleId, currentStepIndex } = get();
    const currentModule = modules.find((m) => m.id === currentModuleId) || modules[0];
    return currentModule.steps[currentStepIndex] || currentModule.steps[0];
  },

  isCurrentStepCompleted: () => {
    const currentStep = get().getCurrentStep();
    const { criteriaStatus } = get();
    if (!currentStep.criteria || currentStep.criteria.length === 0) return true;
    return currentStep.criteria.every((c) => criteriaStatus[c.id] === true);
  },

  setModule: (moduleId: number) => {
    const { modules } = get();
    const targetModule = modules.find((m) => m.id === moduleId);
    if (!targetModule) return;

    // If moving to module 2, 3, or 4, auto-bootstrap necessary files if not yet created
    if (moduleId > 1 && !get().isProjectCreated) {
      get().applyAutocomplete();
    }

    const firstStep = targetModule.steps[0];
    const newActiveFile = firstStep.targetFilePath || get().activeFilePath;

    set((state) => ({
      currentModuleId: moduleId,
      currentStepIndex: 0,
      activeFilePath: newActiveFile,
      openTabs:
        newActiveFile && !state.openTabs.includes(newActiveFile)
          ? [...state.openTabs, newActiveFile]
          : state.openTabs,
      activeRightTab: firstStep.preferredTab || 'terminal',
      activeRoute: firstStep.defaultPreviewRoute || state.activeRoute,
      spotlightTarget: firstStep.spotlightTarget || null,
      hintLevel: 0,
      activeMistake: null,
    }));
    get().validateCurrentFile();
  },

  setStep: (stepNumber: number) => {
    const { modules, currentModuleId } = get();
    const currentModule = modules.find((m) => m.id === currentModuleId) || modules[0];
    const targetIndex = currentModule.steps.findIndex((s) => s.stepNumber === stepNumber);
    if (targetIndex === -1) return;

    const step = currentModule.steps[targetIndex];
    const targetFile = step.targetFilePath;

    set((state) => ({
      currentStepIndex: targetIndex,
      activeFilePath: targetFile || state.activeFilePath,
      openTabs:
        targetFile && !state.openTabs.includes(targetFile)
          ? [...state.openTabs, targetFile]
          : state.openTabs,
      activeRightTab: step.preferredTab || state.activeRightTab,
      activeRoute: step.defaultPreviewRoute || state.activeRoute,
      spotlightTarget: step.spotlightTarget || null,
      hintLevel: 0,
      activeMistake: null,
    }));
    get().validateCurrentFile();
  },

  nextStep: () => {
    const { modules, currentModuleId, currentStepIndex } = get();
    const currentModule = modules.find((m) => m.id === currentModuleId) || modules[0];

    if (currentStepIndex < currentModule.steps.length - 1) {
      get().setStep(currentModule.steps[currentStepIndex + 1].stepNumber);
    } else {
      const nextModule = modules.find((m) => m.id === currentModuleId + 1);
      if (nextModule) {
        get().setModule(nextModule.id);
      } else {
        set({ isGraduationModalOpen: true });
      }
    }
  },

  prevStep: () => {
    const { modules, currentModuleId, currentStepIndex } = get();
    const currentModule = modules.find((m) => m.id === currentModuleId) || modules[0];

    if (currentStepIndex > 0) {
      get().setStep(currentModule.steps[currentStepIndex - 1].stepNumber);
    } else if (currentModuleId > 1) {
      const prevModule = modules.find((m) => m.id === currentModuleId - 1);
      if (prevModule) {
        set({ currentModuleId: prevModule.id });
        get().setStep(prevModule.steps[prevModule.steps.length - 1].stepNumber);
      }
    }
  },

  openFile: (path: string) => {
    set((state) => ({
      activeFilePath: path,
      openTabs: state.openTabs.includes(path) ? state.openTabs : [...state.openTabs, path],
    }));
    get().validateCurrentFile();
  },

  closeTab: (path: string) => {
    set((state) => {
      const remaining = state.openTabs.filter((t) => t !== path);
      const newActive =
        state.activeFilePath === path ? remaining[remaining.length - 1] || '' : state.activeFilePath;
      return {
        openTabs: remaining,
        activeFilePath: newActive,
      };
    });
  },

  updateFileContent: (path: string, content: string) => {
    set((state) => ({
      virtualFiles: {
        ...state.virtualFiles,
        [path]: content,
      },
    }));
    get().validateCurrentFile();
  },

  validateCurrentFile: () => {
    const step = get().getCurrentStep();
    const { virtualFiles, criteriaStatus } = get();

    if (!step.targetFilePath) return;

    const fileContent = virtualFiles[step.targetFilePath] || '';
    const result = validateCodeContent(fileContent, step);

    set({ validationResult: result });

    const updatedCriteria = { ...criteriaStatus };
    for (const criterion of step.criteria) {
      if (criterion.type === 'code_edit') {
        updatedCriteria[criterion.id] = result.isValid;
      }
    }

    set({ criteriaStatus: updatedCriteria });
  },

  applyAutocomplete: () => {
    const step = get().getCurrentStep();
    const { criteriaStatus, virtualFiles } = get();

    // Ensure base project files exist if step > 1
    let updatedFiles = { ...virtualFiles };
    let projectCreated = get().isProjectCreated;

    if (!projectCreated) {
      updatedFiles = { ...updatedFiles, ...BASE_LARAVEL_FILES };
      projectCreated = true;
    }

    // Ensure model/migration files exist depending on current step
    if (step.moduleId >= 1) {
      updatedFiles = {
        ...updatedFiles,
        ...FOOD_MCR_FILES,
        ...ORDER_MCR_FILES,
        ...ORDER_DETAIL_M_FILES,
        ...FOOD_SEEDER_FILES,
      };
    }

    if (step.moduleId >= 2) {
      updatedFiles = {
        ...updatedFiles,
        ...BREEZE_BLADE_FILES,
      };
    }

    // If step has solution code and target file, inject it
    if (step.targetFilePath && step.solutionCode) {
      updatedFiles[step.targetFilePath] = step.solutionCode;
    }

    const updatedTree = buildFileTreeFromPaths(updatedFiles);

    // Mark criteria as complete
    const updatedCriteria = { ...criteriaStatus };
    for (const criterion of step.criteria) {
      updatedCriteria[criterion.id] = true;
    }

    // If step is seeder or migrate, seed the mock DB
    let newMockDb = get().mockDb;
    let newMigrated = get().isMigrated;
    if (step.stepNumber >= 6 && !newMigrated) {
      newMockDb = createInitialMockDatabase();
      newMigrated = true;
    }

    set((state) => ({
      isProjectCreated: projectCreated,
      isMigrated: newMigrated,
      virtualFiles: updatedFiles,
      fileTree: updatedTree,
      activeFilePath: step.targetFilePath || state.activeFilePath,
      openTabs:
        step.targetFilePath && !state.openTabs.includes(step.targetFilePath)
          ? [...state.openTabs, step.targetFilePath]
          : state.openTabs,
      criteriaStatus: updatedCriteria,
      validationResult: { isValid: true, missingRequirements: [], hasError: false },
      completedStepIds: new Set(state.completedStepIds).add(step.id),
      mockDb: newMockDb,
      terminalCwd: projectCreated ? 'C:\\laragon\\www\\pesanmakan' : state.terminalCwd,
      terminalLogs: [
        ...state.terminalLogs,
        {
          id: `ac-${Date.now()}`,
          type: 'info',
          content: `[Info] Solusi otomatis dan file prasyarat diterapkan untuk langkah "${step.title}".`,
          timestamp: Date.now(),
        },
      ],
    }));
  },

  executeTerminalCommand: (command: string) => {
    const trimmed = command.trim();
    if (!trimmed) return;

    if (trimmed.toLowerCase() === 'clear' || trimmed.toLowerCase() === 'cls') {
      get().clearTerminal();
      return;
    }

    const { activeMistake, virtualFiles, criteriaStatus } = get();
    const step = get().getCurrentStep();

    // 1. If a mistake is currently active, the user MUST undo!
    if (activeMistake) {
      if (trimmed.toLowerCase() === 'undo') {
        get().undoMistake();
        return;
      }

      set((state) => ({
        terminalLogs: [
          ...state.terminalLogs,
          {
            id: `in-${Date.now()}`,
            type: 'input',
            content: trimmed,
            command: trimmed,
            timestamp: Date.now(),
          },
          {
            id: `warn-${Date.now()}`,
            type: 'warning',
            content:
              '⚠️ Anda WAJIB membatalkan (Undo) perintah sebelumnya terlebih dahulu!\n' +
              'Klik tombol "↩️ Batalkan Perintah & Hapus File Berlebih (Undo)" di atas atau ketik "undo".',
            timestamp: Date.now() + 1,
          },
        ],
      }));
      return;
    }

    // 2. If user types "undo" when there is no mistake pending
    if (trimmed.toLowerCase() === 'undo') {
      set((state) => ({
        terminalLogs: [
          ...state.terminalLogs,
          {
            id: `in-${Date.now()}`,
            type: 'input',
            content: trimmed,
            command: trimmed,
            timestamp: Date.now(),
          },
          {
            id: `info-${Date.now()}`,
            type: 'info',
            content:
              'Tidak ada perintah keliru yang perlu dibatalkan (Undo). Silakan lanjutkan mengetik perintah sesuai modul.',
            timestamp: Date.now() + 1,
          },
        ],
      }));
      return;
    }

    // 3. Take snapshot of workspace state BEFORE executing the command
    const snapshot: TerminalSnapshot = {
      virtualFiles: { ...virtualFiles },
      fileTree: [...get().fileTree],
      activeFilePath: get().activeFilePath,
      openTabs: [...get().openTabs],
      criteriaStatus: { ...criteriaStatus },
      terminalCwd: get().terminalCwd,
      isProjectCreated: get().isProjectCreated,
      isMigrated: get().isMigrated,
      isStorageLinked: get().isStorageLinked,
      isBreezeInstalled: get().isBreezeInstalled,
    };

    // User input log entry
    const inputEntry: TerminalLogEntry = {
      id: `in-${Date.now()}`,
      type: 'input',
      content: trimmed,
      command: trimmed,
      timestamp: Date.now(),
    };

    const execution = simulateTerminalCommand(trimmed, step, get().isProjectCreated);

    // 4. Handle Mistake Condition
    if (execution.isMistake) {
      const mistake: TerminalMistake = {
        id: `mistake-${Date.now()}`,
        rawCommand: trimmed,
        expectedCommands: step.expectedCommands || [],
        reasonTitle: execution.mistakeDetails?.reasonTitle || 'Perintah Tidak Sesuai Modul Serkom',
        explanation:
          execution.mistakeDetails?.explanation ||
          'Perintah yang dijalankan tidak sesuai dengan instruksi modul Serkom.',
        createdFiles: execution.mistakeDetails?.unwantedFiles || [],
        snapshot,
      };

      const outputEntry: TerminalLogEntry = {
        id: `out-${Date.now()}`,
        type: 'warning',
        content: execution.output,
        timestamp: Date.now() + 1,
        mistake,
      };

      // If the command generated mock unwanted files (like OrderDetailController.php for -mcr),
      // inject them into the virtual workspace so the student visibly notices the unwanted file in the tree!
      let newVirtualFiles = { ...virtualFiles };
      let newOpenTabs = [...get().openTabs];
      let newActiveFilePath = get().activeFilePath;

      if (execution.newFiles) {
        newVirtualFiles = { ...newVirtualFiles, ...execution.newFiles };
        const firstUnwanted = execution.mistakeDetails?.unwantedFiles?.[0];
        if (firstUnwanted) {
          newActiveFilePath = firstUnwanted;
          if (!newOpenTabs.includes(firstUnwanted)) {
            newOpenTabs.push(firstUnwanted);
          }
        }
      }

      const updatedTree = buildFileTreeFromPaths(newVirtualFiles);

      set((state) => ({
        activeMistake: mistake,
        terminalLogs: [...state.terminalLogs, inputEntry, outputEntry],
        commandHistory: [...state.commandHistory, trimmed],
        historyIndex: -1,
        virtualFiles: newVirtualFiles,
        fileTree: updatedTree,
        activeFilePath: newActiveFilePath,
        openTabs: newOpenTabs,
      }));
      return;
    }

    // 5. Handle Valid Command Execution
    const outputEntry: TerminalLogEntry = {
      id: `out-${Date.now()}`,
      type: execution.type,
      content: execution.output,
      timestamp: Date.now() + 1,
    };

    let newVirtualFiles = { ...virtualFiles };
    let newProjectCreated = get().isProjectCreated;
    let newCwd = get().terminalCwd;
    let newMigrated = get().isMigrated;
    let newStorageLinked = get().isStorageLinked;
    let newBreezeInstalled = get().isBreezeInstalled;
    let newMockDb = get().mockDb;
    let newActiveFilePath = get().activeFilePath;
    let newOpenTabs = [...get().openTabs];

    if (execution.newFiles) {
      newVirtualFiles = { ...newVirtualFiles, ...execution.newFiles };
    }

    const normalizedCmd = trimmed.toLowerCase().replace(/\s+/g, ' ');

    // Directory & File triggers
    if (normalizedCmd.includes('composer create-project')) {
      newProjectCreated = true;
      newActiveFilePath = '.env';
      if (!newOpenTabs.includes('.env')) newOpenTabs.push('.env');
    }

    if (normalizedCmd.includes('cd pesanmakan')) {
      newCwd = 'C:\\laragon\\www\\pesanmakan';
    } else if (normalizedCmd === 'cd ..' || normalizedCmd === 'cd..') {
      newCwd = 'C:\\laragon\\www';
    }

    if (normalizedCmd.includes('make:model food')) {
      newActiveFilePath = 'database/migrations/2025_01_01_000001_create_foods_table.php';
      if (!newOpenTabs.includes(newActiveFilePath)) newOpenTabs.push(newActiveFilePath);
    }

    if (normalizedCmd.includes('make:model order') && !normalizedCmd.includes('orderdetail')) {
      newActiveFilePath = 'database/migrations/2025_01_01_000002_create_orders_table.php';
      if (!newOpenTabs.includes(newActiveFilePath)) newOpenTabs.push(newActiveFilePath);
    }

    if (normalizedCmd.includes('make:model orderdetail')) {
      newActiveFilePath = 'database/migrations/2025_01_01_000003_create_order_details_table.php';
      if (!newOpenTabs.includes(newActiveFilePath)) newOpenTabs.push(newActiveFilePath);
    }

    if (normalizedCmd.includes('breeze:install') || normalizedCmd.includes('require laravel/breeze')) {
      newBreezeInstalled = true;
    }

    if (normalizedCmd.includes('storage:link')) {
      newStorageLinked = true;
    }

    if (
      normalizedCmd.includes('migrate:fresh') ||
      (normalizedCmd.includes('migrate') && normalizedCmd.includes('--seed'))
    ) {
      newMigrated = true;
      newMockDb = createInitialMockDatabase();
    }

    const updatedTree = buildFileTreeFromPaths(newVirtualFiles);

    // Evaluate criteria
    const updatedCriteria = { ...criteriaStatus };
    let hasMetCriterion = false;

    for (const criterion of step.criteria) {
      if (criterion.type === 'terminal_command') {
        const isMatched =
          execution.isTargetMet ||
          (criterion.targetCommand &&
            normalizedCmd === criterion.targetCommand.toLowerCase().replace(/\s+/g, ' '));

        if (isMatched) {
          updatedCriteria[criterion.id] = true;
          hasMetCriterion = true;
        }
      }
    }

    set((state) => ({
      activeMistake: null,
      terminalLogs: [...state.terminalLogs, inputEntry, outputEntry],
      commandHistory: [...state.commandHistory, trimmed],
      historyIndex: -1,
      terminalCwd: newCwd,
      criteriaStatus: updatedCriteria,
      isProjectCreated: newProjectCreated,
      isMigrated: newMigrated,
      isStorageLinked: newStorageLinked,
      isBreezeInstalled: newBreezeInstalled,
      mockDb: newMockDb,
      virtualFiles: newVirtualFiles,
      fileTree: updatedTree,
      activeFilePath: newActiveFilePath || state.activeFilePath,
      openTabs: newOpenTabs.length > 0 ? newOpenTabs : state.openTabs,
    }));

    if (hasMetCriterion) {
      get().validateCurrentFile();
    }
  },

  undoMistake: () => {
    const { activeMistake } = get();
    if (!activeMistake) return;

    const { snapshot, rawCommand, expectedCommands, createdFiles } = activeMistake;

    const rollbackLog: TerminalLogEntry = {
      id: `rb-${Date.now()}`,
      type: 'rollback',
      content: [
        '↩️ [ROLLBACK BERHASIL]',
        `Perintah "${rawCommand}" telah dibatalkan.`,
        ...(createdFiles && createdFiles.length > 0
          ? [`File berlebih telah dihapus: ${createdFiles.join(', ')}`]
          : []),
        'Workspace dikembalikan ke kondisi bersih sebelum perintah salah dijalankan.',
        '',
        'Silakan ketik perintah yang benar sesuai modul:',
        ...(expectedCommands.length > 0
          ? expectedCommands.map((c) => `  $ ${c}`)
          : ['  (Langkah ini tidak memerlukan perintah terminal)']),
      ].join('\n'),
      timestamp: Date.now(),
    };

    set((state) => ({
      virtualFiles: snapshot.virtualFiles,
      fileTree: snapshot.fileTree,
      activeFilePath: snapshot.activeFilePath,
      openTabs: snapshot.openTabs,
      criteriaStatus: snapshot.criteriaStatus,
      terminalCwd: snapshot.terminalCwd,
      isProjectCreated: snapshot.isProjectCreated,
      isMigrated: snapshot.isMigrated,
      isStorageLinked: snapshot.isStorageLinked,
      isBreezeInstalled: snapshot.isBreezeInstalled,
      activeMistake: null,
      terminalLogs: [...state.terminalLogs, rollbackLog],
    }));
  },


  clearTerminal: () => {
    set({
      terminalLogs: [
        {
          id: `clear-${Date.now()}`,
          type: 'info',
          content: 'Terminal dibersihkan.',
          timestamp: Date.now(),
        },
      ],
    });
  },

  setHintLevel: (level: number) => set({ hintLevel: level }),
  setIsHintModalOpen: (open: boolean) => set({ isHintModalOpen: open }),
  setIsGraduationModalOpen: (open: boolean) => set({ isGraduationModalOpen: open }),
  setIsPanduanModalOpen: (open: boolean) => set({ isPanduanModalOpen: open }),

  setRightTab: (tab: 'terminal' | 'preview') => set({ activeRightTab: tab }),
  setPreviewRoute: (route: string) => set({ activeRoute: route }),
  setCategoryFilter: (cat: FoodCategory | 'all') => set({ activeCategoryFilter: cat }),

  submitCustomerOrder: (payload) => {
    const { mockDb, criteriaStatus } = get();
    const orderedFoodIds = Object.entries(payload.items).filter(([_, qty]) => qty > 0);

    if (orderedFoodIds.length === 0) {
      return { success: false, message: 'Pilih minimal satu menu makanan!' };
    }

    const newOrderId = (mockDb.orders.length > 0 ? Math.max(...mockDb.orders.map((o) => o.id)) : 100) + 1;
    let totalPrice = 0;

    const newDetails = orderedFoodIds.map(([idStr, quantity], idx) => {
      const foodId = parseInt(idStr, 10);
      const food = mockDb.foods.find((f) => f.id === foodId);
      const price = food ? food.price : 0;
      const subtotal = price * quantity;
      totalPrice += subtotal;

      return {
        id: Date.now() + idx,
        order_id: newOrderId,
        food_id: foodId,
        food,
        quantity,
        subtotal,
      };
    });

    const newOrder: OrderRecord = {
      id: newOrderId,
      customer_name: payload.customer_name,
      table_number: payload.table_number,
      total_price: totalPrice,
      status: 'pending',
      created_at: new Date().toISOString().replace('T', ' ').slice(0, 19),
      order_details: newDetails,
    };

    set((state) => ({
      mockDb: {
        ...state.mockDb,
        orders: [newOrder, ...state.mockDb.orders],
        order_details: [...newDetails, ...state.mockDb.order_details],
      },
    }));

    // Step 14 ui_action check
    const step = get().getCurrentStep();
    if (step.id === 'm3-step-14') {
      const updatedCriteria = { ...criteriaStatus };
      for (const c of step.criteria) {
        if (c.type === 'ui_action') {
          updatedCriteria[c.id] = true;
        }
      }
      set({ criteriaStatus: updatedCriteria });
    }

    return {
      success: true,
      message: `Pesanan #${newOrderId} atas nama ${payload.customer_name} (Meja ${payload.table_number}) berhasil dibuat!`,
      orderId: newOrderId,
    };
  },

  updateOrderStatus: (orderId: number, status: OrderStatus) => {
    const { mockDb, criteriaStatus } = get();
    const updatedOrders = mockDb.orders.map((order) =>
      order.id === orderId ? { ...order, status } : order
    );

    set((state) => ({
      mockDb: {
        ...state.mockDb,
        orders: updatedOrders,
      },
    }));

    // Step 18 ui_action check
    const step = get().getCurrentStep();
    if (step.id === 'm4-step-18') {
      const updatedCriteria = { ...criteriaStatus };
      for (const c of step.criteria) {
        if (c.type === 'ui_action') {
          updatedCriteria[c.id] = true;
        }
      }
      set({ criteriaStatus: updatedCriteria });
    }
  },

  createFoodItem: (food) => {
    const { mockDb } = get();
    const newId = (mockDb.foods.length > 0 ? Math.max(...mockDb.foods.map((f) => f.id)) : 0) + 1;
    const newFood: FoodItem = {
      ...food,
      id: newId,
      created_at: new Date().toISOString().replace('T', ' ').slice(0, 19),
    };

    set((state) => ({
      mockDb: {
        ...state.mockDb,
        foods: [newFood, ...state.mockDb.foods],
      },
      activeRoute: '/admin/foods',
    }));
  },

  deleteFoodItem: (foodId: number) => {
    const { mockDb } = get();
    set((state) => ({
      mockDb: {
        ...state.mockDb,
        foods: state.mockDb.foods.filter((f) => f.id !== foodId),
      },
    }));
  },

  resetAll: () => {
    set({
      currentModuleId: 1,
      currentStepIndex: 0,
      completedStepIds: new Set<string>(),
      criteriaStatus: {},
      isProjectCreated: false,
      isMigrated: false,
      isStorageLinked: false,
      isBreezeInstalled: false,
      virtualFiles: {},
      fileTree: [],
      activeFilePath: '',
      openTabs: [],
      terminalLogs: [
        {
          id: 'init-1',
          type: 'info',
          content: 'Simulator di-reset ke kondisi awal dari 0.',
          timestamp: Date.now(),
        },
      ],
      terminalCwd: 'C:\\laragon\\www',
      mockDb: { foods: [], orders: [], order_details: [], users: [] },
      activeRoute: '/',
      activeRightTab: 'terminal',
      activeCategoryFilter: 'all',
      spotlightTarget: null,
      isGraduationModalOpen: false,
      isPanduanModalOpen: false,
      activeMistake: null,
    });
    get().validateCurrentFile();
  },
}));
