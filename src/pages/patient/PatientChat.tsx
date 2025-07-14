
import PatientLayout from '../../layouts/PatientLayout';
import { AudioChatInterface } from '@/components/AudioChatInterface';
import { useLanguage } from '@/contexts/LanguageContext';

export default function PatientChat() {
  const { t } = useLanguage();

  return (
    <PatientLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('aiChat')}
          </h1>
          <p className="text-gray-600 text-lg">
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
