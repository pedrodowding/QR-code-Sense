
import { GoogleGenAI } from "@google/genai";
import { QRScan, QRCode } from '../types';

// This service assumes the API_KEY is set in the environment.
// In a real application, this would be handled on a secure backend.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    console.warn("Gemini API key not found. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const generatePromptForInsights = (scans: QRScan[], qrcodes: QRCode[]): string => {
    const scanDataCSV = "timestamp,city,device,os,browser,qr_name\n" + scans.map(s => {
        const qr = qrcodes.find(q => q.id === s.qrId);
        return `${s.timestamp},${s.city},${s.device},${s.os},${s.browser},${qr?.name || 'N/A'}`;
    }).join('\n');

    return `
      Analisando os seguintes dados de escaneamento de QR Code no formato CSV:
      ${scanDataCSV}

      Atue como um analista de marketing especialista. Forneça um resumo dos insights da última semana e duas recomendações acionáveis.
      - O que subiu ou caiu em termos de volume de scans?
      - Qual o perfil de dispositivo/OS mais comum?
      - Há alguma concentração geográfica notável?
      - Quais são as recomendações para otimizar a campanha com base nesses dados?

      Formate a resposta em HTML. Use tags como <h3> para títulos, <p> para parágrafos, <ul> e <li> para listas.
    `;
};

const generatePromptForNLQ = (question: string, scans: QRScan[], qrcodes: QRCode[]): string => {
     const scanDataCSV = "timestamp,city,device,os,browser,qr_name\n" + scans.map(s => {
        const qr = qrcodes.find(q => q.id === s.qrId);
        return `${s.timestamp},${s.city},${s.device},${s.os},${s.browser},${qr?.name || 'N/A'}`;
    }).join('\n');

    return `
        Com base nos seguintes dados de escaneamento de QR Code (CSV):
        ${scanDataCSV}

        Responda à seguinte pergunta do usuário: "${question}"

        Seja conciso e direto. Se a resposta envolver uma lista ou ranking, use uma tabela em HTML (com tags <table>, <tr>, <th>, <td>).
    `;
}

export const getAIInsights = async (scans: QRScan[], qrcodes: QRCode[]): Promise<string> => {
    if (!API_KEY) {
        return Promise.resolve("<h2>Insights de IA (Modo de Demonstração)</h2><ul><li><strong>Aumento de Scans</strong>: Houve um aumento de 15% nos scans durante a semana, principalmente no QR Code 'Website Principal'.</li><li><strong>Perfil de Usuário</strong>: A maioria dos usuários utiliza dispositivos móveis (80%) com sistema operacional Android (65%).</li><li><strong>Recomendação</strong>: Considere otimizar a página de destino para dispositivos Android e criar uma campanha de marketing direcionada para São Paulo, que representa 40% dos scans.</li></ul>");
    }

    try {
        const prompt = generatePromptForInsights(scans, qrcodes);
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error fetching AI insights:", error);
        return "Ocorreu um erro ao gerar os insights. Tente novamente mais tarde.";
    }
};

export const queryDataWithNaturalLanguage = async (question: string, scans: QRScan[], qrcodes: QRCode[]): Promise<string> => {
    if (!API_KEY) {
        return Promise.resolve(`<p><strong>Resposta para:</strong> "${question}" (Modo de Demonstração)</p><table><thead><tr><th>QR Code</th><th>Cidade</th><th>Scans</th></tr></thead><tbody><tr><td>Website Principal</td><td>São Paulo</td><td>512</td></tr><tr><td>Cardápio Digital</td><td>Rio de Janeiro</td><td>345</td></tr></tbody></table>`);
    }

    try {
        const prompt = generatePromptForNLQ(question, scans, qrcodes);
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error with NLQ:", error);
        return "Não foi possível processar sua pergunta. Tente novamente.";
    }
};
