import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Search, X, Filter } from 'lucide-react';
import { MarketplaceFilters } from '@/hooks/usePsychologistMarketplace';

interface MarketplaceFiltersProps {
  filters: MarketplaceFilters;
  onFiltersChange: (filters: Partial<MarketplaceFilters>) => void;
  onClearFilters: () => void;
}

const specializations = [
  'Ansiedad',
  'Depresión',
  'Trauma',
  'Terapia de Pareja',
  'Terapia Familiar',
  'Adicciones',
  'Trastornos Alimentarios',
  'TDAH',
  'Autismo',
  'Terapia Infantil',
  'Terapia de Adolescentes',
  'Trastorno Bipolar',
  'PTSD',
  'Mindfulness',
  'Terapia Cognitivo-Conductual'
];

const languages = [
  'Español',
  'English',
  'Français',
  'Português',
  'Italiano',
  'Deutsch'
];

const countries = [
  'España',
  'México',
  'Argentina',
  'Colombia',
  'Chile',
  'Perú',
  'Venezuela',
  'Ecuador',
  'Uruguay',
  'Paraguay',
  'Estados Unidos',
  'Canadá'
];

export function MarketplaceFiltersComponent({ filters, onFiltersChange, onClearFilters }: MarketplaceFiltersProps) {
  const hasActiveFilters = Object.keys(filters).some(key => 
    filters[key as keyof MarketplaceFilters] !== undefined && 
    filters[key as keyof MarketplaceFilters] !== ''
  );

  return (
    <Card className="sticky top-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
          
          {hasActiveFilters && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClearFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4 mr-1" />
              Limpiar
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search">Buscar</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Nombre o especialidad..."
              value={filters.search || ''}
              onChange={(e) => onFiltersChange({ search: e.target.value })}
              className="pl-10"
            />
          </div>
        </div>

        {/* Specialization */}
        <div className="space-y-2">
          <Label>Especialización</Label>
          <Select 
            value={filters.specialization || ''} 
            onValueChange={(value) => onFiltersChange({ specialization: value === 'all' ? undefined : value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todas las especialidades" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las especialidades</SelectItem>
              {specializations.map((spec) => (
                <SelectItem key={spec} value={spec}>
                  {spec}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Language */}
        <div className="space-y-2">
          <Label>Idioma</Label>
          <Select 
            value={filters.language || ''} 
            onValueChange={(value) => onFiltersChange({ language: value === 'all' ? undefined : value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todos los idiomas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los idiomas</SelectItem>
              {languages.map((lang) => (
                <SelectItem key={lang} value={lang}>
                  {lang}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Country */}
        <div className="space-y-2">
          <Label>País</Label>
          <Select 
            value={filters.country || ''} 
            onValueChange={(value) => onFiltersChange({ country: value === 'all' ? undefined : value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todos los países" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los países</SelectItem>
              {countries.map((country) => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Rate Range */}
        <div className="space-y-3">
          <Label>Tarifa por hora</Label>
          <div className="space-y-2">
            <div className="flex gap-2">
              <div className="flex-1">
                <Label htmlFor="minRate" className="text-xs text-muted-foreground">Mínimo</Label>
                <Input
                  id="minRate"
                  type="number"
                  placeholder="$0"
                  value={filters.minRate || ''}
                  onChange={(e) => onFiltersChange({ minRate: e.target.value ? Number(e.target.value) : undefined })}
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="maxRate" className="text-xs text-muted-foreground">Máximo</Label>
                <Input
                  id="maxRate"
                  type="number"
                  placeholder="$200"
                  value={filters.maxRate || ''}
                  onChange={(e) => onFiltersChange({ maxRate: e.target.value ? Number(e.target.value) : undefined })}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Experience Years */}
        <div className="space-y-2">
          <Label>Experiencia mínima</Label>
          <Select 
            value={filters.experienceYears?.toString() || ''} 
            onValueChange={(value) => onFiltersChange({ experienceYears: value === 'all' ? undefined : Number(value) })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Cualquier experiencia" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Cualquier experiencia</SelectItem>
              <SelectItem value="1">1+ años</SelectItem>
              <SelectItem value="3">3+ años</SelectItem>
              <SelectItem value="5">5+ años</SelectItem>
              <SelectItem value="10">10+ años</SelectItem>
              <SelectItem value="15">15+ años</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}