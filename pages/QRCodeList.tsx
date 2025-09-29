import React, { useState } from 'react';
import { QRCode } from '../types';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import QRCodePreview from '../components/qrcodes/QRCodePreview';

interface QRCodeListProps {
  qrcodes: QRCode[];
  onEdit: (qrcode: QRCode) => void;
  onDelete: (id: string) => void;
  onViewAnalytics: (qrcode: QRCode) => void;
  onSimulateScan: (id: string) => void;
}

const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg>;
const DeleteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const LinkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>;
const AnalyticsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" /></svg>;
const ScanIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 5h-1M4 12H3m15-1h1m-2-7l-.707.707M6.707 6L6 6.707m.707 11.293l-.707.707M18 17.293l.707.707M4 4h2v2H4zm0 8h2v2H4zm0 8h2v2H4zm8-16h2v2h-2zm0 8h2v2h-2zm0 8h2v2h-2zm8-16h2v2h-2zm0 8h2v2h-2z" /></svg>;

const QRCodeList: React.FC<QRCodeListProps> = ({ qrcodes, onEdit, onDelete, onViewAnalytics, onSimulateScan }) => {
    const [modalQR, setModalQR] = useState<QRCode | null>(null);

    const handleSimulateAndClose = () => {
        if (modalQR) {
            onSimulateScan(modalQR.id);
            setModalQR(prev => prev ? {...prev, scanCount: prev.scanCount + 1} : null); // Optimistically update UI
        }
    }

    if (qrcodes.length === 0) {
        return (
            <div className="p-6 text-center">
                <Card>
                    <h2 className="text-xl font-semibold">Nenhum QR Code encontrado.</h2>
                    <p className="mt-2 text-gray-500">Clique em "Criar QR Code" para começar.</p>
                </Card>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-4">
            {qrcodes.map(qr => (
                <Card key={qr.id} className="flex flex-col md:flex-row items-start md:items-center gap-4">
                    <div className="flex-shrink-0 cursor-pointer" onClick={() => setModalQR(qr)}>
                        <QRCodePreview 
                            data={qr.destinationUrl} 
                            size={80} 
                            foregroundColor={qr.design.foregroundColor}
                            backgroundColor={qr.design.backgroundColor}
                        />
                    </div>
                    <div className="flex-grow">
                        <h3 className="font-bold text-lg text-dark">{qr.name}</h3>
                        <div className="flex items-center text-sm text-primary mt-1">
                            <LinkIcon />
                            <a href={qr.destinationUrl} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">{qr.destinationUrl}</a>
                        </div>
                        <div className="text-xs text-gray-500 mt-2">
                            Criado em: {new Date(qr.createdAt).toLocaleDateString('pt-BR')} &bull; Scans: {qr.scanCount.toLocaleString('pt-BR')}
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2 self-start md:self-center">
                        <Button variant="secondary" size="sm" onClick={() => onViewAnalytics(qr)}>
                            <AnalyticsIcon /> Ver Analytics
                        </Button>
                        <Button variant="secondary" size="sm" onClick={() => onEdit(qr)}>
                            <EditIcon /> Editar
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => onDelete(qr.id)}>
                            <DeleteIcon /> Excluir
                        </Button>
                    </div>
                </Card>
            ))}

            {/* Preview & Simulate Scan Modal */}
            {modalQR && (
                 <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={() => setModalQR(null)}>
                    <Card className="w-full max-w-sm text-center" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-xl font-bold mb-4">{modalQR.name}</h2>
                        <div className="flex justify-center my-4">
                           <QRCodePreview 
                                data={modalQR.destinationUrl} 
                                size={250}
                                foregroundColor={modalQR.design.foregroundColor}
                                backgroundColor={modalQR.design.backgroundColor}
                            />
                        </div>
                        <p className="text-sm text-gray-600 break-all mb-4">Destino: {modalQR.destinationUrl}</p>
                        <p className="text-lg font-semibold mb-6">Total de Scans: {modalQR.scanCount.toLocaleString('pt-BR')}</p>
                        <div className="flex flex-col sm:flex-row justify-center gap-2">
                           <Button onClick={handleSimulateAndClose} className="w-full">
                                <ScanIcon /> Simular Scan
                           </Button>
                           <Button variant="secondary" onClick={() => setModalQR(null)} className="w-full">
                                Fechar
                            </Button>
                        </div>
                    </Card>
                 </div>
            )}
        </div>
    );
};

export default QRCodeList;