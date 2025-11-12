import { PostInput, PostOutput } from './types';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = import.meta.env.VITE_GEMINI_API_URL;

export async function gerarPost(input: PostInput): Promise<PostOutput> {
  try {
    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GEMINI_API_KEY}`,
      },
      body: JSON.stringify({
        prompt: `
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
        `,
      }),
    });

    const data = await response.json();

    return {
      titulo: data.title || `Ideia para ${input.produto}`,
      textoFinal: data.text || `Aqui está um post sobre ${input.produto}`,
      sugestoes: data.suggestions || ['Use emojis', 'Faça perguntas', 'Inclua hashtags'],
    };
  } catch (error) {
    console.error(error);
    return {
      titulo: 'Erro ao gerar post',
      textoFinal: 'Não foi possível gerar o post. Tente novamente.',
      sugestoes: [],
    };
  }
}
