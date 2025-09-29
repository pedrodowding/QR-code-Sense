
import React from 'react';
import { KPI } from '../../types';
import Card from '../ui/Card';

interface KPICardProps {
  kpi: KPI;
  icon: React.ReactNode;
}

const ArrowUpIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
    </svg>
)

const ArrowDownIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
    </svg>
)


const KPICard: React.FC<KPICardProps> = ({ kpi, icon }) => {
  const isIncrease = kpi.changeType === 'increase';
  const changeColor = isIncrease ? 'text-green-500' : 'text-red-500';

  return (
    <Card className="flex flex-col">
      <div className="flex items-center justify-between">
        <h3 className="text-md font-medium text-secondary">{kpi.title}</h3>
        <div className="text-primary">{icon}</div>
      </div>
      <p className="text-3xl font-bold text-dark mt-2">{kpi.value}</p>
      <div className={`flex items-center text-sm mt-1 ${changeColor}`}>
        {isIncrease ? <ArrowUpIcon /> : <ArrowDownIcon />}
        <span className="ml-1 font-semibold">{kpi.change}</span>
        <span className="text-gray-500 ml-1">vs. período anterior</span>
      </div>
    </Card>
  );
};

export default KPICard;
