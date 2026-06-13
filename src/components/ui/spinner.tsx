import clsx from "clsx";

type SpinnerProps = {
  className?: string;
  size?: "sm" | "md";
};

const sizes = {
  sm: "h-4 w-4 border-2",
  md: "h-5 w-5 border-2",
};

export function Spinner({ className, size = "sm" }: SpinnerProps) {
  return (
    <span
      aria-hidden
      className={clsx(
        "inline-block animate-spin rounded-full border-current border-t-transparent",
        sizes[size],
        className,
      )}
    />
  );
}
