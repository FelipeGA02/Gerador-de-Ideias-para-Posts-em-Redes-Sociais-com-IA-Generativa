import { PostInput, PostOutput } from './types';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/api/gerar';

export async function gerarPost(input: PostInput): Promise<PostOutput> {
  const prompt = `
Você é um Redator Sênior Especializado em Marketing Digital. 
Crie um post com base nos dados:
Produto: ${input.produto}
Marca: ${input.marca}
Público Alvo: ${input.publicoAlvo}
Diferenciais: ${input.diferenciais}
Tom de voz: ${input.tomDeVoz}
Plataforma: ${input.plataforma}
Tipo de postagem: ${input.tipoPostagem}
Objetivo: ${input.objetivo}
Outros: ${input.outros}
`;

  try {
    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Erro da API (backend):', response.status, errorData);
      throw new Error(`Erro da API: ${response.status} - ${errorData}`);
    }

    const data = await response.json();

    return {
      titulo: `Ideia para ${input.produto}`,
      textoFinal: data.texto || 'Não foi possível gerar o texto.',
      sugestoes: [],
    };
  } catch (error) {
    console.error('Erro ao chamar o backend:', error);
    throw error;
  }
}
