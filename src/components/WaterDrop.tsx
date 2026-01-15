import { useEffect, useState } from 'react';

interface WaterDropProps {
  show: boolean;
  onComplete?: () => void;
}

export function WaterDrop({ show, onComplete }: WaterDropProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        onComplete?.();
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!visible) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
      <div
        className="w-8 h-8 bg-pink-400 rounded-[50%_50%_50%_50%/60%_60%_40%_40%] animate-drop-fall"
        style={{
          boxShadow: '0 4px 12px rgba(236, 72, 153, 0.4)',
        }}
      />
    </div>
  );
}
