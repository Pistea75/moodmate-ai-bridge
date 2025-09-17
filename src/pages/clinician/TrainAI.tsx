
import { useState } from 'react';
import ClinicianLayout from '../../layouts/ClinicianLayout';
import { AudioChatInterface } from '@/components/AudioChatInterface';
import { useAuth } from '@/contexts/AuthContext';
import { PatientSelectorForAI } from '@/components/clinician/PatientSelectorForAI';
import { AIPersonalizationModal } from '@/components/clinician/AIPersonalizationModal';
import { Button } from '@/components/ui/button';
import { Settings, Users, Brain, BarChart, Calendar, CheckSquare } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function TrainAI() {
  const { user } = useAuth();
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const firstName = user?.user_metadata?.first_name || '';
  
  return (
    <ClinicianLayout>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold mb-2">Chat IA Dr. {firstName}</h1>
          <p className="text-muted-foreground -mt-1">
            Entrena tu IA con acceso completo a datos de pacientes y configuración personalizada
          </p>
        </div>
      </div>

      {/* Enhanced Info Card */}
      <Card className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Brain className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">IA con Acceso Completo a Datos y Configuración</h3>
              <p className="text-sm text-blue-800 mb-3">
                La IA tiene acceso completo a todos los datos del paciente Y al formulario de configuración personalizada:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-blue-700">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>Perfiles de pacientes e información de contacto</span>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart className="h-4 w-4" />
                  <span>Registros de humor, gráficos y análisis de tendencias</span>
                </div>
                <div className="flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  <span>Configuración de personalización IA y preferencias</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckSquare className="h-4 w-4" />
                  <span>Finalización de tareas y registros de ejercicios</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Notas de sesión e historial de asistencia</span>
                </div>
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  <span>Objetivos de tratamiento y evaluaciones clínicas</span>
                </div>
              </div>
              <p className="text-sm text-blue-800 mt-3 font-medium">
                Pregunta sobre pacientes específicos, analiza tendencias, compara progreso, u obtén insights clínicos basados en datos reales y configuración personalizada.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-white rounded-lg border p-4 mb-6">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-600" />
          Selección de Paciente y Configuración IA
        </h3>
          <div className="flex items-center justify-between">
            <PatientSelectorForAI
              selectedPatientId={selectedPatientId}
              onPatientSelect={setSelectedPatientId}
            />
            {selectedPatientId && (
              <AIPersonalizationModal
                patientId={selectedPatientId}
                clinicianId={user?.id}
                trigger={
                  <Button variant="outline" size="sm" className="gap-2">
                    <Settings className="h-4 w-4" />
                    Configurar Personalización IA
                  </Button>
                }
              />
            )}
          </div>
          {selectedPatientId && (
            <div className="mt-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-green-600" />
                <span>
                  ✅ La IA tiene <strong>acceso completo</strong> al formulario de configuración de este paciente.
                  Puede consultar y actualizar preferencias, estrategias, desencadenantes y más en tiempo real.
                </span>
              </div>
            </div>
          )}
      </div>

      <AudioChatInterface 
        isClinicianView 
        selectedPatientId={selectedPatientId}
      />
    </ClinicianLayout>
  );
}
