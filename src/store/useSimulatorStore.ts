import { create } from 'zustand';
import { initialFileTree, initialVirtualFiles } from '@/data/laravelProjectTree';
import { simulatorModules } from '@/data/modulesData';
import { createInitialMockDatabase } from '@/lib/mockDatabase';
import { simulateTerminalCommand } from '@/lib/terminalSimulator';
import { validateCodeContent } from '@/lib/validator';
import { FileTreeNode } from '@/types/laravelFileSystem';
import { FoodCategory, FoodItem, MockDatabase, OrderRecord, OrderStatus } from '@/types/preview';
import { CodeValidationResult, SimulatorModule, SimulatorStep, TerminalLogEntry } from '@/types/simulator';

interface SimulatorStore {
  // Modules and Step state
  modules: SimulatorModule[];
  currentModuleId: number;
  currentStepIndex: number; // 0-indexed within current module
  completedStepIds: Set<string>;
  criteriaStatus: Record<string, boolean>; // criterionId -> isCompleted

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

  // Code Validation State
  validationResult: CodeValidationResult;
  hintLevel: number;
  isHintModalOpen: boolean;
  isGraduationModalOpen: boolean;

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
  clearTerminal: () => void;

  // Hint & Modal
  setHintLevel: (level: number) => void;
  setIsHintModalOpen: (open: boolean) => void;
  setIsGraduationModalOpen: (open: boolean) => void;

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

const initialStep = simulatorModules[0].steps[0];

export const useSimulatorStore = create<SimulatorStore>((set, get) => ({
  modules: simulatorModules,
  currentModuleId: 1,
  currentStepIndex: 0,
  completedStepIds: new Set<string>(),
  criteriaStatus: {},

  virtualFiles: { ...initialVirtualFiles },
  fileTree: initialFileTree,
  activeFilePath: initialStep.targetFilePath || '.env',
  openTabs: [initialStep.targetFilePath || '.env'],

  terminalLogs: [
    {
      id: 'init-1',
      type: 'info',
      content: 'Selamat datang di Simulator Ujikom / Serkom Laravel Pesan Makan.',
      timestamp: Date.now(),
    },
    {
      id: 'init-2',
      type: 'output',
      content: 'Ikuti instruksi di panel kiri. Ketik perintah di shell ini atau edit kode di tengah.',
      timestamp: Date.now() + 1,
    },
  ],
  commandHistory: [],
  historyIndex: -1,
  terminalCwd: '~',

  validationResult: { isValid: false, missingRequirements: [], hasError: false },
  hintLevel: 0,
  isHintModalOpen: false,
  isGraduationModalOpen: false,

  mockDb: createInitialMockDatabase(),
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

    const firstStep = targetModule.steps[0];
    const newActiveFile = firstStep.targetFilePath || get().activeFilePath;

    set((state) => ({
      currentModuleId: moduleId,
      currentStepIndex: 0,
      activeFilePath: newActiveFile,
      openTabs: state.openTabs.includes(newActiveFile) ? state.openTabs : [...state.openTabs, newActiveFile],
      activeRightTab: firstStep.preferredTab || 'terminal',
      activeRoute: firstStep.defaultPreviewRoute || state.activeRoute,
      spotlightTarget: firstStep.spotlightTarget || null,
      hintLevel: 0,
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
    }));
    get().validateCurrentFile();
  },

  nextStep: () => {
    const { modules, currentModuleId, currentStepIndex } = get();
    const currentModule = modules.find((m) => m.id === currentModuleId) || modules[0];

    // Check if there is next step in current module
    if (currentStepIndex < currentModule.steps.length - 1) {
      get().setStep(currentModule.steps[currentStepIndex + 1].stepNumber);
    } else {
      // Go to next module if available
      const nextModule = modules.find((m) => m.id === currentModuleId + 1);
      if (nextModule) {
        get().setModule(nextModule.id);
      } else {
        // Last step of all modules reached!
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

    // Update criteria status for code_edit criteria
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
    const { criteriaStatus } = get();

    // 1. If step has solution code and target file, inject it
    if (step.targetFilePath && step.solutionCode) {
      set((state) => ({
        virtualFiles: {
          ...state.virtualFiles,
          [step.targetFilePath!]: step.solutionCode!,
        },
      }));
    }

    // 2. Mark all step criteria as completed
    const updatedCriteria = { ...criteriaStatus };
    for (const criterion of step.criteria) {
      updatedCriteria[criterion.id] = true;
    }

    set((state) => ({
      criteriaStatus: updatedCriteria,
      validationResult: { isValid: true, missingRequirements: [], hasError: false },
      completedStepIds: new Set(state.completedStepIds).add(step.id),
    }));

    // Add note to terminal
    set((state) => ({
      terminalLogs: [
        ...state.terminalLogs,
        {
          id: `ac-${Date.now()}`,
          type: 'info',
          content: `💡 Solusi otomatis diterapkan untuk langkah "${step.title}".`,
          timestamp: Date.now(),
        },
      ],
    }));
  },

  executeTerminalCommand: (command: string) => {
    const trimmed = command.trim();
    if (!trimmed) return;

    if (trimmed.toLowerCase() === 'clear') {
      get().clearTerminal();
      return;
    }

    const step = get().getCurrentStep();
    const { criteriaStatus } = get();

    // Add input log
    const inputEntry: TerminalLogEntry = {
      id: `in-${Date.now()}`,
      type: 'input',
      content: trimmed,
      command: trimmed,
      timestamp: Date.now(),
    };

    // Simulate command
    const execution = simulateTerminalCommand(trimmed, step.expectedCommands || [], step.title);

    const outputEntry: TerminalLogEntry = {
      id: `out-${Date.now()}`,
      type: execution.type,
      content: execution.output,
      timestamp: Date.now() + 1,
    };

    // Update directory if cd
    let newCwd = get().terminalCwd;
    if (trimmed.toLowerCase().includes('cd pesanmakan')) {
      newCwd = '~/pesanmakan';
    }

    // Check if this fulfills any terminal_command criteria in current step
    const updatedCriteria = { ...criteriaStatus };
    let hasMetCriterion = false;

    for (const criterion of step.criteria) {
      if (criterion.type === 'terminal_command') {
        const isMatched =
          execution.isTargetMet ||
          (criterion.targetCommand &&
            trimmed.toLowerCase().replace(/\s+/g, ' ') ===
              criterion.targetCommand.toLowerCase().replace(/\s+/g, ' '));

        if (isMatched) {
          updatedCriteria[criterion.id] = true;
          hasMetCriterion = true;
        }
      }
    }

    // If storage:link or migrate:fresh was executed, update preview capabilities
    if (trimmed.toLowerCase().includes('storage:link') || trimmed.toLowerCase().includes('migrate:fresh')) {
      hasMetCriterion = true;
    }

    set((state) => ({
      terminalLogs: [...state.terminalLogs, inputEntry, outputEntry],
      commandHistory: [...state.commandHistory, trimmed],
      historyIndex: -1,
      terminalCwd: newCwd,
      criteriaStatus: updatedCriteria,
    }));

    if (hasMetCriterion) {
      get().validateCurrentFile();
    }
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

    // Check step 14 criterion
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

    // Check step 18 criterion
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
      virtualFiles: { ...initialVirtualFiles },
      activeFilePath: '.env',
      openTabs: ['.env'],
      terminalLogs: [
        {
          id: 'init-1',
          type: 'info',
          content: 'Simulator di-reset ke kondisi awal.',
          timestamp: Date.now(),
        },
      ],
      mockDb: createInitialMockDatabase(),
      activeRoute: '/',
      activeRightTab: 'terminal',
      activeCategoryFilter: 'all',
      spotlightTarget: null,
      isGraduationModalOpen: false,
    });
    get().validateCurrentFile();
  },
}));
