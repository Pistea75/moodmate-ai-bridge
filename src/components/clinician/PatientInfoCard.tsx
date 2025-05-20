
import React from 'react';
import { Card } from '@/components/ui/card';

interface PatientProfileProps {
  email: string;
  language: string | null;
}

export function PatientInfoCard({ email, language }: PatientProfileProps) {
  return (
    <Card className="p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-semibold text-xl">Personal Information</h2>
          <div className="mt-2 space-y-2">
            <p className="text-muted-foreground">
              <span className="font-medium text-foreground">Email:</span> {email}
            </p>
            <p className="text-muted-foreground">
              <span className="font-medium text-foreground">Language:</span> {language || 'Not specified'}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
