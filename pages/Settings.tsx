import React from 'react';
import { User, Plan } from '../types';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

interface SettingsProps {
    user: User;
    onSwitchUser: () => void; // For demo purpose
}

const CheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);

const PlanCard: React.FC<{ title: string; price: string; features: string[]; isCurrent: boolean; onSelect: () => void, popular?: boolean }> = ({ title, price, features, isCurrent, onSelect, popular }) => (
    <div className={`border rounded-lg p-6 relative ${isCurrent ? 'border-primary ring-2 ring-primary' : 'border-gray-300'}`}>
        {popular && <div className="absolute top-0 -translate-y-1/2 bg-primary text-white px-3 py-1 text-sm font-semibold rounded-full">Popular</div>}
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="text-3xl font-bold my-4">{price}<span className="text-base font-normal text-gray-500">/mês</span></p>
        <ul className="space-y-2 text-gray-600 mb-6">
            {features.map(f => <li key={f} className="flex items-center"><CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" /><span>{f}</span></li>)}
        </ul>
        <Button onClick={onSelect} disabled={isCurrent} className="w-full" variant={isCurrent ? 'secondary' : 'primary'}>
            {isCurrent ? 'Plano Atual' : title === 'Free' ? 'Fazer Downgrade' : 'Fazer Upgrade'}
        </Button>
    </div>
);


const Settings: React.FC<SettingsProps> = ({ user, onSwitchUser }) => {
    return (
        <div className="p-6 space-y-6">
            {/* Profile Section */}
            <Card>
                <h2 className="text-xl font-semibold mb-4">Meu Perfil</h2>
                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-gray-500">Nome</label>
                        <input type="text" value={user.name} readOnly className="mt-1 block w-full p-2 border bg-gray-100 rounded-md shadow-sm"/>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-500">Email</label>
                        <input type="email" value={user.email} readOnly className="mt-1 block w-full p-2 border bg-gray-100 rounded-md shadow-sm"/>
                    </div>
                </div>
            </Card>

            {/* Plan & Billing Section */}
            <Card>
                 <h2 className="text-xl font-semibold mb-4">Plano e Faturamento</h2>
                 <div className="mb-6 p-4 rounded-lg bg-blue-50 border border-blue-200 text-blue-800">
                    <h3 className="font-bold text-lg">Seu Plano: {user.plan}</h3>
                    {user.plan === Plan.Free ? (
                        <p className="mt-1">Você está usando <strong>{user.qrCodesActive} de {user.qrCodeLimit}</strong> QR Codes ativos. Faça upgrade para ter QRs ilimitados e acesso a recursos de IA.</p>
                    ) : (
                        <p className="mt-1">Obrigado por ser um cliente Pro! Você tem acesso a todos os recursos, incluindo QRs ilimitados e Analytics com IA.</p>
                    )}
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <PlanCard 
                        title="Free"
                        price="R$ 0"
                        features={['Até 10 QR Codes ativos', 'Dashboard completo', 'Métricas e relatórios']}
                        isCurrent={user.plan === Plan.Free}
                        onSelect={() => { /* Handle Downgrade */ }}
                    />
                     <PlanCard 
                        title="Pro"
                        price="R$ 29,90"
                        features={['QR Codes ativos ilimitados', 'Dashboard completo', 'Análise com IA e Recomendações', 'Suporte prioritário']}
                        isCurrent={user.plan === Plan.Pro}
                        onSelect={() => { /* Handle Upgrade */ }}
                        popular
                    />
                 </div>
            </Card>

            <Card>
                <h2 className="text-xl font-semibold mb-2">Simulação de Usuário</h2>
                <p className="text-sm text-gray-600 mb-4">Para fins de demonstração, você pode alternar entre um usuário do plano Free e Pro para ver as diferenças no acesso aos recursos.</p>
                <Button variant="secondary" onClick={onSwitchUser}>
                    Alternar para usuário {user.plan === Plan.Pro ? 'Free' : 'Pro'}
                </Button>
            </Card>
        </div>
    );
}

export default Settings;
