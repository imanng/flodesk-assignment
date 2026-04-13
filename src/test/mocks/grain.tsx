import type {
  ChangeEvent,
  ComponentPropsWithoutRef,
  PropsWithChildren,
  ReactNode,
} from 'react';

type DivProps = PropsWithChildren<ComponentPropsWithoutRef<'div'>>;
type LayoutProps = {
  align?: string;
  alignItems?: string;
  backgroundColor?: string;
  borderSide?: string;
  color?: string;
  columns?: string;
  cursor?: string;
  flex?: string | number;
  gap?: string | number;
  hasEllipsis?: boolean;
  hasFullWidth?: boolean;
  height?: string | number;
  justifyContent?: string;
  margin?: string | number;
  maxWidth?: string | number;
  minHeight?: string | number;
  overflow?: string;
  overflowY?: string;
  padding?: string | number;
  paddingX?: string | number;
  paddingY?: string | number;
  radius?: string;
  shadow?: string;
  shadowHover?: string;
  size?: string;
  transition?: string;
  variant?: string;
  weight?: string;
  width?: string | number;
  wrap?: string;
};
type ButtonProps = PropsWithChildren<
  ComponentPropsWithoutRef<'button'> & {
    icon?: ReactNode;
    trigger?: ReactNode;
    isActive?: boolean;
    hasPortal?: boolean;
    placement?: string;
  }
> &
  LayoutProps;

type SelectProps = {
  options: Array<{ value: string; content: ReactNode }>;
  value: string;
  onChange: (option: { value: string; content: ReactNode }) => void;
};

type ToggleProps = PropsWithChildren<{
  isActive?: boolean;
  'aria-label'?: string;
  onClick?: () => void;
}>;

type PopoverProps = PropsWithChildren<{
  trigger: ReactNode;
  isOpen?: boolean;
}>;

const OMITTED_LAYOUT_PROPS = new Set([
  'align',
  'alignItems',
  'backgroundColor',
  'borderSide',
  'color',
  'columns',
  'cursor',
  'flex',
  'gap',
  'hasEllipsis',
  'hasFullWidth',
  'hasPortal',
  'height',
  'isActive',
  'justifyContent',
  'margin',
  'maxWidth',
  'minHeight',
  'overflow',
  'overflowY',
  'padding',
  'paddingX',
  'paddingY',
  'placement',
  'radius',
  'shadow',
  'shadowHover',
  'size',
  'transition',
  'trigger',
  'variant',
  'weight',
  'width',
  'wrap',
]);

const stripLayoutProps = <T extends Record<string, unknown>>(props: T) =>
  Object.fromEntries(
    Object.entries(props).filter(([key]) => !OMITTED_LAYOUT_PROPS.has(key)),
  );

const Div = ({ children, ...props }: DivProps & LayoutProps) => (
  <div {...stripLayoutProps(props)}>{children}</div>
);

const ButtonBase = ({ children, icon, type = 'button', ...props }: ButtonProps) => (
  <button
    type={type}
    {...stripLayoutProps(props as Record<string, unknown>)}
  >
    {icon}
    {children}
  </button>
);

export const GrainProvider = ({ children }: PropsWithChildren) => <>{children}</>;

export const Arrange = Div;
export const Box = Div;
export const Card = Div;
export const Flex = Div;
export const Stack = Div;

export const Button = ButtonBase;
export const TextButton = ButtonBase;

export const Text = ({ children, ...props }: DivProps & LayoutProps) => (
  <span {...stripLayoutProps(props)}>{children}</span>
);

export const FieldLabel = ({
  children,
  htmlFor,
}: PropsWithChildren<{ htmlFor?: string }>) => (
  <label htmlFor={htmlFor}>{children}</label>
);

export const TextInput = ({
  hasError,
  errorMessage,
  ...props
}: ComponentPropsWithoutRef<'input'> & {
  hasError?: boolean;
  errorMessage?: ReactNode;
}) => (
  <>
    <input aria-invalid={hasError || undefined} {...props} />
    {errorMessage ? <span role="alert">{errorMessage}</span> : null}
  </>
);
export const GhostInput = (props: ComponentPropsWithoutRef<'input'>) => <input {...props} />;
export const Textarea = (props: ComponentPropsWithoutRef<'textarea'>) => (
  <textarea {...props} />
);

export const Slider = ({
  onChange,
  ...props
}: ComponentPropsWithoutRef<'input'>) => (
  <input type="range" onChange={onChange} {...props} />
);

export const Select = ({ options, value, onChange }: SelectProps) => (
  <select
    aria-label="select"
    value={value}
    onChange={(event) =>
      onChange({
        value: event.target.value,
        content: options.find((option) => option.value === event.target.value)?.content ?? event.target.value,
      })
    }
  >
    {options.map((option) => (
      <option key={option.value} value={option.value}>
        {typeof option.content === 'string' ? option.content : option.value}
      </option>
    ))}
  </select>
);

export const TextToggleGroup = Div;
export const TextToggle = ({
  children,
  onClick,
  isActive,
  ...props
}: ToggleProps) => (
  <button
    type="button"
    aria-pressed={isActive}
    onClick={onClick}
    {...props}
  >
    {children}
  </button>
);

export const Popover = ({ trigger, isOpen, children }: PopoverProps) => (
  <div>
    {trigger}
    {isOpen ? children : null}
  </div>
);

export const Icon = ({ icon }: { icon: ReactNode; size?: string }) => <span>{icon}</span>;
export const IconArrowLeft = () => <span aria-hidden="true">arrow-left</span>;
export const IconDownload = () => <span aria-hidden="true">download</span>;
export const IconLink = () => <span aria-hidden="true">link</span>;
export const IconReset = () => <span aria-hidden="true">reset</span>;
export const IconTextAlignCenter = () => <span aria-hidden="true">align-center</span>;
export const IconTextAlignLeft = () => <span aria-hidden="true">align-left</span>;
export const IconTextAlignRight = () => <span aria-hidden="true">align-right</span>;
export const IconUpload = () => <span aria-hidden="true">upload</span>;
