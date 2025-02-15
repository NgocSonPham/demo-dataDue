import { cn } from "@/lib/utils";
import React, { useState, useRef, useEffect, forwardRef, Ref } from "react";

type InputAutoWidthProps = React.InputHTMLAttributes<HTMLInputElement> & {
  value: string;
  placeholder?: string;
  onChange: (evt: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  maxLength?: number;
  visibleCharacters?: number;
}

const InputAutoWidth = forwardRef<HTMLInputElement, InputAutoWidthProps>((props: InputAutoWidthProps, ref: Ref<HTMLInputElement>) => {
  const { value, placeholder, onChange, className, visibleCharacters = 1000, ...rest } = props;
  const [width, setWidth] = useState<number>(0);
  const span = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (span.current) {
      if (value) {
        span.current.textContent = value.slice(0, visibleCharacters) as string;
      } else {
        span.current.textContent = placeholder ?? "";
      }
      setWidth(span.current.offsetWidth);
    }
  }, [value]);

  const changeHandler = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const value = evt.target.value?.trim();
    onChange(evt);
    if (span.current) {
      span.current.textContent = value.slice(0, visibleCharacters) as string;
      setWidth(span.current.offsetWidth);
    }
  };

  return (
    <div className="relative">
      <span ref={span} className="absolute -z-10 whitespace-pre pointer-events-none invisible"></span>
      <input
        ref={ref}
        type="text"
        className={cn('min-w-[10px] p-0 border-none outline-none', className)}
        style={{ width }}
        autoFocus
        onChange={changeHandler}
        value={value}
        placeholder={placeholder}
        {...rest}
      />
    </div>
  );
});

InputAutoWidth.displayName = 'InputAutoWidth';

export default InputAutoWidth;