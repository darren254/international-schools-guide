import { ButtonHTMLAttributes, AnchorHTMLAttributes } from "react";

type Variant = "outline" | "primary";

interface ButtonBaseProps {
  variant?: Variant;
  fullWidth?: boolean;
}

type ButtonAsButton = ButtonBaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { as?: "button" };

type ButtonAsAnchor = ButtonBaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { as: "a" };

type ButtonProps = ButtonAsButton | ButtonAsAnchor;

const variantStyles: Record<Variant, string> = {
  outline:
    "bg-transparent border-charcoal text-charcoal hover:bg-charcoal hover:text-warm-white",
  primary:
    "bg-hermes border-hermes text-white hover:bg-hermes-hover hover:border-hermes-hover",
};

export function Button(props: ButtonProps) {
  const { variant = "outline", fullWidth, ...rest } = props;

  const className = [
    "font-body text-[0.8125rem] font-medium uppercase tracking-wider",
    "px-6 py-2.5 border transition-all inline-block text-center",
    "cursor-pointer",
    variantStyles[variant],
    fullWidth ? "w-full" : "",
    props.className || "",
  ].join(" ");

  if (props.as === "a") {
    const { as, variant: _v, fullWidth: _fw, ...anchorProps } = props as ButtonAsAnchor;
    return <a {...anchorProps} className={className} />;
  }

  const { as, variant: _v, fullWidth: _fw, ...buttonProps } = props as ButtonAsButton;
  return <button {...buttonProps} className={className} />;
}
