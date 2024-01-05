import React from "react";
import { IconProps } from "@/types/icon";

export const Loader = React.forwardRef<SVGSVGElement, IconProps>(
  (
    { color = "currentColor", fill = "backgroundColor", ...props },
    forwardedRef
  ) => {
    return (
      <svg
        width="60"
        height="60"
        viewBox="0 0 60 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
        ref={forwardedRef}
      >
        <g>
          <path
            id="loader-path"
            d="m51.4,8.65l-43.1,0.1l0.2,42.6l43.2,-0.4l-0.3,-48.3z"
            opacity="NaN"
            strokeWidth="12"
            stroke={color}
            fill={fill}
          />
        </g>
      </svg>
    );
  }
);

Loader.displayName = "Loader";
