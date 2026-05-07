import type { SxProps, Theme } from "@mui/material";

/** Green bar for revealed answers (contrast-friendly dark green). */
const ANSWER_HELPER_BG = "#1b5e20";

/** Fixed helper row height so layout does not jump when answers appear. */
const HELPER_SLOT_PX = 25;

/** Fixed OutlinedInput root height (size="small"). */
const INPUT_ROOT_PX = 40;

/**
 * TextField `sx` for scenario panel `bind()` helpers: fixed input + fixed helper slot.
 * When `showAnswer`, helper area uses green background and white text.
 */
export function panelBindTextFieldSx(
  width: number | string,
  showAnswer: boolean,
): SxProps<Theme> {
  return {
    width,
    "& .MuiInputBase-root": {
      height: INPUT_ROOT_PX,
    },
    "& .MuiOutlinedInput-input": {
      py: "8.5px",
    },
    "& .MuiFormHelperText-root": {
      marginLeft: 0,
      marginRight: 0,
      marginTop: "6px",
      minHeight: HELPER_SLOT_PX,
      maxHeight: HELPER_SLOT_PX,
      overflowY: "auto",
      overflowX: "hidden",
      boxSizing: "border-box",
      fontSize: "0.75rem",
      lineHeight: 1.25,
      ...(showAnswer
        ? {
            backgroundColor: ANSWER_HELPER_BG,
            color: "#fff",
            px: 1,
            py: 0.5,
            borderRadius: 0.5,
            "&.Mui-error": {
              color: "#fff",
            },
          }
        : {}),
    },
  };
}
