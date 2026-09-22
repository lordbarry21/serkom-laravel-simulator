export type SupportedLanguage = 'php' | 'blade' | 'sql' | 'bash' | 'json' | 'env' | 'javascript' | 'html';

export interface VirtualFile {
  path: string;
  name: string;
  content: string;
  language: SupportedLanguage;
  isModified?: boolean;
  isReadOnly?: boolean;
  isOpen?: boolean;
}

export interface FileTreeNode {
  id: string;
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: FileTreeNode[];
  language?: SupportedLanguage;
  isExpanded?: boolean;
}

export type VirtualFileSystem = Record<string, string>;
