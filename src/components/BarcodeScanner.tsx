
import { useEffect } from "react";
import { useZxing } from "react-zxing";

interface BarcodeScannerProps {
  onResult: (result: string) => void;
  onError?: (error: Error) => void;
}

export const BarcodeScanner = ({ onResult, onError }: BarcodeScannerProps) => {
  const { ref } = useZxing({
    onDecodeResult(result) {
      onResult(result.getText());
    },
    onError(error) {
      if (onError) {
        // Convert unknown error to Error object
        const errorObject = error instanceof Error ? error : new Error(String(error));
        onError(errorObject);
      }
    },
  });

  return (
    <div className="relative w-full aspect-video">
      <video
        ref={ref}
        className="w-full h-full object-cover rounded-lg"
      />
      <div className="absolute inset-0 border-2 border-primary/50 rounded-lg" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-64 h-1 bg-primary/50 animate-pulse" />
      </div>
    </div>
  );
};
