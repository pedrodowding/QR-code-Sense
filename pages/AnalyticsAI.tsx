
import React, { useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { getAIInsights, queryDataWithNaturalLanguage } from '../services/geminiService';
import { Plan, User, QRCode, QRScan } from '../types';

interface AnalyticsAIProps {
    user: User;
    qrcodes: QRCode[];
    scans: QRScan[];
}

const AnalyticsAI: React.FC<AnalyticsAIProps> = ({ user, qrcodes, scans }) => {
    const [insights, setInsights] = useState('');
    const [isLoadingInsights, setIsLoadingInsights] = useState(true);
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [isQuerying, setIsQuerying] = useState(false);

    useEffect(() => {
        const fetchInsights = async () => {
            setIsLoadingInsights(true);
            const result = await getAIInsights(scans, qrcodes);
            setInsights(result);
            setIsLoadingInsights(false);
        };

        if (user.plan === Plan.Pro) {
            fetchInsights();
        }
    }, [user.plan, qrcodes, scans]);
    
    const handleQuery = async () => {
        if (!question.trim()) return;
        setIsQuerying(true);
        setAnswer('');
        const result = await queryDataWithNaturalLanguage(question, scans, qrcodes);
        setAnswer(result);
        setIsQuerying(false);
    }

    if (user.plan === Plan.Free) {
        return (
            <div className="p-6 flex justify-center items-center h-full">
                <Card className="text-center">
                    <h2 className="text-2xl font-bold">Exclusivo para Assinantes Pro</h2>
                    <p className="mt-2 text-gray-600">Faça upgrade para o plano Pro e desbloqueie insights automáticos e a capacidade de conversar com seus dados.</p>
                    <Button className="mt-4">Ver Planos</Button>
                </Card>
            </div>
        )
    }

    return (
        <div className="p-6 space-y-6">
            <Card>
                <h2 className="text-xl font-semibold mb-2">Insights da IA</h2>
                {isLoadingInsights ? <p>Analisando seus dados...</p> : 
                    <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: insights }}/>
                }
            </Card>
            <Card>
                <h2 className="text-xl font-semibold mb-2">Pergunte aos Seus Dados</h2>
                <p className="text-sm text-gray-500 mb-4">Faça uma pergunta em linguagem natural sobre seus scans. Ex: "Quais 5 QRs mais cresceram no Nordeste nos últimos 14 dias?"</p>
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="Faça sua pergunta..."
                        className="w-full p-2 border rounded-md"
                        disabled={isQuerying}
                        onKeyDown={(e) => e.key === 'Enter' && handleQuery()}
                    />
                    <Button onClick={handleQuery} disabled={isQuerying}>
                        {isQuerying ? 'Pensando...' : 'Perguntar'}
                    </Button>
                </div>
                {answer && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-md border">
                        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: answer }}/>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default AnalyticsAI;
