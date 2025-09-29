
import React from 'react';
import { APP_NAME } from '../../constants';
import { Plan } from '../../types';

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
  userPlan: Plan;
}

const NavLink: React.FC<{
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
  isProFeature?: boolean;
  userPlan?: Plan;
}> = ({ label, icon, isActive, onClick, isProFeature = false, userPlan }) => {
  const isLocked = isProFeature && userPlan === Plan.Free;
  return (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        if (!isLocked) onClick();
      }}
      className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
        isActive ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-200'
      } ${isLocked ? 'cursor-not-allowed opacity-50' : ''}`}
    >
      {icon}
      <span className="ml-3">{label}</span>
      {isLocked && <LockIcon className="ml-auto h-4 w-4 text-yellow-500" />}
    </a>
  );
};

const DashboardIcon = ({ className = "h-5 w-5" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const QRIcon = ({ className = "h-5 w-5" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /><path d="M3 3h18v18H3z" stroke="none" /><path d="M4 4h4v4H4zM16 4h4v4h-4zM4 16h4v4H4zM16 16h4v4h-4zM9 9h6v6H9z" /></svg>;
const CampaignIcon = ({ className = "h-5 w-5" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
const AnalyticsIcon = ({ className = "h-5 w-5" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;
const ProfileIcon = ({ className = "h-5 w-5" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const LogoutIcon = ({ className = "h-5 w-5" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;
const LockIcon = ({ className = "h-5 w-5" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" /></svg>;


const Sidebar: React.FC<SidebarProps> = ({ activePage, onNavigate, userPlan }) => {
    
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { id: 'qrcodes', label: 'Meus QR Codes', icon: <QRIcon /> },
    { id: 'campaigns', label: 'Campanhas', icon: <CampaignIcon /> },
    { id: 'analytics', label: 'Analytics AI', icon: <AnalyticsIcon />, isPro: true },
  ];

  return (
    <div className="w-64 bg-surface h-full flex flex-col p-4 shadow-lg">
      <div className="flex items-center mb-8">
         <QRIcon className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-bold ml-2 text-dark">{APP_NAME}</h1>
      </div>
      <nav className="flex-grow space-y-2">
         {navItems.map(item => (
           <NavLink
             key={item.id}
             label={item.label}
             icon={item.icon}
             isActive={activePage === item.id}
             onClick={() => onNavigate(item.id)}
             isProFeature={item.isPro}
             userPlan={userPlan}
           />
         ))}
      </nav>
      <div className="mt-auto space-y-2">
          <NavLink
            label="Meu Perfil"
            icon={<ProfileIcon />}
            isActive={activePage === 'profile'}
            onClick={() => onNavigate('profile')}
           />
           <NavLink
            label="Sair"
            icon={<LogoutIcon />}
            isActive={false}
            onClick={() => onNavigate('login')}
           />
      </div>
    </div>
  );
};

export default Sidebar;
