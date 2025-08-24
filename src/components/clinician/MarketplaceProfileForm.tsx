import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { PsychologistProfileData } from '@/hooks/usePsychologistProfile';

interface MarketplaceProfileFormProps {
  profile: PsychologistProfileData;
  loading: boolean;
  saving: boolean;
  onSave: (profile: PsychologistProfileData) => Promise<boolean>;
}

const commonSpecializations = [
  'Anxiety Disorders',
  'Depression',
  'PTSD',
  'Cognitive Behavioral Therapy',
  'Family Therapy',
  'Couples Therapy',
  'Addiction Treatment',
  'Child Psychology',
  'Adolescent Psychology',
  'Mindfulness-Based Therapy'
];

const commonLanguages = [
  'English',
  'Spanish',
  'French',
  'German',
  'Italian',
  'Portuguese',
  'Dutch',
  'Russian',
  'Chinese',
  'Japanese'
];

export function MarketplaceProfileForm({
  profile,
  loading,
  saving,
  onSave
}: MarketplaceProfileFormProps) {
  const [formData, setFormData] = useState<PsychologistProfileData>(profile);
  const [newSpecialization, setNewSpecialization] = useState('');
  const [newLanguage, setNewLanguage] = useState('');

  useEffect(() => {
    setFormData(profile);
  }, [profile]);

  const handleSave = async () => {
    await onSave(formData);
  };

  const addSpecialization = (spec: string) => {
    if (spec && !formData.specializations.includes(spec)) {
      setFormData(prev => ({
        ...prev,
        specializations: [...prev.specializations, spec]
      }));
    }
    setNewSpecialization('');
  };

  const removeSpecialization = (spec: string) => {
    setFormData(prev => ({
      ...prev,
      specializations: prev.specializations.filter(s => s !== spec)
    }));
  };

  const addLanguage = (lang: string) => {
    if (lang && !formData.languages.includes(lang)) {
      setFormData(prev => ({
        ...prev,
        languages: [...prev.languages, lang]
      }));
    }
    setNewLanguage('');
  };

  const removeLanguage = (lang: string) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.filter(l => l !== lang)
    }));
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted animate-pulse rounded" />
        <div className="h-32 bg-muted animate-pulse rounded" />
        <div className="h-24 bg-muted animate-pulse rounded" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>
            Your public profile information that patients will see
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="display_name">Display Name</Label>
            <Input
              id="display_name"
              value={formData.display_name}
              onChange={(e) => setFormData(prev => ({ ...prev, display_name: e.target.value }))}
              placeholder="Dr. Smith"
            />
          </div>

          <div>
            <Label htmlFor="bio">Professional Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              placeholder="Tell patients about your experience, approach, and what makes you unique..."
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="experience_years">Years of Experience</Label>
              <Input
                id="experience_years"
                type="number"
                min="0"
                value={formData.experience_years}
                onChange={(e) => setFormData(prev => ({ ...prev, experience_years: parseInt(e.target.value) || 0 }))}
              />
            </div>

            <div>
              <Label htmlFor="hourly_rate">Hourly Rate (USD)</Label>
              <Input
                id="hourly_rate"
                type="number"
                min="0"
                step="0.01"
                value={formData.hourly_rate}
                onChange={(e) => setFormData(prev => ({ ...prev, hourly_rate: parseFloat(e.target.value) || 0 }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                placeholder="United States"
              />
            </div>

            <div>
              <Label htmlFor="region">State/Region</Label>
              <Input
                id="region"
                value={formData.region}
                onChange={(e) => setFormData(prev => ({ ...prev, region: e.target.value }))}
                placeholder="California"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Specializations</CardTitle>
          <CardDescription>
            Add your areas of expertise to help patients find you
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {formData.specializations.map((spec) => (
              <Badge key={spec} variant="secondary" className="gap-1">
                {spec}
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-auto p-0 w-4 h-4"
                  onClick={() => removeSpecialization(spec)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              value={newSpecialization}
              onChange={(e) => setNewSpecialization(e.target.value)}
              placeholder="Add specialization..."
              onKeyPress={(e) => e.key === 'Enter' && addSpecialization(newSpecialization)}
            />
            <Button
              onClick={() => addSpecialization(newSpecialization)}
              size="sm"
              variant="outline"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="text-sm text-muted-foreground">
            <p>Common specializations:</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {commonSpecializations.map((spec) => (
                <Button
                  key={spec}
                  size="sm"
                  variant="ghost"
                  className="h-auto p-1 text-xs"
                  onClick={() => addSpecialization(spec)}
                  disabled={formData.specializations.includes(spec)}
                >
                  {spec}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Languages</CardTitle>
          <CardDescription>
            Languages you can provide therapy in
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {formData.languages.map((lang) => (
              <Badge key={lang} variant="secondary" className="gap-1">
                {lang}
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-auto p-0 w-4 h-4"
                  onClick={() => removeLanguage(lang)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              value={newLanguage}
              onChange={(e) => setNewLanguage(e.target.value)}
              placeholder="Add language..."
              onKeyPress={(e) => e.key === 'Enter' && addLanguage(newLanguage)}
            />
            <Button
              onClick={() => addLanguage(newLanguage)}
              size="sm"
              variant="outline"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="text-sm text-muted-foreground">
            <p>Common languages:</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {commonLanguages.map((lang) => (
                <Button
                  key={lang}
                  size="sm"
                  variant="ghost"
                  className="h-auto p-1 text-xs"
                  onClick={() => addLanguage(lang)}
                  disabled={formData.languages.includes(lang)}
                >
                  {lang}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Availability</CardTitle>
          <CardDescription>
            Configure your marketplace visibility and availability
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="is_visible_marketplace">Visible in Marketplace</Label>
              <p className="text-sm text-muted-foreground">
                Allow patients to find and contact you through the marketplace
              </p>
            </div>
            <Switch
              id="is_visible_marketplace"
              checked={formData.is_visible_marketplace}
              onCheckedChange={(checked) => 
                setFormData(prev => ({ ...prev, is_visible_marketplace: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="is_accepting_patients">Accepting New Patients</Label>
              <p className="text-sm text-muted-foreground">
                Show that you're currently available for new patient bookings
              </p>
            </div>
            <Switch
              id="is_accepting_patients"
              checked={formData.is_accepting_patients}
              onCheckedChange={(checked) => 
                setFormData(prev => ({ ...prev, is_accepting_patients: checked }))
              }
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Profile'}
        </Button>
      </div>
    </div>
  );
}