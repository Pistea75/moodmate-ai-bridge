import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Globe, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' }
];

interface LanguageSelectorProps {
  onSave?: () => void;
}

export function LanguageSelector({ onSave }: LanguageSelectorProps = {}) {
  const { i18n, t } = useTranslation();
  const { toast } = useToast();
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setHasChanges(selectedLanguage !== i18n.language);
  }, [selectedLanguage, i18n.language]);

  const handleLanguageChange = (langCode: string) => {
    setSelectedLanguage(langCode);
  };

  const handleSaveChanges = () => {
    i18n.changeLanguage(selectedLanguage);
    // Save language preference to localStorage
    localStorage.setItem('i18nextLng', selectedLanguage);
    setHasChanges(false);
    
    toast({
      title: t('settings.saved', 'Settings Saved'),
      description: t('settings.languageSaved', 'Language preference has been saved successfully.'),
      duration: 3000,
    });

    onSave?.();
  };

  const currentLanguage = languages.find(lang => lang.code === selectedLanguage);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          {t('common.language')}
        </CardTitle>
        <CardDescription>
          {t('settings.languageDescription', 'Choose your preferred language for the interface')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">
            {t('settings.selectLanguage', 'Select Language')}
          </label>
          <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-full">
              <SelectValue>
                <div className="flex items-center gap-2">
                  <span>{currentLanguage?.flag}</span>
                  <span>{currentLanguage?.name}</span>
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  <div className="flex items-center gap-2">
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {hasChanges && (
          <div className="flex items-center gap-2 pt-4 border-t">
            <Button onClick={handleSaveChanges} className="flex items-center gap-2">
              <Check className="h-4 w-4" />
              {t('settings.saveChanges', 'Save Changes')}
            </Button>
            <p className="text-xs text-muted-foreground">
              {t('settings.unsavedChanges', 'You have unsaved language changes.')}
            </p>
          </div>
        )}
        
        <p className="text-xs text-muted-foreground">
          {t('settings.languageNote', 'The interface will update immediately when you save the language.')}
        </p>
      </CardContent>
    </Card>
  );
}