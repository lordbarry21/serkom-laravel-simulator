import { FileTreeNode } from './laravelFileSystem';

export type CriterionType = 'terminal_command' | 'code_edit' | 'ui_action';

export interface StepCriterion {
  id: string;
  description: string;
  type: CriterionType;
  targetPath?: string;
  targetCommand?: string;
  isCompleted: boolean;
  errorMessage?: string;
  hint?: string;
}

export interface ValidationRuleSet {
  requiredPatterns: (RegExp | string)[];
  prohibitedPatterns?: (RegExp | string)[];
  missingMessageMap?: Record<string, string>;
}

export interface SimulatorStep {
  id: string;
  moduleId: number;
  stepNumber: number; // 1 - 20
  title: string;
  subtitle?: string;
  descriptionMarkdown: string;
  theorySummary: string;
  targetFilePath?: string;
  initialCode?: string;
  expectedCodeSnippet?: string;
  solutionCode?: string;
  criteria: StepCriterion[];
  validationRules?: ValidationRuleSet;
  expectedCommands?: string[];
  spotlightTarget?: string; // CSS selector or identifier for preview spotlight
  hints: string[];
  defaultPreviewRoute?: string;
  preferredTab?: 'terminal' | 'preview';
}

export interface SimulatorModule {
  id: number;
  title: string;
  subtitle: string;
  estimatedTime: string;
  badge: string;
  steps: SimulatorStep[];
}

export interface TerminalSnapshot {
  virtualFiles: Record<string, string>;
  fileTree: FileTreeNode[];
  activeFilePath: string;
  openTabs: string[];
  criteriaStatus: Record<string, boolean>;
  terminalCwd: string;
  isProjectCreated: boolean;
  isMigrated: boolean;
  isStorageLinked: boolean;
  isBreezeInstalled: boolean;
}

export interface TerminalMistake {
  id: string;
  rawCommand: string;
  expectedCommands: string[];
  reasonTitle: string;
  explanation: string;
  createdFiles?: string[];
  snapshot: TerminalSnapshot;
}

export interface TerminalLogEntry {
  id: string;
  type: 'input' | 'output' | 'error' | 'success' | 'info' | 'artisan' | 'warning' | 'rollback';
  content: string;
  timestamp: number;
  command?: string;
  mistake?: TerminalMistake;
}

export interface CodeValidationResult {
  isValid: boolean;
  missingRequirements: string[];
  tips?: string[];
  hasError: boolean;
  errorMessage?: string;
}

