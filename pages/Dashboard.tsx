import React from 'react';
import KPICard from '../components/dashboard/KPICard';
import { MOCK_KPIS } from '../constants';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { QRCode, QRScan } from '../types';

// Define jspdf types for TypeScript
declare global {
  interface Window {
    jspdf: any;
  }
}

interface DashboardProps {
    qrcodes: QRCode[];
    scans: QRScan[];
}

const ScanIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 5h-1M4 12H3m15-1h1m-2-7l-.707.707M6.707 6L6 6.707M6.707 18l-.707.707M18 17.293l.707.707M4 4h2v2H4zm0 8h2v2H4zm0 8h2v2H4zm8-16h2v2h-2zm0 8h2v2h-2zm0 8h2v2h-2zm8-16h2v2h-2zm0 8h2v2h-2z" /></svg>;
const DownloadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>;


const Dashboard: React.FC<DashboardProps> = ({ qrcodes, scans }) => {
    // Data processing for charts
    const scanDataByDay = scans.reduce((acc, scan) => {
        const date = new Date(scan.timestamp).toLocaleDateString('pt-BR');
        acc[date] = (acc[date] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const chartData = Object.keys(scanDataByDay).map(date => ({
        name: date,
        scans: scanDataByDay[date],
    })).sort((a,b) => new Date(a.name.split('/').reverse().join('-')).getTime() - new Date(b.name.split('/').reverse().join('-')).getTime()).slice(-30);

    const scansByCity = scans.reduce((acc, scan) => {
        acc[scan.city] = (acc[scan.city] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const cityChartData = Object.keys(scansByCity).map(city => ({
        name: city,
        scans: scansByCity[city],
    })).sort((a,b) => b.scans - a.scans).slice(0, 5); // Top 5 cities

    const recentActivity = qrcodes.sort((a,b) => b.scanCount - a.scanCount).slice(0, 5);

    const generatePDFReport = () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Title
        doc.setFontSize(22);
        doc.text("Relatório de Performance - QR Sense", 14, 22);
        doc.setFontSize(12);
        doc.setTextColor(100);
        doc.text(`Relatório gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 14, 30);

        // KPIs Summary
        doc.setFontSize(16);
        doc.text("Resumo de Métricas (Últimos 30 dias)", 14, 45);
        let kpiText = MOCK_KPIS.map(kpi => `${kpi.title}: ${kpi.value} (${kpi.change})`).join('\n');
        doc.setFontSize(11);
        doc.text(kpiText, 14, 52);

        // Top QR Codes Table
        doc.autoTable({
            startY: 70,
            head: [['QR Codes mais escaneados', 'Total de Scans', 'Data de Criação']],
            body: recentActivity.map(qr => [qr.name, qr.scanCount, new Date(qr.createdAt).toLocaleDateString('pt-BR')]),
            headStyles: { fillColor: [0, 123, 255] }
        });

        // Top Cities Table
        doc.autoTable({
            startY: (doc as any).lastAutoTable.finalY + 10,
            head: [['Top 5 Cidades', 'Total de Scans']],
            body: cityChartData.map(city => [city.name, city.scans]),
            headStyles: { fillColor: [0, 123, 255] }
        });

        doc.save(`relatorio_qrsense_${new Date().toISOString().split('T')[0]}.pdf`);
    };


  return (
    <div className="p-6 space-y-6">
      {/* Report Generation Card */}
      <Card>
          <div className="flex flex-col sm:flex-row justify-between items-center">
              <div>
                  <h3 className="text-lg font-semibold text-dark">Relatórios de Performance</h3>
                  <p className="text-sm text-gray-500 mt-1">Baixe um resumo das atividades dos seus QR Codes em formato PDF.</p>
              </div>
              <Button onClick={generatePDFReport} className="mt-4 sm:mt-0 w-full sm:w-auto">
                  <DownloadIcon />
                  Baixar Relatório PDF
              </Button>
          </div>
      </Card>
        
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {MOCK_KPIS.map(kpi => (
          <KPICard key={kpi.title} kpi={kpi} icon={<ScanIcon />} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <h3 className="text-lg font-semibold text-dark">Scans nos últimos 30 dias</h3>
          <div className="h-80 mt-4">
             <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="scans" stroke="#007BFF" strokeWidth={2} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
        
        <Card>
            <h3 className="text-lg font-semibold text-dark">Top 5 Cidades</h3>
            <div className="h-80 mt-4">
               <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={cityChartData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={80}/>
                        <Tooltip />
                        <Bar dataKey="scans" fill="#007BFF" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <h3 className="text-lg font-semibold text-dark">QR Codes mais escaneados</h3>
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="p-3">Nome do QR Code</th>
                <th className="p-3">Total de Scans</th>
                <th className="p-3">Data de Criação</th>
              </tr>
            </thead>
            <tbody>
              {recentActivity.map(activity => (
                <tr key={activity.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium">{activity.name}</td>
                  <td className="p-3">{activity.scanCount.toLocaleString('pt-BR')}</td>
                  <td className="p-3 text-gray-500">{new Date(activity.createdAt).toLocaleDateString('pt-BR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;