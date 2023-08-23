import React from "react";

interface Props {
  height?: string;
  width?: string;
}

const LoadingSpinner: React.FC<Props> = ({ height = "8", width = "8" }) => {
  return (
    <div
      className={`inline-block h-${height} w-${width} animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] text-white motion-reduce:animate-[spin_1.5s_linear_infinite]`}
      role="status"
    >
      <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
    </div>
  );
};

export default LoadingSpinner;
