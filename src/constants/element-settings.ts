import { SelectOption } from "@flodesk/grain";

export const FONT_WEIGHT_OPTIONS: SelectOption[] = [
  { value: "normal", content: "Normal" },
  { value: "medium", content: "Medium" },
  { value: "bold", content: "Bold" },
];

export const HEADING_LEVEL_OPTIONS: SelectOption[] = [
  { value: "1", content: "H1" },
  { value: "2", content: "H2" },
  { value: "3", content: "H3" },
];

export const TARGET_OPTIONS: SelectOption[] = [
  { value: "_self", content: "Same tab" },
  { value: "_blank", content: "New tab" },
];
