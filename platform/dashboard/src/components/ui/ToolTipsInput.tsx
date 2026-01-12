import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

interface TooltipInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: React.ReactNode;
  error?: string | null;
}

export function TooltipInput({ icon, error, ...props }: TooltipInputProps) {
  return (
    <>
      {icon}
      <Tippy
        content={<span>{error}</span>}
        visible={!!error} // Only show if error string exists
        placement="right"
        arrow={true}
      >
        <input {...props} />
      </Tippy>
    </>
  );
}
