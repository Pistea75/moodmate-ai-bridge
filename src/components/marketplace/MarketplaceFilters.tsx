import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-primary" />
          <h3 className="font-semibold text-foreground">Filtros</h3>
        </div>
        
        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-3 w-3 mr-1" />
            Limpiar
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Search */}
        <div className="lg:col-span-2">
          <Label htmlFor="search" className="text-xs text-muted-foreground">Buscar</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Nombre o especialidad..."
              value={filters.search || ''}
              onChange={(e) => onFiltersChange({ search: e.target.value })}
              className="pl-10 h-9"
            />
          </div>
        </div>

        {/* Specialization */}
        <div>
          <Label className="text-xs text-muted-foreground">Especialización</Label>
          <Select 
            value={filters.specialization || ''} 
            onValueChange={(value) => onFiltersChange({ specialization: value === 'all' ? undefined : value })}
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Todas" />
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
        <div>
          <Label className="text-xs text-muted-foreground">Idioma</Label>
          <Select 
            value={filters.language || ''} 
            onValueChange={(value) => onFiltersChange({ language: value === 'all' ? undefined : value })}
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Todos" />
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
        <div>
          <Label className="text-xs text-muted-foreground">País</Label>
          <Select 
            value={filters.country || ''} 
            onValueChange={(value) => onFiltersChange({ country: value === 'all' ? undefined : value })}
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Todos" />
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

        {/* Experience Years */}
        <div>
          <Label className="text-xs text-muted-foreground">Experiencia</Label>
          <Select 
            value={filters.experienceYears?.toString() || ''} 
            onValueChange={(value) => onFiltersChange({ experienceYears: value === 'all' ? undefined : Number(value) })}
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Cualquiera" />
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
      </div>

      {/* Rate Range - Separate row for better spacing */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-2">
          <Label className="text-xs text-muted-foreground">Tarifa por hora</Label>
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                type="number"
                placeholder="Min $"
                value={filters.minRate || ''}
                onChange={(e) => onFiltersChange({ minRate: e.target.value ? Number(e.target.value) : undefined })}
                className="h-9"
              />
            </div>
            <div className="flex-1">
              <Input
                type="number"
                placeholder="Max $"
                value={filters.maxRate || ''}
                onChange={(e) => onFiltersChange({ maxRate: e.target.value ? Number(e.target.value) : undefined })}
                className="h-9"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}