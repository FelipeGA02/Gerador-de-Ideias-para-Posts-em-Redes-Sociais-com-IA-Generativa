export interface PostInput {
  produto: string;
  marca: string;
  publicoAlvo: string;
  diferenciais?: string;
  tomDeVoz: string;
  plataforma: string;
  tipoPostagem: string;
  objetivo: string;
  outros?: string;
}

export interface PostOutput {
  titulo: string;
  textoFinal: string;
  sugestoes: string[];
}