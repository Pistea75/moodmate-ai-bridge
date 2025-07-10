
import ClinicianLayout from '../../layouts/ClinicianLayout';
import { ResourceLibrary } from '@/components/clinician/ResourceLibrary';

export default function ResourceLibraryPage() {
  return (
    <ClinicianLayout>
      <div className="container mx-auto px-4 py-6">
        <ResourceLibrary />
      </div>
    </ClinicianLayout>
  );
}
