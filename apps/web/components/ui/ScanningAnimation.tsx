import React from "react";
import { Loader2 } from "lucide-react"; // Assuming you're using `lucide-react` for the Loader2 icon

interface ScanningAnimationProps {
  visible: boolean;
}

const ScanningAnimation: React.FC<ScanningAnimationProps> = ({ visible }) => {
  if (!visible) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <Loader2 className="h-16 w-16 animate-spin text-white" />
    </div>
  );
};

export default ScanningAnimation;
