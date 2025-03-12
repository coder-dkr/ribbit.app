import { ButtonHTMLAttributes } from "react";

const ButtonShimmer = ({
  content,
  ...buttonProps
}: {
  content: string;
} & ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      {...buttonProps}
      className="inline-flex h-9 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none hover:text-white duration-150 whitespace-nowrap"
    >
      {content}
    </button>
  );
};

export default ButtonShimmer;
