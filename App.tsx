import React, { useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './pages/Dashboard';
import QRCodeList from './pages/QRCodeList';
import QRCodeEditor from './pages/QRCodeEditor';
import AnalyticsAI from './pages/AnalyticsAI';
import Campaigns from './pages/Campaigns';
import Settings from './pages/Settings';
import QRCodeAnalytics from './pages/QRCodeAnalytics';
import { MOCK_USER, MOCK_USER_PRO, MOCK_QR_CODES, MOCK_SCANS, MOCK_CAMPAIGNS } from './constants';
import { User, QRCode, QRScan, Campaign, Plan } from './types';

const App: React.FC = () => {
    const [user, setUser] = useState<User>(MOCK_USER_PRO);
    const [activePage, setActivePage] = useState('dashboard');
    const [qrCodes, setQrCodes] = useState<QRCode[]>(MOCK_QR_CODES);
    const [scans, setScans] = useState<QRScan[]>(MOCK_SCANS);
    const [campaigns, setCampaigns] = useState<Campaign[]>(MOCK_CAMPAIGNS);
    const [editingQRCode, setEditingQRCode] = useState<QRCode | null | undefined>(undefined);
    const [selectedQRCode, setSelectedQRCode] = useState<QRCode | null>(null);

    const handleNavigate = (page: string) => {
        if (page !== 'qrcodes-editor') {
          setEditingQRCode(undefined); 
        }
        if (page !== 'qrcode-analytics') {
            setSelectedQRCode(null);
        }
        setActivePage(page);
    };

    const handleNewQRCode = () => {
        setEditingQRCode(null);
        setActivePage('qrcodes-editor');
    };
    
    const handleEditQRCode = (qrCode: QRCode) => {
        setEditingQRCode(qrCode);
        setActivePage('qrcodes-editor');
    };
    
    const handleSaveQRCode = (qrCodeData: Partial<QRCode>) => {
        if (editingQRCode) {
            setQrCodes(prev => prev.map(qr => qr.id === editingQRCode.id ? { ...qr, ...qrCodeData } as QRCode : qr));
        } else {
            const newQRCode: QRCode = {
                id: `qr-${Date.now()}`,
                userId: user.id,
                createdAt: new Date().toISOString(),
                scanCount: 0,
                ...qrCodeData
            } as QRCode;
            setQrCodes(prev => [...prev, newQRCode]);
            setUser(prevUser => ({...prevUser, qrCodesActive: prevUser.qrCodesActive + 1}));
        }
        setEditingQRCode(undefined);
        setActivePage('qrcodes');
    };
    
    const handleCancelEdit = () => {
        setEditingQRCode(undefined);
        setActivePage('qrcodes');
    };

    const handleSwitchUser = () => {
        setUser(currentUser => currentUser.plan === Plan.Pro ? MOCK_USER : MOCK_USER_PRO);
        setActivePage('dashboard');
    };
    
    const handleDeleteQRCode = (id: string) => {
        setQrCodes(prev => prev.filter(qr => qr.id !== id));
        setUser(prevUser => ({...prevUser, qrCodesActive: Math.max(0, prevUser.qrCodesActive - 1)}));
    };

    const handleViewAnalytics = (qrcode: QRCode) => {
        setSelectedQRCode(qrcode);
        setActivePage('qrcode-analytics');
    };
    
    const handleCreateCampaign = (campaignName: string) => {
        const newCampaign: Campaign = {
            id: `campaign-${Date.now()}`,
            userId: user.id,
            name: campaignName,
            qrCodeIds: [],
        };
        setCampaigns(prev => [...prev, newCampaign]);
    };

    const handleSimulateScan = (qrCodeId: string) => {
        // Increment scan count on the QRCode
        setQrCodes(prevQRs => prevQRs.map(qr => 
            qr.id === qrCodeId ? { ...qr, scanCount: qr.scanCount + 1 } : qr
        ));

        // Add a new scan record
        const newScan: QRScan = {
            id: `scan-${Date.now()}`,
            qrId: qrCodeId,
            timestamp: new Date().toISOString(),
            country: 'Brasil',
            city: ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Salvador', 'Curitiba'][Math.floor(Math.random() * 5)],
            device: ['Mobile', 'Desktop'][Math.floor(Math.random() * 2)],
            os: ['Android', 'iOS', 'Windows', 'MacOS'][Math.floor(Math.random() * 4)],
            browser: ['Chrome', 'Safari', 'Firefox', 'Edge'][Math.floor(Math.random() * 4)],
        };
        setScans(prevScans => [newScan, ...prevScans]);
    };


    const pageTitles: { [key: string]: string } = {
        dashboard: 'Dashboard',
        qrcodes: 'Meus QR Codes',
        'qrcodes-editor': editingQRCode ? 'Editar QR Code' : 'Criar Novo QR Code',
        'qrcode-analytics': `Análise - ${selectedQRCode?.name || ''}`,
        campaigns: 'Campanhas',
        analytics: 'Analytics AI',
        settings: 'Configurações',
        profile: 'Meu Perfil'
    };
    
    const renderContent = () => {
        if (activePage === 'qrcodes-editor') {
            return <QRCodeEditor qrCode={editingQRCode} onSave={handleSaveQRCode} onCancel={handleCancelEdit} />;
        }
        if (activePage === 'qrcode-analytics' && selectedQRCode) {
            return <QRCodeAnalytics qrcode={selectedQRCode} scans={scans} />;
        }
        
        switch (activePage) {
            case 'dashboard':
                return <Dashboard qrcodes={qrCodes} scans={scans} />;
            case 'qrcodes':
                return <QRCodeList qrcodes={qrCodes} onEdit={handleEditQRCode} onDelete={handleDeleteQRCode} onViewAnalytics={handleViewAnalytics} onSimulateScan={handleSimulateScan} />;
            case 'campaigns':
                return <Campaigns campaigns={campaigns} qrcodes={qrCodes} onCreateCampaign={handleCreateCampaign} />;
            case 'analytics':
                return <AnalyticsAI user={user} qrcodes={qrCodes} scans={scans} />;
            case 'settings':
            case 'profile':
                return <Settings user={user} onSwitchUser={handleSwitchUser} />;
            default:
                return <Dashboard qrcodes={qrCodes} scans={scans} />;
        }
    };

    return (
        <div className="flex h-screen bg-gray-100 text-gray-800">
            <Sidebar activePage={activePage} onNavigate={handleNavigate} userPlan={user.plan} />
            <main className="flex-1 flex flex-col overflow-hidden">
                <Header title={pageTitles[activePage] || 'QR Sense'} user={user} onNewQRCode={handleNewQRCode} />
                <div className="flex-1 overflow-y-auto bg-background">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default App;