/**
 * Helper text for scenario panel TextFields: revealed answer, check feedback, and/or hint.
 * Combines answer + check icon when both apply; returns a non-breaking space when empty
 * so the helper slot keeps a stable height and the form does not jump.
 */
export function renderHelperText(
  showAnswer: boolean,
  checked: boolean,
  isCorrect: boolean,
  answer?: string | number,
  helper?: string,
  isTest?:boolean
): string {
  const parts: string[] = [];

  if (isTest) return "\u00a0"

  if (showAnswer && answer != null && `${answer}` !== "") {
    parts.push(`${answer}`);
  }
  if (checked) {
    parts.push(isCorrect ? "✅" : "❌");
  }
  if (parts.length === 0 && helper != null && helper !== "") {
    parts.push(helper);
  }

  return parts.length > 0 ? parts.join(" ") : "\u00a0";
}
