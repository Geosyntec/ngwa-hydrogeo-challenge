/**
 * Helper text for scenario panel TextFields: revealed answer, check feedback, or hint.
 */
export function renderHelperText(
  showAnswer: boolean,
  checked: boolean,
  isCorrect: boolean,
  answer?: string | number,
  helper?: string,
): string {
  var renderedAnswer:string="", renderedIcon:string="", renderedHelper:string = ""
  if (showAnswer) {
    renderedAnswer = answer != null ? `${answer}` : ""
    //return answer != null ? `${answer}` : "";
  }
  if (checked) {
    renderedIcon = isCorrect ? "✅" : "❌";
    return isCorrect ? "✅" : "❌";
  }
  if (helper != null && helper !== "") {
    renderedHelper = helper
    return helper;
  }
  return renderedAnswer+" "+renderedIcon + " " +renderedHelper;
}
