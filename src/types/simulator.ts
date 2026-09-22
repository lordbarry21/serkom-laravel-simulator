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

export interface TerminalLogEntry {
  id: string;
  type: 'input' | 'output' | 'error' | 'success' | 'info' | 'artisan';
  content: string;
  timestamp: number;
  command?: string;
}

export interface CodeValidationResult {
  isValid: boolean;
  missingRequirements: string[];
  tips?: string[];
  hasError: boolean;
  errorMessage?: string;
}
