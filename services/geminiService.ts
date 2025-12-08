
import { GoogleGenAI } from "@google/genai";
import type { FinancialData } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. AI Assistant will not work.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const getAIAssistantResponse = async (query: string, data: FinancialData): Promise<string> => {
    if (!API_KEY) {
        return "The AI assistant is not available because the API key is not configured.";
    }

    // Sanitize and summarize data to fit within token limits
    const summarizedData = {
        summary: data.summary,
        // Take a sample of invoices and expenses to avoid overly large prompts
        recentInvoices: data.invoices.slice(0, 20).map(({ items, ...rest }) => rest), 
        recentExpenses: data.expenses.slice(0, 20),
        expenseCategories: Object.keys(data.expenseDistribution),
        invoiceStatuses: ['Paid', 'Pending', 'Overdue'],
    };

    const prompt = `
        You are an expert hospital financial analyst AI assistant. 
        Your role is to answer questions based on the provided financial data.
        Be concise and clear in your answers. If a question cannot be answered with the given data, state that clearly.
        Format your answers in a readable way. Use lists or simple text. Do not use Markdown tables.

        Here is a summary of the hospital's financial data:
        ${JSON.stringify(summarizedData, null, 2)}

        User's Question: "${query}"

        Your Answer:
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        
        if (response.text) {
            return response.text;
        }
        
        return "I'm sorry, I couldn't generate a response. Please try again.";

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        return "An error occurred while communicating with the AI assistant. Please check the console for details.";
    }
};
