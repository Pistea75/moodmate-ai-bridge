
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/providers/ThemeProvider';

export function ColorPicker() {
  const { themeColor, setThemeColor } = useTheme();
  const [key, setKey] = useState(0);

  const colors = [
    { name: 'Indigo', value: 'indigo' as const, color: 'bg-indigo-500' },
    { name: 'Green', value: 'green' as const, color: 'bg-green-500' },
    { name: 'Orange', value: 'orange' as const, color: 'bg-orange-500' },
    { name: 'Blue', value: 'blue' as const, color: 'bg-blue-500' },
    { name: 'Purple', value: 'purple' as const, color: 'bg-purple-500' },
    { name: 'Emerald', value: 'emerald' as const, color: 'bg-emerald-500' },
  ];

  useEffect(() => {
    const handleThemeChange = () => {
      setKey(prev => prev + 1);
    };

    window.addEventListener('themeChanged', handleThemeChange);
    return () => window.removeEventListener('themeChanged', handleThemeChange);
  }, []);

  const handleColorChange = (colorValue: typeof colors[0]['value']) => {
    setThemeColor(colorValue);
    // Force a re-render
    setTimeout(() => setKey(prev => prev + 1), 100);
  };

  return (
    <div className="space-y-4" key={key}>
      <h3 className="text-lg font-medium">Theme Color</h3>
      <div className="grid grid-cols-3 gap-3">
        {colors.map((color) => (
          <Button
            key={color.value}
            variant={themeColor === color.value ? "default" : "outline"}
            className="flex items-center gap-2"
            onClick={() => handleColorChange(color.value)}
          >
            <div className={`w-4 h-4 rounded-full ${color.color}`} />
            {color.name}
          </Button>
        ))}
      </div>
    </div>
  );
}
