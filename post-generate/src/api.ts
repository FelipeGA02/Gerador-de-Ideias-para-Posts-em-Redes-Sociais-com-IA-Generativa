import { PostInput, PostOutput } from './types';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/api/gerar';

export async function gerarPost(input: PostInput): Promise<PostOutput> {
  const prompt = `
Você é um Redator Sênior Especializado em Marketing Digital, Storytelling Persuasivo e Criação de Conteúdo para Redes Sociais.
Sua tarefa é gerar conteúdos otimizados conforme as informações estruturadas fornecidas pelo usuário.
Assuma integralmente o papel de redator sênior.

Siga mentalmente esta sequência:
analisar produto
analisar público
analisar tom de voz
analisar plataforma
definir elementos criativos
otimizar texto
revisar coerência
(Não liste este raciocínio na resposta.)

Considere os exemplos abaixo como modelo de estilo:

Exemplo A  
Entrada: Tênis esportivo / Nike / corrida / Instagram / texto curto  
Saída: “Você não corre. Você voa…”

Exemplo B  
Entrada: Sabonete vegano / Natura / consumo consciente  
Saída: “Menos química. Mais natureza…”

Exemplo C  
Entrada: Galaxy S25 Ultra / TikTok / câmera 8K  
Saída: roteiro curto em cenas.

Gerar texto claro, conciso, envolvente e alinhado ao tom solicitado.

Antes de entregar o resultado, revise:
coerência
tom
redundâncias
(Não explique este processo.)

A saída deve conter:
1. Título interno (frase-conceito)
2. Texto final
3. Sugestões complementares
IMPORTANTE:
Padronize a resposta usando a seguinte formatação, pois o frontend interpreta o texto com base nesses padrões:

- Use "## " antes do Título interno (h2).
- Use "**Texto**" para subtítulos (internamente tratados como h3).
- Use "* item" para listas de sugestões.
- Parágrafos comuns permanecem sem marcação.

Mantenha esta estrutura sempre. Não use outros formatos de Markdown.

Ajuste formato e ritmo de acordo com a plataforma (Instagram, TikTok, etc.).

Campos Estruturados:
Produto: ${input.produto}
Marca: ${input.marca}
Público-alvo: ${input.publicoAlvo}
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
      titulo: data.titulo || `Ideia para ${input.produto}`,
      textoFinal: data.texto || 'Não foi possível gerar o texto.',
      sugestoes: data.sugestoes || [],
    };
  } catch (error) {
    console.error('Erro ao chamar o backend:', error);
    throw error;
  }
}
