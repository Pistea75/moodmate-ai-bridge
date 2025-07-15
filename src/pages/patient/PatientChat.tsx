
import PatientLayout from '../../layouts/PatientLayout';
import { AudioChatInterface } from '@/components/AudioChatInterface';
import { useLanguage } from '@/contexts/LanguageContext';

export default function PatientChat() {
  const { t } = useLanguage();

  return (
    <PatientLayout>
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">
            {t('aiChat')}
          </h1>
          <p className="text-xl text-gray-600">
            {t('aiPersonalizedByClinician')}
          </p>
        </div>

        {/* Chat Interface */}
        <div className="bg-white rounded-xl shadow-sm border">
          <AudioChatInterface />
        </div>
      </div>
    </PatientLayout>
  );
}
