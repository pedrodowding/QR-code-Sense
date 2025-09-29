
import React from 'react';
import { QRCode, QRScan } from '../types';
import Card from '../components/ui/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface QRCodeAnalyticsProps {
  qrcode: QRCode;
  scans: QRScan[];
}

const QRCodeAnalytics: React.FC<QRCodeAnalyticsProps> = ({ qrcode, scans }) => {
    
    const scansForThisQR = scans.filter(s => s.qrId === qrcode.id);

    // Data processing for charts
    const scanDataByDay = scansForThisQR.reduce((acc, scan) => {
        const date = new Date(scan.timestamp).toLocaleDateString('pt-BR');
        acc[date] = (acc[date] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const chartData = Object.keys(scanDataByDay).map(date => ({
        name: date,
        scans: scanDataByDay[date],
    })).sort((a,b) => new Date(a.name.split('/').reverse().join('-')).getTime() - new Date(b.name.split('/').reverse().join('-')).getTime()).slice(-30);

    const scansByCity = scansForThisQR.reduce((acc, scan) => {
        acc[scan.city] = (acc[scan.city] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const cityChartData = Object.keys(scansByCity).map(city => ({
        name: city,
        scans: scansByCity[city],
    })).sort((a,b) => b.scans - a.scans).slice(0, 5); // Top 5 cities

  return (
    <div className="p-6 space-y-6">
      <Card>
        <h2 className="text-2xl font-bold text-dark">Análise para: {qrcode.name}</h2>
        <p className="text-gray-500">Total de Scans: {qrcode.scanCount}</p>
      </Card>

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
    </div>
  );
};

export default QRCodeAnalytics;
