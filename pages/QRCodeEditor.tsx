import React, { useState, useEffect } from 'react';
import { QRCode, QRCodeType } from '../types';
import { QR_CODE_TYPES } from '../constants';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import QRCodePreview from '../components/qrcodes/QRCodePreview';

interface QRCodeEditorProps {
    qrCode?: QRCode | null;
    onSave: (qr: Partial<QRCode>) => void;
    onCancel: () => void;
}

const QRCodeEditor: React.FC<QRCodeEditorProps> = ({ qrCode, onSave, onCancel }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<Partial<QRCode>>(qrCode || {
        name: 'Novo QR Code',
        type: QRCodeType.URL,
        destinationUrl: 'https://',
        dynamic: true,
        active: true,
        tags: [],
        design: {
            foregroundColor: '#000000',
            backgroundColor: '#FFFFFF',
        }
    });
    const [errors, setErrors] = useState<{ destinationUrl?: string }>({});

    useEffect(() => {
        if (!formData.destinationUrl) {
            setErrors(e => ({ ...e, destinationUrl: 'A URL de destino é obrigatória.' }));
        } else {
            try {
                // Use URL constructor for robust validation. It throws an error if invalid.
                new URL(formData.destinationUrl);
                // If it's valid, clear the error for destinationUrl
                setErrors(e => {
                    const newErrors = { ...e };
                    delete newErrors.destinationUrl;
                    return newErrors;
                });
            } catch (_) {
                // If it throws an error, the URL is invalid.
                setErrors(e => ({ ...e, destinationUrl: 'Por favor, insira uma URL válida (ex: https://exemplo.com).' }));
            }
        }
    }, [formData.destinationUrl]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleDesignChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            design: { ...prev.design, [name]: value }
        }));
    }

    const totalSteps = 4;
    const isFormValid = Object.keys(errors).length === 0;
    
    const renderStepContent = () => {
        switch (step) {
            case 1: // Tipo
                return (
                    <div>
                        <h3 className="font-semibold text-lg mb-2">1. Escolha o Tipo</h3>
                        <p className="text-sm text-gray-600 mb-4">Selecione o tipo de conteúdo para o seu QR Code.</p>
                        <select name="type" value={formData.type} onChange={handleChange} className="w-full p-2 border rounded-md">
                            {QR_CODE_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                        </select>
                    </div>
                );
            case 2: // Destino
                 return (
                    <div>
                        <h3 className="font-semibold text-lg mb-2">2. Conteúdo e Destino</h3>
                         <p className="text-sm text-gray-600 mb-4">Insira o conteúdo ou o link de destino.</p>
                        <label className="block text-sm font-medium mb-1">Nome do QR Code</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded-md mb-4"/>

                        <label className="block text-sm font-medium mb-1">URL de Destino</label>
                        <input 
                            type="text" 
                            name="destinationUrl" 
                            value={formData.destinationUrl} 
                            onChange={handleChange} 
                            className={`w-full p-2 border rounded-md transition-colors ${errors.destinationUrl ? 'border-red-500 focus:ring-red-500 ring-1 ring-red-500' : 'border-gray-300 focus:ring-primary'}`}
                        />
                         {errors.destinationUrl && <p className="text-red-600 text-xs mt-1">{errors.destinationUrl}</p>}
                    </div>
                );
            case 3: // Design
                return (
                     <div>
                        <h3 className="font-semibold text-lg mb-2">3. Design e Cores</h3>
                        <p className="text-sm text-gray-600 mb-4">Personalize a aparência do seu QR Code.</p>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Cor Primária</label>
                                <input type="color" name="foregroundColor" value={formData.design?.foregroundColor} onChange={handleDesignChange} className="w-full h-10 p-1 border rounded-md" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Cor de Fundo</label>
                                <input type="color" name="backgroundColor" value={formData.design?.backgroundColor} onChange={handleDesignChange} className="w-full h-10 p-1 border rounded-md" />
                            </div>
                        </div>
                    </div>
                );
            case 4: // Rastreamento
                 return (
                    <div>
                        <h3 className="font-semibold text-lg mb-2">4. Rastreamento (Opcional)</h3>
                         <p className="text-sm text-gray-600 mb-4">Adicione tags para organizar e filtrar seus QR Codes.</p>
                         <label className="block text-sm font-medium mb-1">Tags (separadas por vírgula)</label>
                        <input type="text" name="tags" value={formData.tags?.join(', ')} onChange={e => setFormData(p => ({...p, tags: e.target.value.split(',').map(t => t.trim())}))} className="w-full p-2 border rounded-md"/>
                    </div>
                );
            default:
                return null;
        }
    }

    return (
        <div className="p-6">
            <Card>
                 <h2 className="text-2xl font-bold text-dark mb-4">{qrCode ? 'Editar' : 'Criar'} QR Code</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2">
                       <div className="mb-4">
                           <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div className="bg-primary h-2.5 rounded-full" style={{ width: `${(step / totalSteps) * 100}%` }}></div>
                            </div>
                       </div>
                        
                        <div className="p-6 border rounded-lg min-h-[300px]">
                          {renderStepContent()}
                        </div>

                        <div className="flex justify-between mt-6">
                            <Button variant="secondary" onClick={() => setStep(s => Math.max(1, s - 1))} disabled={step === 1}>
                                Anterior
                            </Button>
                             {step < totalSteps && (
                                <Button onClick={() => setStep(s => Math.min(totalSteps, s + 1))} disabled={step === 2 && !isFormValid}>
                                    Próximo
                                </Button>
                            )}
                            {step === totalSteps && (
                                <Button onClick={() => onSave(formData)} disabled={!isFormValid}>
                                    Salvar QR Code
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col items-center">
                        <h3 className="font-semibold mb-4">Pré-visualização</h3>
                        <QRCodePreview 
                           data={formData.destinationUrl && isFormValid ? formData.destinationUrl : ''} 
                           foregroundColor={formData.design?.foregroundColor}
                           backgroundColor={formData.design?.backgroundColor}
                        />
                         <Button variant="secondary" className="mt-4 w-full" onClick={onCancel}>
                            Cancelar
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default QRCodeEditor;