import { useState } from 'react';
import { PostInput, PostOutput } from './types';
import { gerarPost } from './api';

const App = () => {
  const [input, setInput] = useState<PostInput>({
    produto: '',
    marca: '',
    publicoAlvo: '',
    diferenciais: '',
    tomDeVoz: '',
    plataforma: '',
    tipoPostagem: '',
    objetivo: '',
    outros: '',
  });

  const [output, setOutput] = useState<PostOutput | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await gerarPost(input);
    setOutput(result);
    setLoading(false);
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Gerador de Posts para Redes Sociais</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
        {Object.keys(input).map((key) => (
          <div key={key} style={{ marginBottom: '0.5rem' }}>
            <label style={{ display: 'block', textTransform: 'capitalize' }}>{key}:</label>
            <input
              name={key}
              value={(input as any)[key]}
              onChange={handleChange}
              style={{ width: '100%', padding: '0.5rem' }}
            />
          </div>
        ))}
        <button type="submit" style={{ padding: '0.5rem 1rem' }}>Gerar Post</button>
      </form>

      {loading && <p>Gerando post...</p>}

      {output && (
        <div>
          <h2>{output.titulo}</h2>
          <p>{output.textoFinal}</p>
          <h3>Sugestões:</h3>
          <ul>
            {output.sugestoes.map((sug, i) => <li key={i}>{sug}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
};

export default App;
