import type { SxProps, Theme } from "@mui/material";

import { useTheme } from "@mui/material";

/** Minimum helper row height so layout does not jump when feedback appears. */
const HELPER_SLOT_MIN_HEIGHT_PX = 20;

/** Fixed OutlinedInput root height (size="small"). */
const INPUT_ROOT_PX = 40;

/**
 * TextField `sx` for scenario panel `bind()` helpers: fixed input + responsive helper slot.
 * When `showAnswer`, helper area uses green background and white text.
 */
export function panelBindTextFieldSx(
  width: number | string,
  showAnswer: boolean,
): SxProps<Theme> {
  const theme = useTheme();

  return {
    width,
    overflow: "visible",
    "& .MuiInputBase-root": {
      height: INPUT_ROOT_PX,
    },
    "& .MuiOutlinedInput-input": {
      py: "8.5px",
    },
    "& .MuiFormHelperText-root": {
      marginLeft: 0,
      marginRight: 0,
      marginTop: "0px",
      minHeight: HELPER_SLOT_MIN_HEIGHT_PX,
      display: "inline-block",
      width: "max-content",
      maxWidth: "100%",
      whiteSpace: "normal",
      wordBreak: "break-word",
      overflow: "visible",
      boxSizing: "border-box",
      fontSize: "0.75rem",
      lineHeight: 1.25,
      verticalAlign: "top",
      ...(showAnswer
        ? {
            backgroundColor: theme.palette.success.main,
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
