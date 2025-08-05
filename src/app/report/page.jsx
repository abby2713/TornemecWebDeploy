'use client';
import ReportItem from "@/components/reportItem";
import "../../styles/reports.css"; // Asegúrate de que el archivo exista

import AuthenticatedLayout from '@/components/AuthenticatedLayout.jsx';

export default function Reportes() {
  return (
    <AuthenticatedLayout>
      <div className="reportes-container">
        <h1 className="titles">REPORTES</h1>
        
        <div className="report-card-wrapper">
          <ReportItem />
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
