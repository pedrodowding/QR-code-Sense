
export enum Plan {
  Free = 'Free',
  Pro = 'Pro',
}

export enum UserStatus {
  Active = 'Active',
  Inactive = 'Inactive',
}

export interface User {
  id: string;
  name: string;
  email: string;
  plan: Plan;
  status: UserStatus;
  qrCodesActive: number;
  qrCodeLimit: number;
}

export enum QRCodeType {
  URL = 'URL',
  vCard = 'vCard',
  WiFi = 'WiFi',
  WhatsApp = 'WhatsApp',
  Email = 'Email',
  SMS = 'SMS',
  Location = 'Location',
  Event = 'Event',
  PDF = 'PDF',
  LinkInBio = 'Link-in-bio',
}

export interface QRCode {
  id: string;
  userId: string;
  name: string;
  type: QRCodeType;
  shortUrl: string;
  destinationUrl: string;
  dynamic: boolean;
  tags: string[];
  campaignId?: string;
  active: boolean;
  createdAt: string;
  scanCount: number;
  design: {
    foregroundColor: string;
    backgroundColor: string;
    logo?: string;
  };
}

export interface QRScan {
  id: string;
  qrId: string;
  timestamp: string;
  country: string;
  city: string;
  device: string;
  os: string;
  browser: string;
}

export interface Campaign {
  id: string;
  userId: string;
  name: string;
  qrCodeIds: string[];
}

export interface KPI {
    title: string;
    value: string;
    change: string;
    changeType: 'increase' | 'decrease';
}
