import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MapPin, Clock, Star, DollarSign, Globe, Calendar } from 'lucide-react';
import { PsychologistProfile } from '@/hooks/usePsychologistMarketplace';
import { SessionBookingModal } from './SessionBookingModal';
import { useTranslation } from 'react-i18next';

interface PsychologistCardProps {
  psychologist: PsychologistProfile;
}

export function PsychologistCard({ psychologist }: PsychologistCardProps) {
  const { t } = useTranslation();
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
    <>
      <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-card shadow-sm hover:shadow-primary/5 overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-start gap-4">
            <Avatar className="h-14 w-14 ring-2 ring-primary/10">
              <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary text-lg font-bold">
                {getInitials(psychologist.display_name)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                    {psychologist.display_name}
                  </h3>
                  
                  <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    <span className="text-sm truncate">
                      {psychologist.region}, {psychologist.country}
                    </span>
                  </div>
                </div>
                
                <div className="text-right ml-4">
                  <div className="flex items-center gap-1 text-primary font-bold">
                    <DollarSign className="h-4 w-4" />
                    <span className="text-lg">${psychologist.hourly_rate}</span>
                    <span className="text-sm text-muted-foreground font-normal">{t('marketplace.hourly')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 pt-0">
          {/* Experience & Languages */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              <span>{psychologist.experience_years} {t('marketplace.yearsExp')}</span>
            </div>
            
            <div className="flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5" />
              <span className="truncate">{psychologist.languages.join(', ')}</span>
            </div>
          </div>

          {/* Bio */}
          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
            {psychologist.bio}
          </p>

          {/* Specializations */}
          <div className="space-y-2">
            <div className="flex flex-wrap gap-1.5">
              {psychologist.specializations.slice(0, 3).map((spec) => (
                <Badge 
                  key={spec} 
                  variant="secondary"
                  className="text-xs px-2 py-1 bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                >
                  {spec}
                </Badge>
              ))}
              {psychologist.specializations.length > 3 && (
                <Badge variant="outline" className="text-xs px-2 py-1">
                  +{psychologist.specializations.length - 3} {t('marketplace.more')}
                </Badge>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-3">
            <Button variant="outline" size="sm" className="flex-1 hover:bg-primary/5 hover:border-primary/20">
              {t('marketplace.viewProfile')}
            </Button>
            
            <Button 
              size="sm" 
              className="flex-1 bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg transition-all"
              onClick={() => setShowBookingModal(true)}
            >
              <Calendar className="h-3.5 w-3.5 mr-1.5" />
              {t('marketplace.bookSession')}
            </Button>
          </div>
        </CardContent>
      </Card>

      <SessionBookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        psychologist={{
          id: psychologist.id,
          display_name: psychologist.display_name,
          user_id: psychologist.user_id,
          hourly_rate: psychologist.hourly_rate
        }}
      />
    </>
  );
}