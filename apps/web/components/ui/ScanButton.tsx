import React from "react";
import { ScanFace } from "lucide-react";
import { Button } from "./button";

interface ScanButtonProps {
  onClick: () => void;
  disabled: boolean;
}

const ScanButton: React.FC<ScanButtonProps> = ({ onClick, disabled }) => {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className="absolute bottom-4 left-1/2 transform -translate-x-1/2 rounded-full"
      size="icon"
    >
      <ScanFace className="h-6 w-6" />
    </Button>
  );
};

export default ScanButton;
