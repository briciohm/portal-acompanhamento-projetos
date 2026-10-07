import * as React from "react";
import { CheckIcon, ChevronDownIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type SelectOption = { label: React.ReactNode; disabled?: boolean };

type SelectContextValue = {
  value?: string;
  onValueChange?: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  disabled?: boolean;
  registerOption: (value: string, option: SelectOption) => void;
  getOption: (value?: string) => SelectOption | undefined;
};

const SelectContext = React.createContext<SelectContextValue | null>(null);

function useSelectContext() {
  const context = React.useContext(SelectContext);
  if (!context) throw new Error("Select components must be used inside Select");
  return context;
}

function Select({
  value,
  defaultValue,
  onValueChange,
  disabled,
  children,
}: {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const [open, setOpen] = React.useState(false);
  const optionsRef = React.useRef(new Map<string, SelectOption>());
  const selectedValue = value ?? internalValue;
  const context = React.useMemo<SelectContextValue>(
    () => ({
      value: selectedValue,
      onValueChange: nextValue => {
        setInternalValue(nextValue);
        onValueChange?.(nextValue);
        setOpen(false);
      },
      open,
      setOpen,
      disabled,
      registerOption: (optionValue, option) => {
        optionsRef.current.set(optionValue, option);
      },
      getOption: optionValue =>
        optionValue ? optionsRef.current.get(optionValue) : undefined,
    }),
    [disabled, onValueChange, open, selectedValue]
  );

  return (
    <SelectContext.Provider value={context}>
      <div className="relative w-fit">{children}</div>
    </SelectContext.Provider>
  );
}

function SelectGroup({ children }: { children: React.ReactNode }) {
  return <div role="group">{children}</div>;
}

function SelectValue({
  placeholder,
  className,
}: {
  placeholder?: React.ReactNode;
  className?: string;
}) {
  const { value, getOption } = useSelectContext();
  const option = getOption(value);
  return (
    <span
      className={cn("truncate", !option && "text-muted-foreground", className)}
    >
      {option?.label ?? placeholder}
    </span>
  );
}

function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: "sm" | "default";
}) {
  const { open, setOpen, disabled } = useSelectContext();
  return (
    <button
      type="button"
      data-slot="select-trigger"
      data-size={size}
      aria-haspopup="listbox"
      aria-expanded={open}
      disabled={disabled || props.disabled}
      className={cn(
        "border-input data-[placeholder]:text-muted-foreground flex w-fit items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8",
        className
      )}
      onClick={() => setOpen(!open)}
      {...props}
    >
      {children}
      <ChevronDownIcon className="size-4 shrink-0 opacity-50" />
    </button>
  );
}

function SelectContent({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const { open } = useSelectContext();
  return (
    <div
      data-slot="select-content"
      role="listbox"
      hidden={!open}
      className={cn(
        "bg-popover text-popover-foreground absolute left-0 top-full z-[100] mt-1 max-h-60 min-w-full overflow-y-auto rounded-md border p-1 shadow-md",
        className
      )}
    >
      {children}
    </div>
  );
}

function SelectLabel({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("text-muted-foreground px-2 py-1.5 text-xs", className)}>
      {children}
    </div>
  );
}

function SelectItem({
  className,
  value,
  disabled,
  children,
}: {
  className?: string;
  value: string;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  const {
    value: selectedValue,
    onValueChange,
    registerOption,
  } = useSelectContext();
  registerOption(value, { label: children, disabled });
  return (
    <button
      type="button"
      role="option"
      aria-selected={selectedValue === value}
      disabled={disabled}
      className={cn(
        "relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-left text-sm outline-hidden select-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      onClick={() => onValueChange?.(value)}
    >
      <span>{children}</span>
      {selectedValue === value && (
        <CheckIcon className="absolute right-2 size-3.5" />
      )}
    </button>
  );
}

function SelectSeparator({ className }: { className?: string }) {
  return (
    <div
      role="separator"
      className={cn("bg-border -mx-1 my-1 h-px", className)}
    />
  );
}

function SelectScrollDownButton() {
  return null;
}

function SelectScrollUpButton() {
  return null;
}

export {
  Select,
  SelectGroup,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
