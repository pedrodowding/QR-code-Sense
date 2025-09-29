
import React, { useState, useEffect } from 'react';

interface QRCodePreviewProps {
  data: string;
  foregroundColor?: string;
  backgroundColor?: string;
  size?: number;
}

const QRCodePreview: React.FC<QRCodePreviewProps> = ({
  data,
  foregroundColor = '000000',
  backgroundColor = 'FFFFFF',
  size = 200,
}) => {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const fg = foregroundColor.replace('#', '');
    const bg = backgroundColor.replace('#', '');
    const url = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(data)}&size=${size}x${size}&color=${fg}&bgcolor=${bg}&qzone=1`;
    setQrCodeUrl(url);
  }, [data, foregroundColor, backgroundColor, size]);

  return (
    <div className="flex items-center justify-center p-4 border rounded-lg bg-gray-50" style={{ width: size + 32, height: size + 32 }}>
      {isLoading && <div className="text-sm text-gray-500">Gerando QR Code...</div>}
      <img
        src={qrCodeUrl}
        alt="QR Code"
        width={size}
        height={size}
        onLoad={() => setIsLoading(false)}
        style={{ display: isLoading ? 'none' : 'block' }}
      />
    </div>
  );
};

export default QRCodePreview;
