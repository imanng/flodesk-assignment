export type ElementSettings = {
  fontSize: string;
  color: string;
  textAlign: "left" | "center" | "right";
  padding: string;
  backgroundColor: string;
  borderRadius?: string;
  fontWeight?: string;
  letterSpacing?: string;
  lineHeight?: string;
};

export type FontPreset =
  | "modern-sans"
  | "editorial-serif"
  | "classic-serif"
  | "mono";
export type ElementType = "heading" | "text" | "image" | "button" | "divider";

export type BaseElement<T extends ElementType, D> = {
  id: string;
  type: T;
  settings: ElementSettings;
  data: D;
};

export type TextElement = BaseElement<
  "text",
  {
    text: string;
  }
>;

export type HeadingElement = BaseElement<
  "heading",
  {
    text: string;
    level: 1 | 2 | 3;
  }
>;

export type ButtonElement = BaseElement<
  "button",
  {
    label: string;
    href?: string;
    target?: "_self" | "_blank";
  }
>;

export type ImageSource = "url" | "upload";

export const DEFAULT_IMAGE_SOURCE: ImageSource = "url";

export const getImageSource = (data: { source?: ImageSource }): ImageSource => {
  return data.source ?? DEFAULT_IMAGE_SOURCE;
};

export type ImageElement = BaseElement<
  "image",
  {
    src: string;
    alt: string;
    decorative?: boolean;
    width?: number;
    height?: number;
    /** How `src` was set. Omitted means {@link DEFAULT_IMAGE_SOURCE}. */
    source?: ImageSource;
  }
>;

export type DividerElement = BaseElement<"divider", Record<string, never>>;

export type TemplateElement =
  | TextElement
  | HeadingElement
  | ButtonElement
  | ImageElement
  | DividerElement;

export type SectionSettings = {
  padding: string;
  backgroundColor?: string;
  borderRadius?: string;
};

export type TemplateColumn = {
  id: string;
  elements: TemplateElement[];
};

export type TemplateSection = {
  id: string;
  layout: "stack" | "columns";
  gap: string;
  settings: SectionSettings;
  elements?: TemplateElement[];
  columns?: TemplateColumn[];
};

export type PageSettings = {
  backgroundColor: string;
  fontPreset: FontPreset;
  maxWidth: string;
};

export type Template = {
  id: string;
  name: string;
  description: string;
  pageSettings: PageSettings;
  sections: TemplateSection[];
};
