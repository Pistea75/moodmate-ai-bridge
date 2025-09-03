import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MapPin, Clock, Star, DollarSign, Globe, Calendar } from 'lucide-react';
import { PsychologistProfile } from '@/hooks/usePsychologistMarketplace';
import { SessionBookingModal } from './SessionBookingModal';

interface PsychologistCardProps {
  psychologist: PsychologistProfile;
}

export function PsychologistCard({ psychologist }: PsychologistCardProps) {
  const [showBookingModal, setShowBookingModal] = useState(false);
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 border border-gray-200">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
              {getInitials(psychologist.display_name)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 truncate">
                  {psychologist.display_name}
                </h3>
                
                <div className="flex items-center gap-2 mt-1 text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">
                    {psychologist.region}, {psychologist.country}
                  </span>
                </div>
              </div>
              
              <div className="text-right">
                <div className="flex items-center gap-1 text-primary font-semibold">
                  <DollarSign className="h-4 w-4" />
                  <span>${psychologist.hourly_rate}/hr</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Experience & Languages */}
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{psychologist.experience_years} años exp.</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Globe className="h-4 w-4" />
            <span>{psychologist.languages.join(', ')}</span>
          </div>
        </div>

        {/* Bio */}
        <p className="text-gray-700 text-sm line-clamp-3">
          {psychologist.bio}
        </p>

        {/* Specializations */}
        <div className="space-y-2">
          <div className="flex flex-wrap gap-1">
            {psychologist.specializations.slice(0, 3).map((spec) => (
              <Badge 
                key={spec} 
                variant="secondary"
                className="text-xs"
              >
                {spec}
              </Badge>
            ))}
            {psychologist.specializations.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{psychologist.specializations.length - 3} más
              </Badge>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1">
            Ver Perfil
          </Button>
          
          <Button 
            size="sm" 
            className="flex-1"
            onClick={() => setShowBookingModal(true)}
          >
            <Calendar className="h-4 w-4 mr-1" />
            Reservar Sesión
          </Button>
        </div>
      </CardContent>

      <SessionBookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        psychologist={{
          id: psychologist.id,
          display_name: psychologist.display_name,
          user_id: psychologist.user_id
        }}
      />
    </Card>
  );
}