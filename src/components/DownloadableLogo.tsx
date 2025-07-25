
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Brain } from 'lucide-react';

export function DownloadableLogo() {
  const [downloadSize, setDownloadSize] = useState<'small' | 'medium' | 'large'>('medium');
  
  const sizes = {
    small: { width: 200, height: 60 },
    medium: { width: 300, height: 90 },
    large: { width: 400, height: 120 }
  };

  const createSVG = (size: { width: number; height: number }) => {
    const iconSize = size.height * 0.6;
    const fontSize = size.height * 0.35;
    
    return `<svg width="${size.width}" height="${size.height}" viewBox="0 0 ${size.width} ${size.height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="circleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#9b87f5;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#E5DEFF;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#9b87f5;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#7E69AB;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Circle background -->
  <circle cx="${iconSize/2 + 10}" cy="${size.height/2}" r="${iconSize/2}" fill="url(#circleGradient)" />
  
  <!-- Brain icon (simplified) -->
  <g transform="translate(${10 + iconSize/2 - iconSize*0.3/2}, ${size.height/2 - iconSize*0.3/2})">
    <path d="M${iconSize*0.15},${iconSize*0.1} Q${iconSize*0.3},${iconSize*0.05} ${iconSize*0.25},${iconSize*0.15} Q${iconSize*0.3},${iconSize*0.25} ${iconSize*0.15},${iconSize*0.2} Q${iconSize*0.05},${iconSize*0.25} ${iconSize*0.1},${iconSize*0.15} Q${iconSize*0.05},${iconSize*0.05} ${iconSize*0.15},${iconSize*0.1} Z" fill="white" opacity="0.9"/>
    <path d="M${iconSize*0.1},${iconSize*0.15} Q${iconSize*0.2},${iconSize*0.12} ${iconSize*0.18},${iconSize*0.18} Q${iconSize*0.22},${iconSize*0.22} ${iconSize*0.15},${iconSize*0.2}" fill="white" opacity="0.7"/>
  </g>
  
  <!-- MoodMate text -->
  <text x="${iconSize + 25}" y="${size.height/2 + fontSize/3}" font-family="Arial, sans-serif" font-size="${fontSize}" font-weight="bold" fill="url(#textGradient)">MoodMate</text>
</svg>`;
  };

  const downloadSVG = () => {
    const svgContent = createSVG(sizes[downloadSize]);
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `moodmate-logo-${downloadSize}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-mood-purple" />
          Download MoodMate Logo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Preview */}
        <div className="bg-gray-50 p-6 rounded-lg text-center">
          <div 
            className="inline-block"
            dangerouslySetInnerHTML={{ __html: createSVG(sizes[downloadSize]) }}
          />
        </div>

        {/* Size selector */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Select Size:</label>
          <div className="flex gap-2">
            {Object.entries(sizes).map(([key, size]) => (
              <Button
                key={key}
                variant={downloadSize === key ? "default" : "outline"}
                size="sm"
                onClick={() => setDownloadSize(key as any)}
                className="capitalize"
              >
                {key} ({size.width}x{size.height})
              </Button>
            ))}
          </div>
        </div>

        {/* Download button */}
        <Button onClick={downloadSVG} className="w-full" size="lg">
          <Download className="h-4 w-4 mr-2" />
          Download SVG Logo
        </Button>

        {/* Usage info */}
        <div className="text-sm text-muted-foreground space-y-2">
          <p><strong>Perfect for:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Website headers and footers</li>
            <li>Business cards and letterheads</li>
            <li>Social media profiles</li>
            <li>Marketing materials</li>
            <li>App icons and favicons</li>
          </ul>
          <p className="mt-3">
            <strong>Format:</strong> SVG (Scalable Vector Graphics) - perfect for any size without quality loss
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
