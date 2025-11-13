import { JSX, useState } from "react";
import "./App.css";
import { PostInput, PostOutput } from "./types";
import { gerarPost } from "./api";

function App() {
  const [formData, setFormData] = useState<PostInput>({
    produto: "",
    marca: "",
    publicoAlvo: "",
    tomDeVoz: "",
    plataforma: "",
    tipoPostagem: "",
    objetivo: "",
    diferenciais: "",
    outros: "",
  });

  const [gerando, setGerando] = useState(false);
  const [resultado, setResultado] = useState<PostOutput | null>(null);

  const formatOutput = (text: string) => {
    if (!text) return null;

    const lines = text.split("\n").filter((line) => line.trim() !== "");
    const elements: JSX.Element[] = [];
    let currentList: JSX.Element[] = [];

    const pushCurrentList = () => {
      if (currentList.length > 0) {
        elements.push(
          <ul key={`ul-${elements.length}`} className="output-list">
            {currentList}
          </ul>
        );
        currentList = [];
      }
    };

    lines.forEach((line, i) => {
      if (line.startsWith("##") || line.startsWith("**")) {
        pushCurrentList();
        elements.push(
          <h2 key={i} className="output-title">
            {line.replace(/^##\s*/, "").replace(/\*\*/g, "")}
          </h2>
        );
      } else if (/^\*\*(.+)\*\*$/.test(line.trim())) {
        pushCurrentList();
        elements.push(
          <h3 key={i} className="output-subtitle">
            {line.replace(/\*\*/g, "")}
          </h3>
        );
      } else if (/^\*\s+/.test(line)) {
        currentList.push(
          <li key={i}>
            {line.replace(/^\*\s+/, "").replace(/\*\*/g, "")}
          </li>
        );
      } else {
        pushCurrentList();
        elements.push(
          <p key={i} className="output-text">
            {line}
          </p>
        );
      }
    });

    pushCurrentList();
    return elements;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setGerando(true);
    setResultado(null);

    try {
      const data = await gerarPost(formData);
      setResultado(data);
    } catch (error) {
      console.error("Erro ao gerar post:", error);
      alert("Erro ao gerar post. Verifique o console para mais detalhes.");
    } finally {
      setGerando(false);
    }
  };

  return (
    <div className="container">
      <h1 className="title">Gerador de Ideias para Posts com IA</h1>

      <div className="form">
        <h2 className="form-title">Preencha os dados do seu produto</h2>

        <div className="grid">
          <div className="form-group">
            <label className="label">Produto</label>
            <input
              name="produto"
              value={formData.produto}
              onChange={handleChange}
              className="input"
              placeholder="Ex: Galaxy S25 Ultra"
            />
          </div>

          <div className="form-group">
            <label className="label">Marca</label>
            <input
              name="marca"
              value={formData.marca}
              onChange={handleChange}
              className="input"
              placeholder="Ex: Samsung"
            />
          </div>

          <div className="form-group">
            <label className="label">Público Alvo</label>
            <input
              name="publicoAlvo"
              value={formData.publicoAlvo}
              onChange={handleChange}
              className="input"
              placeholder="Ex: Jovens adultos amantes de tecnologia"
            />
          </div>

          <div className="form-group">
            <label className="label">Tom de Voz</label>
            <input
              name="tomDeVoz"
              value={formData.tomDeVoz}
              onChange={handleChange}
              className="input"
              placeholder="Ex: Animado, moderno, inspirador..."
            />
          </div>

          <div className="form-group">
            <label className="label">Plataforma</label>
            <select
              name="plataforma"
              value={formData.plataforma}
              onChange={handleChange}
              className="select"
            >
              <option value="">Selecione...</option>
              <option value="Instagram">Instagram</option>
              <option value="TikTok">TikTok</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Twitter">Twitter / X</option>
              <option value="YouTube">YouTube</option>
            </select>
          </div>

          <div className="form-group">
            <label className="label">Tipo de Postagem</label>
            <select
              name="tipoPostagem"
              value={formData.tipoPostagem}
              onChange={handleChange}
              className="select"
            >
              <option value="">Selecione...</option>
              <option value="Texto Curto">Texto Curto</option>
              <option value="Texto Longo">Texto Longo</option>
              <option value="Roteiro de Vídeo">Roteiro de Vídeo</option>
              <option value="Carrossel">Carrossel</option>
              <option value="Anúncio">Anúncio</option>
            </select>
          </div>

          <div className="form-group full-width large-field">
            <label className="label">Objetivo</label>
            <textarea
              name="objetivo"
              value={formData.objetivo}
              onChange={handleChange}
              className="textarea"
              placeholder="Ex: Mostrar a nova câmera 8K e recursos de zoom..."
            />
          </div>

          <div className="form-group full-width large-field">
            <label className="label">Diferenciais</label>
            <textarea
              name="diferenciais"
              value={formData.diferenciais}
              onChange={handleChange}
              className="textarea"
              placeholder="Ex: Design moderno, inovação, performance superior..."
            />
          </div>

          <div className="form-group full-width large-field">
            <label className="label">Outros</label>
            <textarea
              name="outros"
              value={formData.outros}
              onChange={handleChange}
              className="textarea"
              placeholder="Ex: Incluir hashtags, call-to-action, tempo de vídeo..."
            />
          </div>
        </div>

        <button
          className="button"
          onClick={handleSubmit}
          disabled={gerando}
        >
          {gerando ? "Gerando..." : "Gerar Ideia de Post"}
        </button>
      </div>

      {resultado && (
        <div className="output-card">
          {formatOutput(resultado.textoFinal)}

          {resultado.sugestoes && resultado.sugestoes.length > 0 && (
            <>
              <h3 className="output-subtitle">Sugestões Complementares</h3>
              <ul className="output-list">
                {resultado.sugestoes.map((sugestao, index) => (
                  <li key={index}>{sugestao}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
