import { CodeValidationResult, SimulatorStep } from '@/types/simulator';

export function validateCodeContent(
  content: string,
  step: SimulatorStep
): CodeValidationResult {
  if (!step.validationRules) {
    return {
      isValid: true,
      missingRequirements: [],
      hasError: false,
    };
  }

  const { requiredPatterns, prohibitedPatterns, missingMessageMap } = step.validationRules;
  const missingRequirements: string[] = [];

  // Normalize code by standardizing spaces for flexible comparison
  const normalizedContent = content.replace(/\r\n/g, '\n');

  for (const pattern of requiredPatterns) {
    let matched = false;
    if (typeof pattern === 'string') {
      matched = normalizedContent.includes(pattern);
    } else {
      matched = pattern.test(normalizedContent);
    }

    if (!matched) {
      const patternKey = typeof pattern === 'string' ? pattern : pattern.source;
      const userFriendlyMessage =
        missingMessageMap?.[patternKey] ||
        `Kode belum memuat baris penting: "${typeof pattern === 'string' ? pattern : pattern.source}"`;
      missingRequirements.push(userFriendlyMessage);
    }
  }

  if (prohibitedPatterns) {
    for (const prohibited of prohibitedPatterns) {
      let found = false;
      if (typeof prohibited === 'string') {
        found = normalizedContent.includes(prohibited);
      } else {
        found = prohibited.test(normalizedContent);
      }

      if (found) {
        missingRequirements.push(
          `Terdapat kode atau placeholder yang belum diganti: "${typeof prohibited === 'string' ? prohibited : prohibited.source}"`
        );
      }
    }
  }

  return {
    isValid: missingRequirements.length === 0,
    missingRequirements,
    hasError: missingRequirements.length > 0,
    errorMessage:
      missingRequirements.length > 0
        ? `Langkah ini belum lengkap (${missingRequirements.length} kriteria belum terpenuhi).`
        : undefined,
  };
}

export function compareNormalizedCode(userCode: string, targetSnippet: string): boolean {
  const clean = (str: string) =>
    str
      .replace(/\s+/g, ' ')
      .replace(/['"]/g, '"')
      .trim();
  return clean(userCode).includes(clean(targetSnippet));
}
