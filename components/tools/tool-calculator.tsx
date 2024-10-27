import React from "react";

const ToolCalculator = ({ result }: { result: string }) => {
  return (
    <div className="text-zinc-800 dark:text-zinc-300 text-2xl">
      Calculator result: {result}
    </div>
  );
};

export default ToolCalculator;
