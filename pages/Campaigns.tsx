import React, { useState } from 'react';
import { Campaign, QRCode } from '../types';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

interface CampaignsProps {
    campaigns: Campaign[];
    qrcodes: QRCode[];
    onCreateCampaign: (name: string) => void;
}

const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>;

const Campaigns: React.FC<CampaignsProps> = ({ campaigns, qrcodes, onCreateCampaign }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newCampaignName, setNewCampaignName] = useState('');

    const handleSave = () => {
        if (newCampaignName.trim()) {
            onCreateCampaign(newCampaignName.trim());
            setNewCampaignName('');
            setIsModalOpen(false);
        }
    };
    
    const getQRCodeNameById = (id: string) => {
        return qrcodes.find(qr => qr.id === id)?.name || 'QR Code não encontrado';
    }

    return (
        <div className="p-6 space-y-6">
            <Card>
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-semibold">Campanhas</h2>
                        <p className="text-sm text-gray-500 mt-1">Organize seus QR Codes em campanhas para melhor rastreamento.</p>
                    </div>
                    <Button onClick={() => setIsModalOpen(true)} leftIcon={<PlusIcon />}>
                        Criar Campanha
                    </Button>
                </div>
            </Card>

            {campaigns.length > 0 ? (
                <div className="space-y-4">
                    {campaigns.map(campaign => (
                        <Card key={campaign.id}>
                            <h3 className="text-lg font-bold text-dark">{campaign.name}</h3>
                            <p className="text-sm text-gray-600 mt-2 mb-3">
                                {campaign.qrCodeIds.length > 0 ? 'QR Codes na campanha:' : 'Nenhum QR Code nesta campanha.'}
                            </p>
                            {campaign.qrCodeIds.length > 0 && (
                                <ul className="list-disc list-inside space-y-1">
                                    {campaign.qrCodeIds.map(qrId => (
                                        <li key={qrId} className="text-sm">{getQRCodeNameById(qrId)}</li>
                                    ))}
                                </ul>
                            )}
                        </Card>
                    ))}
                </div>
            ) : (
                <Card className="text-center py-12">
                     <h3 className="text-lg font-semibold">Nenhuma campanha criada ainda.</h3>
                    <p className="text-gray-500 mt-2">Clique em "Criar Campanha" para começar a organizar seus QR Codes.</p>
                </Card>
            )}

            {/* Create Campaign Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <Card className="w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Nova Campanha</h2>
                        <div>
                            <label htmlFor="campaignName" className="block text-sm font-medium text-gray-700 mb-1">Nome da Campanha</label>
                            <input
                                type="text"
                                id="campaignName"
                                value={newCampaignName}
                                onChange={(e) => setNewCampaignName(e.target.value)}
                                className="w-full p-2 border rounded-md"
                                placeholder="Ex: Lançamento de Inverno"
                            />
                        </div>
                        <div className="flex justify-end space-x-2 mt-6">
                            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                            <Button onClick={handleSave}>Salvar</Button>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default Campaigns;