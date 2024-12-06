import axios from 'axios';

// URL da API do Valorant
const VALORANT_API_URL = 'https://valorant-api.com/v1/agents';

// Interface para as habilidades do agente
export interface Ability {
  slot: string;
  displayName: string;
  description: string;
  displayIcon: string;
}

// Interface para o agente
export interface Agent {
  uuid: string;
  displayName: string;
  description: string;
  developerName: string;
  displayIcon: string;
  bustPortrait: string;
  fullPortrait: string;
  role: {
    uuid: string;
    displayName: string;
    description: string;
    displayIcon: string;
  };
  abilities: Ability[];
}

// Estrutura para a resposta da API
interface ApiResponse {
  data: Agent[];
}

// Instância do axios configurada para a API do Valorant
export const valorantApi = axios.create({
  baseURL: VALORANT_API_URL,
});

// Função para buscar todos os agentes
export const fetchAgents = async (): Promise<Agent[]> => {
  try {
    const response = await valorantApi.get<ApiResponse>(VALORANT_API_URL);
    
    // Exibindo a resposta para debug
    console.log('Dados recebidos da API do Valorant:', response.data);

    // Retorna os agentes (dados dentro do campo 'data')
    return response.data.data;
  } catch (error) {
    console.error('Erro ao buscar os agentes:', error);
    return [];
  }
};

// Função para buscar um agente específico por UUID
export const fetchAgentById = async (uuid: string): Promise<Agent | null> => {
  try {
    const response = await valorantApi.get<{ data: Agent }>(`${VALORANT_API_URL}/${uuid}`);

    // Exibindo a resposta para debug
    console.log('Dados recebidos da API do Valorant para o agente:', response.data);

    // Retorna o agente específico (dados dentro do campo 'data')
    return response.data.data;
  } catch (error) {
    console.error(`Erro ao buscar o agente com UUID ${uuid}:`, error);
    return null;
  }
};