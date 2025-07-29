
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/providers/ThemeProvider';
import { Palette } from 'lucide-react';

const colorOptions = [
  { 
    name: 'Indigo', 
    value: 'indigo' as const, 
    color: 'bg-indigo-500',
    description: 'Professional indigo theme'
  },
  { 
    name: 'Green', 
    value: 'green' as const, 
    color: 'bg-green-500',
    description: 'Nature-inspired green theme'
  },
  { 
    name: 'Orange', 
    value: 'orange' as const, 
    color: 'bg-orange-500',
    description: 'Warm orange theme'
  },
  { 
    name: 'Blue', 
    value: 'blue' as const, 
    color: 'bg-blue-500',
    description: 'Classic blue theme'
  },
];

export function ColorPicker() {
  const { themeColor, setThemeColor } = useTheme();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Platform Color Theme
        </CardTitle>
        <CardDescription>
          Choose your preferred color scheme for the platform
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {colorOptions.map((option) => (
            <Button
              key={option.value}
              variant={themeColor === option.value ? "default" : "outline"}
              className="h-auto p-4 flex flex-col items-center gap-3"
              onClick={() => setThemeColor(option.value)}
            >
              <div className={`w-8 h-8 rounded-full ${option.color}`} />
              <div className="text-center">
                <div className="font-medium">{option.name}</div>
                <div className="text-xs text-muted-foreground">{option.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
