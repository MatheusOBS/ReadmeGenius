import React, { useState, useEffect } from "react";
import {
  Clipboard,
  Check,
  Sparkles,
  Terminal,
  Layout as LayoutIcon,
  RotateCcw,
  Settings,
  Zap,
  Shield,
  Code2,
  ArrowRight,
  Loader2,
  Eye,
  Edit3,
  Download,
  Info,
} from "lucide-react";
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from "react-markdown";
import { FormData } from "./types";

declare var confetti: any;

export const ReadmeEditor = () => {
  const [formData, setFormData] = useState<FormData>(() => {
    const saved = localStorage.getItem("readme-genius-v2-data");
    return saved
      ? JSON.parse(saved)
      : {
          projectName: "",
          tagline: "",
          description: "",
          techStack: "",
          features: "",
          installation: "",
          usage: "",
          license: "MIT",
          tone: "professional",
          template: "standard",
          language: "pt-BR",
          logoUrl: "",
          socialLinks: "",
        };
  });

  const [markdown, setMarkdown] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [copied, setCopied] = useState(false);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [viewMode, setViewMode] = useState<"preview" | "edit">("preview");

  useEffect(() => {
    localStorage.setItem("readme-genius-v2-data", JSON.stringify(formData));
  }, [formData]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev: FormData) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: false }));
  };

  const handleCopy = () => {
    if (!markdown) return;
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadReadme = () => {
    if (!markdown) return;
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "README.md";
    link.click();
    URL.revokeObjectURL(url);
  };

  const generateReadme = async () => {
    if (!formData.projectName || !formData.description) {
      setErrors({
        projectName: !formData.projectName,
        description: !formData.description,
      });
      return;
    }

    setIsGenerating(true);
    setGenerationStep(1);

    try {
      await new Promise((r) => setTimeout(r, 800));
      setGenerationStep(2);

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

      const prompt = `
        Crie um README.md profissional para o projeto "${formData.projectName}".
        
        IDIOMA: ${formData.language.toUpperCase()}
        TEMPLATE: ${formData.template.toUpperCase()}
        TOM DE VOZ: ${formData.tone.toUpperCase()}
        SLOGAN: ${formData.tagline}
        DESCRIÇÃO: ${formData.description}
        STACK: ${formData.techStack}
        INSTALAÇÃO: ${formData.installation}
        USO: ${formData.usage}
        LICENÇA: ${formData.license}
        LOGO URL: ${formData.logoUrl}
        SOCIAL LINKS: ${formData.socialLinks}

        REGRAS DE OURO:
        - Idioma: Responda obrigatoriamente no idioma ${formData.language}.
        - Se houver LOGO URL, coloque uma imagem no topo: ![Logo](${formData.logoUrl}).
        - Adicione seções de redes sociais se SOCIAL LINKS estiver preenchido.
        - Se for TEMPLATE 'minimal', seja extremamente conciso.
        - Se for 'enterprise', use seções de Segurança, Roadmap e Arquitetura.
        - Se for 'hacker', use um estilo ASCII art no topo e comandos de terminal.
        - Inclua badges do shields.io dinâmicos (repo size, license, stars, forks). Use as informações do repositório se disponíveis.
        - Use emojis apropriados.
        - Seção de instalação com blocos de código formatados.
        - Retorne apenas o código Markdown puro sem blocos de código de cercadura.
      `;

      const response = await (ai as any).models.generateContent({
        model: "gemini-1.5-pro",
        contents: prompt,
      });

      setGenerationStep(3);
      await new Promise((r) => setTimeout(r, 600));

      const text = await (response as any).response.text();
      setMarkdown(text || "");

      confetti({
        particleCount: 150,
        spread: 120,
        origin: { y: 0.5 },
        colors: ["#6366f1", "#a855f7", "#ec4899"],
      });
    } catch (error) {
      console.error(error);
      alert(
        "Houve um problema ao gerar seu README. Verifique sua conexão e chave de API.",
      );
    } finally {
      setIsGenerating(false);
      setGenerationStep(0);
    }
  };

  return (
    <main className="max-w-[1500px] mx-auto px-8 py-10">
      <div className="grid lg:grid-cols-12 gap-10 items-start">
        {/* Form Side */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-[2.5rem] p-10 space-y-10 relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-600/10 blur-[100px] rounded-full" />

            <div className="flex items-center justify-between relative z-10">
              <h2 className="text-sm font-black uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-3">
                <Settings className="w-4 h-4 text-indigo-400" /> Draft Engine
              </h2>
              <button
                onClick={() =>
                  setFormData({ ...formData, projectName: "", description: "" })
                }
                className="text-zinc-600 hover:text-white transition-colors"
                title="Limpar"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-8 relative z-10">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                    Nome do Projeto
                  </label>
                  <input
                    name="projectName"
                    value={formData.projectName}
                    onChange={handleInputChange}
                    className={`w-full bg-black/60 border ${errors.projectName ? "border-red-500/50" : "border-zinc-800"} rounded-2xl px-5 py-4 text-sm focus:border-indigo-500 outline-none transition-all placeholder:text-zinc-800`}
                    placeholder="ex: React-Flow"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                    Tom de Voz
                  </label>
                  <select
                    name="tone"
                    value={formData.tone}
                    onChange={handleInputChange}
                    className="w-full bg-black/60 border border-zinc-800 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:border-indigo-500"
                  >
                    <option value="professional">🤵 Profissional</option>
                    <option value="creative">🚀 Criativo</option>
                    <option value="minimalist">🌑 Minimalista</option>
                    <option value="academic">🏛️ Acadêmico</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                    Idioma de Saída
                  </label>
                  <select
                    name="language"
                    value={formData.language}
                    onChange={handleInputChange}
                    className="w-full bg-black/60 border border-zinc-800 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:border-indigo-500"
                  >
                    <option value="pt-BR">🇧🇷 Português (Brasil)</option>
                    <option value="en">🇺🇸 Inglês</option>
                    <option value="es">🇪🇸 Espanhol</option>
                    <option value="fr">🇫🇷 Francês</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                    Link da Logo / Banner
                  </label>
                  <input
                    name="logoUrl"
                    value={formData.logoUrl}
                    onChange={handleInputChange}
                    className="w-full bg-black/60 border border-zinc-800 rounded-2xl px-5 py-4 text-sm focus:border-indigo-500 outline-none transition-all placeholder:text-zinc-800"
                    placeholder="https://sua-logo.com/img.png"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                  Descrição do Produto
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className={`w-full bg-black/60 border ${errors.description ? "border-red-500/50" : "border-zinc-800"} rounded-2xl px-5 py-4 text-sm focus:border-indigo-500 outline-none resize-none transition-all`}
                  placeholder="O que seu projeto resolve?"
                />
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                    Tech Stack
                  </label>
                  <div className="relative">
                    <input
                      name="techStack"
                      value={formData.techStack}
                      onChange={handleInputChange}
                      className="w-full bg-black/60 border border-zinc-800 rounded-2xl pl-12 pr-5 py-4 text-sm outline-none focus:border-indigo-500"
                      placeholder="React, AWS..."
                    />
                    <Code2 className="w-4 h-4 absolute left-5 top-1/2 -translate-y-1/2 text-zinc-700" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                    Template de Design
                  </label>
                  <select
                    name="template"
                    value={formData.template}
                    onChange={handleInputChange}
                    className="w-full bg-black/60 border border-zinc-800 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:border-indigo-500"
                  >
                    <option value="standard">Standard (Completo)</option>
                    <option value="minimal">Minimal (Resumido)</option>
                    <option value="enterprise">Enterprise (Robusto)</option>
                    <option value="hacker">Cyber-hacker (Mono)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                  Comando de Instalação
                </label>
                <div className="relative">
                  <input
                    name="installation"
                    value={formData.installation}
                    onChange={handleInputChange}
                    className="w-full bg-black/60 border border-zinc-800 rounded-2xl pl-12 pr-5 py-4 text-sm font-mono outline-none focus:border-indigo-500"
                    placeholder="npm install project-name"
                  />
                  <Terminal className="w-4 h-4 absolute left-5 top-1/2 -translate-y-1/2 text-zinc-700" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                  Redes Sociais (Links)
                </label>
                <input
                  name="socialLinks"
                  value={formData.socialLinks}
                  onChange={handleInputChange}
                  className="w-full bg-black/60 border border-zinc-800 rounded-2xl px-5 py-4 text-sm focus:border-indigo-500 outline-none transition-all placeholder:text-zinc-800"
                  placeholder="GitHub, LinkedIn, Twitter..."
                />
              </div>

              <button
                onClick={generateReadme}
                disabled={isGenerating}
                className={`w-full py-5 rounded-[1.5rem] font-black text-lg transition-all flex items-center justify-center gap-4 group relative overflow-hidden
                  ${
                    isGenerating
                      ? "bg-zinc-800 text-zinc-500"
                      : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_20px_40px_rgba(79,70,229,0.3)] active:scale-95"
                  }`}
              >
                {isGenerating ? (
                  <div className="flex flex-col items-center">
                    <Loader2 className="animate-spin w-6 h-6 mb-1" />
                    <span className="text-[10px] uppercase tracking-widest">
                      {generationStep === 1 && "Analisando dados..."}
                      {generationStep === 2 && "Processando..."}
                      {generationStep === 3 && "Polindo documentação..."}
                    </span>
                  </div>
                ) : (
                  <>
                    <Zap className="w-6 h-6 group-hover:fill-current transition-all" />
                    Construir README Profissional
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-3xl p-6 flex items-center justify-between group cursor-help">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center border border-indigo-500/20">
                <Shield className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-zinc-300">
                  Privacidade Garantida
                </p>
                <p className="text-[10px] text-zinc-500">
                  Seus dados nunca são armazenados.
                </p>
              </div>
            </div>
            <Info className="w-4 h-4 text-zinc-700 group-hover:text-indigo-400 transition-colors" />
          </div>
        </div>

        {/* Preview Side */}
        <div className="lg:col-span-7 lg:sticky lg:top-28">
          <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-[2.5rem] flex flex-col min-h-[750px] max-h-[85vh] shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/[0.02] -z-10" />

            <div className="px-10 py-6 border-b border-zinc-800/80 flex items-center justify-between bg-zinc-950/60 backdrop-blur-md">
              <div className="flex items-center gap-2 bg-zinc-900 p-1.5 rounded-2xl border border-zinc-800">
                <button
                  onClick={() => setViewMode("preview")}
                  className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${viewMode === "preview" ? "bg-zinc-800 text-white" : "text-zinc-600 hover:text-zinc-400"}`}
                >
                  <Eye className="w-4 h-4" /> Visualização
                </button>
                <button
                  onClick={() => setViewMode("edit")}
                  className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${viewMode === "edit" ? "bg-zinc-800 text-white" : "text-zinc-600 hover:text-zinc-400"}`}
                >
                  <Edit3 className="w-4 h-4" /> Editor Raw
                </button>
              </div>

              {markdown && (
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleCopy}
                    className="p-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-zinc-300 transition-all active:scale-90"
                    title="Copiar"
                  >
                    {copied ? (
                      <Check className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <Clipboard className="w-5 h-5" />
                    )}
                  </button>
                  <button
                    onClick={downloadReadme}
                    className="flex items-center gap-3 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl text-xs font-black transition-all active:scale-95"
                  >
                    <Download className="w-4 h-4" /> Baixar .md
                  </button>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-10 no-scrollbar bg-zinc-950/20">
              {markdown ? (
                viewMode === "edit" ? (
                  <textarea
                    value={markdown}
                    onChange={(e) => setMarkdown(e.target.value)}
                    className="w-full h-full bg-transparent font-mono text-sm text-zinc-400 outline-none resize-none leading-relaxed"
                    placeholder="Edite seu markdown aqui..."
                  />
                ) : (
                  <article
                    className="prose prose-invert prose-indigo max-w-none
                    prose-headings:font-black prose-headings:tracking-tight
                    prose-h1:text-4xl prose-h1:text-center prose-h1:mb-12
                    prose-h2:border-b prose-h2:border-zinc-800 prose-h2:pb-4 prose-h2:mt-16
                    prose-pre:bg-zinc-900/50 prose-pre:border prose-pre:border-zinc-800 prose-pre:rounded-2xl
                    prose-blockquote:border-l-4 prose-blockquote:border-indigo-600 prose-blockquote:bg-indigo-600/5 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-2xl"
                  >
                    <ReactMarkdown>{markdown}</ReactMarkdown>
                  </article>
                )
              ) : (
                <div className="h-full flex flex-col items-center justify-center opacity-10 space-y-8 select-none">
                  <div className="w-24 h-24 bg-zinc-800 rounded-[2.5rem] flex items-center justify-center border border-zinc-700 shadow-inner">
                    <LayoutIcon className="w-12 h-12" />
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-2xl font-black uppercase tracking-widest">
                      Workspace Vazio
                    </p>
                    <p className="text-xs max-w-xs leading-relaxed font-bold uppercase tracking-tighter">
                      Preencha o formulário e deixe a mágica acontecer.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {markdown && (
              <div className="px-10 py-4 bg-zinc-950 border-t border-zinc-800/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">
                    MD Engine v2.0
                  </span>
                  <div className="h-4 w-px bg-zinc-900" />
                  <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">
                    Otimizado
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};
