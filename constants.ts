import { User, Plan, UserStatus, QRCode, QRCodeType, QRScan, Campaign, KPI } from './types';

export const APP_NAME = "QR Sense";

export const MOCK_USER: User = {
    id: 'user-1',
    name: 'Ada Lovelace',
    email: 'ada@example.com',
    plan: Plan.Free,
    status: UserStatus.Active,
    qrCodesActive: 1, // Updated count
    qrCodeLimit: 10,
};

export const MOCK_USER_PRO: User = {
    id: 'user-pro-1',
    name: 'Alan Turing',
    email: 'alan@example.com',
    plan: Plan.Pro,
    status: UserStatus.Active,
    qrCodesActive: 1, // Updated count
    qrCodeLimit: Infinity,
};


export const MOCK_QR_CODES: QRCode[] = [
    {
        id: 'qr-1',
        userId: 'user-1',
        name: 'Website Principal (Exemplo)',
        type: QRCodeType.URL,
        shortUrl: 'https://qrsns.io/a1b2c3d4',
        destinationUrl: 'https://mybusiness.com',
        dynamic: true,
        tags: ['marketing', 'website'],
        campaignId: 'campaign-1',
        active: true,
        createdAt: '2023-10-01T10:00:00Z',
        scanCount: 50,
        design: {
            foregroundColor: '#000000',
            backgroundColor: '#FFFFFF',
        }
    },
];

export const MOCK_SCANS: QRScan[] = Array.from({ length: 50 }, (_, i) => ({
    id: `scan-${i}`,
    qrId: 'qr-1', // All scans are linked to the single example QR code
    timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    country: 'Brasil',
    city: ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Salvador'][i % 4],
    device: ['Mobile', 'Desktop'][i % 2],
    os: ['Android', 'iOS', 'Windows'][i % 3],
    browser: ['Chrome', 'Safari', 'Firefox'][i % 3],
}));

export const MOCK_CAMPAIGNS: Campaign[] = [
    {
        id: 'campaign-1',
        userId: 'user-1',
        name: 'Lançamento de Verão',
        qrCodeIds: ['qr-1'],
    }
];

export const MOCK_KPIS: KPI[] = [
    { title: 'Scans Hoje', value: '8', change: '+10%', changeType: 'increase' },
    { title: 'Scans (7d)', value: '62', change: '-3%', changeType: 'decrease' },
    { title: 'Scans (30d)', value: '531', change: '+18%', changeType: 'increase' },
    { title: 'Novos Scans (24h)', value: '12', change: '+5%', changeType: 'increase' },
];

export const QR_CODE_TYPES = Object.values(QRCodeType);