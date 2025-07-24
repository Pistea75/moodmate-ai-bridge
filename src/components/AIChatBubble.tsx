
import React from 'react';
import { Card } from "@/components/ui/card";
import { format } from 'date-fns';

interface AIChatBubbleProps {
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function AIChatBubble({ type, content, timestamp }: AIChatBubbleProps) {
  const formatMessage = (text: string) => {
    // Split by double newlines to create paragraphs
    const paragraphs = text.split('\n\n').filter(p => p.trim());
    
    return paragraphs.map((paragraph, index) => {
      // Check if it's a list item (starts with - or *)
      if (paragraph.includes('\n-') || paragraph.includes('\n*')) {
        const lines = paragraph.split('\n');
        const intro = lines[0];
        const listItems = lines.slice(1).filter(line => line.trim().startsWith('-') || line.trim().startsWith('*'));
        
        return (
          <div key={index} className="mb-3">
            {intro && <p className="mb-2">{intro}</p>}
            <ul className="list-disc list-inside space-y-1 ml-4">
              {listItems.map((item, itemIndex) => (
                <li key={itemIndex} className="text-sm">
                  {item.replace(/^[\s-*]+/, '')}
                </li>
              ))}
            </ul>
          </div>
        );
      }
      
      // Check if it's a numbered list
      if (paragraph.match(/\d+\./)) {
        const lines = paragraph.split('\n');
        const intro = lines.find(line => !line.match(/^\d+\./));
        const listItems = lines.filter(line => line.match(/^\d+\./));
        
        return (
          <div key={index} className="mb-3">
            {intro && <p className="mb-2">{intro}</p>}
            <ol className="list-decimal list-inside space-y-1 ml-4">
              {listItems.map((item, itemIndex) => (
                <li key={itemIndex} className="text-sm">
                  {item.replace(/^\d+\.\s*/, '')}
                </li>
              ))}
            </ol>
          </div>
        );
      }
      
      // Regular paragraph
      return (
        <p key={index} className="mb-3 leading-relaxed">
          {paragraph}
        </p>
      );
    });
  };

  return (
    <div className={`flex ${type === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
      <Card className={`max-w-[80%] p-4 ${
        type === 'user' 
          ? 'bg-mood-purple text-white' 
          : 'bg-gray-50 border-gray-200'
      }`}>
        <div className="space-y-2">
          <div className={`text-sm font-medium ${
            type === 'user' ? 'text-white/90' : 'text-gray-600'
          }`}>
            {type === 'user' ? 'You' : 'AI Assistant'}
          </div>
          <div className={`${
            type === 'user' ? 'text-white' : 'text-gray-800'
          }`}>
            {formatMessage(content)}
          </div>
          <div className={`text-xs ${
            type === 'user' ? 'text-white/70' : 'text-gray-500'
          }`}>
            {format(timestamp, 'HH:mm')}
          </div>
        </div>
      </Card>
    </div>
  );
}
