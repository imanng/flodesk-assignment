export interface ElementFieldProps {
  templateId: string;
  elementId: string;
}

export interface TextContentFieldProps extends ElementFieldProps {
  rows: number;
}

export interface PageSettingsFieldProps {
  templateId: string;
}
