import type { SxProps, Theme } from "@mui/material";

import { useTheme } from "@mui/material";


/** Fixed helper row height so layout does not jump when answers appear. */
const HELPER_SLOT_PX = 30;

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
  const theme = useTheme()

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
      marginTop: "0px",
      height:"fit-content",
      overflowY: "auto",
      overflowX: "hidden",
      boxSizing: "border-box",
      fontSize: "0.75rem",
      lineHeight: 1.25,
      ...(showAnswer
        ? {
          backgroundColor: theme.palette.success.main,
          width:"fit-content",
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
