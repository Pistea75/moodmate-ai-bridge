
import ClinicianLayout from '../../layouts/ClinicianLayout';
import { useState, useEffect } from 'react';
import { ReportViewerModal } from '@/components/clinician/ReportViewerModal';
import { ReportsHeader } from '@/components/clinician/reports/ReportsHeader';
import { ReportsFilters } from '@/components/clinician/reports/ReportsFilters';
import { ReportsList } from '@/components/clinician/reports/ReportsList';
import { ReportsDebugInfo } from '@/components/clinician/reports/ReportsDebugInfo';
import { useReportsData } from '@/hooks/useReportsData';

export default function Reports() {
  const {
    reports,
    loading,
    error,
    patientNames,
    deletingReportId,
    formatReportTitle,
    handleDelete,
    handleRefresh
  } = useReportsData();

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedReport, setSelectedReport] = useState<any | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Debug logging
  useEffect(() => {
    console.log('Reports page - loading:', loading);
    console.log('Reports page - error:', error);
    console.log('Reports page - reports count:', reports.length);
    console.log('Reports page - reports data:', reports);
  }, [loading, error, reports]);

  // Extract unique report types for the filter dropdown
  const reportTypes = [...new Set(reports.map(report => report.report_type))].filter(Boolean);

  const filteredReports = reports.filter(report => {
    const patientName = patientNames[report.patient_id] || '';
    const reportTitle = formatReportTitle(report);
    const matchesSearch = reportTitle.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          report.report_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          patientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || report.report_type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleViewReport = (report: any) => {
    setSelectedReport(report);
    setModalOpen(true);
  };

  const handleDownload = (report: any) => {
    // This function is now handled in ReportsList component
  };

  return (
    <ClinicianLayout>
      <div className="space-y-6">
        <ReportsHeader loading={loading} onRefresh={handleRefresh} />

        <ReportsFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          typeFilter={typeFilter}
          onTypeFilterChange={setTypeFilter}
          reportTypes={reportTypes}
        />

        <ReportsDebugInfo
          loading={loading}
          error={error}
          reportsCount={reports.length}
          filteredCount={filteredReports.length}
        />

        <ReportsList
          reports={filteredReports}
          loading={loading}
          error={error}
          searchTerm={searchTerm}
          typeFilter={typeFilter}
          formatReportTitle={formatReportTitle}
          onViewReport={handleViewReport}
          onDeleteReport={handleDelete}
          deletingReportId={deletingReportId}
          onRefresh={handleRefresh}
        />

        <ReportViewerModal
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setSelectedReport(null);
          }}
          report={selectedReport ? { ...selectedReport, title: formatReportTitle(selectedReport) } : null}
          onDownload={(report) => {
            // The download functionality is handled in ReportsList component
            // This is kept for compatibility with the modal
          }}
        />
      </div>
    </ClinicianLayout>
  );
}
