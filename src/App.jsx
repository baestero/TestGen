import React, { useState } from "react";
import { jsPDF } from "jspdf";

function App() {
  const [contexto, setContexto] = useState({
    historia: "",
    objetivo: "",
    preCondicoes: "",
  });
  const [casoTeste, setCasoTeste] = useState({
    id: "",
    passos: "",
    resultadoEsperado: "",
    resultadoObtido: "",
    status: "",
    evidencias: [],
  });

  const [listaCasos, setListaCasos] = useState([]);

  function handleChangeContexto(e) {
    const { name, value } = e.target;
    setContexto((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
  function handleChangeCasoTeste(e) {
    const { name, value } = e.target;
    setCasoTeste((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function adicionarCaso() {
    setListaCasos((prev) => {
      return [...prev, casoTeste];
    });

    setCasoTeste({
      id: "",
      passos: "",
      resultadoEsperado: "",
      resultadoObtido: "",
      status: "",
      evidencias: [], // 👈 adiciona de volta o campo
    });
  }

  async function gerarMarkdown() {
    let markdown = "# Relatório de Casos de Teste\n\n";

    // === CONTEXTO ===
    markdown += `## Contexto\n\n`;

    markdown += `**História:**\n`;
    markdown += `${contexto.historia || "-"}\n\n`;

    markdown += `**Objetivo:**\n`;
    markdown += `${contexto.objetivo || "-"}\n\n`;

    markdown += `**Pré-condições:**\n`;
    markdown += `${contexto.preCondicoes || "-"}\n\n`;

    markdown += `---\n\n`;

    // === CASOS DE TESTE ===
    markdown += `## Casos de Teste\n\n`;

    for (const [index, caso] of listaCasos.entries()) {
      markdown += `### Caso ${index + 1}\n\n`;

      markdown += `**ID do Caso de Teste:**\n`;
      markdown += `${caso.id || "-"}\n\n`;

      markdown += `**Passos:**\n`;
      markdown += `${caso.passos || "-"}\n\n`;

      markdown += `**Resultado Esperado:**\n`;
      markdown += `${caso.resultadoEsperado || "-"}\n\n`;

      markdown += `**Resultado Obtido:**\n`;
      markdown += `${caso.resultadoObtido || "-"}\n\n`;

      markdown += `**Status:**\n`;
      markdown += `${caso.status || "-"}\n\n`;

      if (caso.evidencias && caso.evidencias.length > 0) {
        markdown += `**Evidência(s):**\n`;
        caso.evidencias.forEach((_, i) => {
          markdown += `- [Evidência ${i + 1}: inserir_imagem_aqui.png]\n`;
        });
        markdown += `\n`;
      }

      markdown += `---\n\n`;
    }

    downloadMarkdown(markdown);
  }

  async function gerarPDF() {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const margin = 40;
    let y = margin;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Relatório de Casos de Teste", margin, y);
    y += 35;

    doc.setFontSize(12);

    // --- História ---
    doc.setFont("helvetica", "bold");
    doc.text("História:", margin, y);
    y += 15;
    doc.setFont("helvetica", "normal");
    doc.text(contexto.historia || "-", margin, y, {
      maxWidth: 520,
      lineHeightFactor: 1.4,
    });
    y += 35;

    // --- Objetivo ---
    doc.setFont("helvetica", "bold");
    doc.text("Objetivo:", margin, y);
    y += 15;
    doc.setFont("helvetica", "normal");
    doc.text(contexto.objetivo || "-", margin, y, {
      maxWidth: 520,
      lineHeightFactor: 1.4,
    });
    y += 35;

    // --- Pré-condições ---
    doc.setFont("helvetica", "bold");
    doc.text("Pré-condições:", margin, y);
    y += 15;
    doc.setFont("helvetica", "normal");
    doc.text(contexto.preCondicoes || "-", margin, y, {
      maxWidth: 520,
      lineHeightFactor: 1.4,
    });
    y += 35;

    doc.setDrawColor(200);
    doc.line(margin, y, 550, y);
    y += 30;

    // --- Casos ---
    for (let i = 0; i < listaCasos.length; i++) {
      const caso = listaCasos[i];

      if (y > 750) {
        doc.addPage();
        y = margin;
      }

      // ID do Caso
      doc.setFont("helvetica", "bold");
      doc.text("ID do Caso de Teste:", margin, y);
      y += 15;
      doc.setFont("helvetica", "normal");
      doc.text(caso.id || "-", margin, y);
      y += 35;

      // Passos
      doc.setFont("helvetica", "bold");
      doc.text("Passos:", margin, y);
      y += 15;
      doc.setFont("helvetica", "normal");
      const passosFormatados = (caso.passos || "-").split("\n");
      doc.text(passosFormatados, margin, y, {
        maxWidth: 520,
        lineHeightFactor: 1.4,
      });
      y += passosFormatados.length * 16 + 20;

      // Resultado Esperado
      doc.setFont("helvetica", "bold");
      doc.text("Resultado Esperado:", margin, y);
      y += 15;
      doc.setFont("helvetica", "normal");
      const esperadoFormatado = (caso.resultadoEsperado || "-").split("\n");
      doc.text(esperadoFormatado, margin, y, {
        maxWidth: 520,
        lineHeightFactor: 1.4,
      });
      y += esperadoFormatado.length * 16 + 20;

      // Resultado Esperado
      doc.setFont("helvetica", "bold");
      doc.text("Resultado Obtido:", margin, y);
      y += 15;
      doc.setFont("helvetica", "normal");
      const obtidoFormatado = (caso.resultadoObtido || "-").split("\n");
      doc.text(obtidoFormatado, margin, y, {
        maxWidth: 520,
        lineHeightFactor: 1.4,
      });
      y += obtidoFormatado.length * 16 + 20;

      // Status
      doc.setFont("helvetica", "bold");
      doc.text("Status:", margin, y);
      y += 15;
      doc.setFont("helvetica", "normal");
      doc.text(caso.status || "-", margin, y);
      y += 35;

      // Evidências
      if (caso.evidencias && caso.evidencias.length > 0) {
        doc.setFont("helvetica", "bold");
        doc.text("Evidência(s):", margin, y);
        y += 15;

        for (const img of caso.evidencias) {
          const image = new Image();
          image.src = img;
          await new Promise((resolve) => (image.onload = resolve));

          const imgWidth = image.width;
          const imgHeight = image.height;
          const maxWidth = 500;
          const scale = Math.min(1, maxWidth / imgWidth);
          const displayWidth = imgWidth * scale;
          const displayHeight = imgHeight * scale;

          if (y + displayHeight > 750) {
            doc.addPage();
            y = margin;
          }

          doc.addImage(img, "JPEG", margin, y, displayWidth, displayHeight);
          y += displayHeight + 25;
        }
      }

      doc.setDrawColor(200);
      doc.line(margin, y, 550, y);
      y += 40;
    }

    doc.save("relatorio_de_testes.pdf");
  }

  function downloadMarkdown(texto) {
    // 1. Criar um "Blob" (um objeto de arquivo na memória)
    const blob = new Blob([texto], { type: "text/markdown" });

    // 2. Criar um link <a> temporário
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "relatorio_de_testes.md"; // Nome do arquivo

    // 3. Adicionar, clicar e remover o link
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  }

  function handleAutoNumbering(e, handleChange, fieldName) {
    const textarea = e.target;
    const value = textarea.value;
    const cursorPos = textarea.selectionStart;

    // Se o campo está vazio e o usuário começa a digitar, adiciona o "1. "
    if (value.trim() === "" && e.key !== "Backspace" && e.key.length === 1) {
      handleChange({
        target: { name: fieldName, value: `1. ${e.key}` },
      });
      e.preventDefault();
      return;
    }

    // Se o usuário pressionar Enter → cria nova linha numerada
    if (e.key === "Enter") {
      e.preventDefault();

      const numLinhas = value.split("\n").length;
      const novaLinha = `\n${numLinhas + 1}. `;
      const novoTexto =
        value.substring(0, cursorPos) + novaLinha + value.substring(cursorPos);

      handleChange({
        target: { name: fieldName, value: novoTexto },
      });

      // Reposiciona o cursor corretamente
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd =
          cursorPos + novaLinha.length;
      }, 0);
    }
  }

  return (
    <>
      <header className="p-8 bg-[#20242d] border-b border-[#ff3c05] text-center">
        <p className="text-[#ff3c05] text-3xl font-bold mb-2">TestGen</p>
        <p className="text-[#e7e7e7]">Gerador de Casos de Teste</p>
      </header>

      <div className="flex *:grow justify-center">
        <section className="m-10 max-w-4xl">
          <div className="bg-white p-8 rounded-2xl border border-gray-300">
            <div className="mb-6">
              <h1 className="text-[1.25rem] mb-4">Contexto de Teste</h1>

              <label htmlFor="">História</label>
              <input
                type="text"
                name="historia"
                className="border border-gray-300 rounded-lg p-2 mb-3 w-full"
                value={contexto.historia}
                onChange={handleChangeContexto}
              />
              <label htmlFor="">Objetivo</label>
              <input
                type="text"
                name="objetivo"
                className="border border-gray-300 rounded-lg p-2 mb-3 w-full"
                value={contexto.objetivo}
                onChange={handleChangeContexto}
              />
              <label htmlFor="">Pré Condições</label>
              <textarea
                type="text"
                name="preCondicoes"
                className="border border-gray-300 rounded-lg p-3 mb-3 w-full h-48 resize-y align-top leading-relaxed"
                value={contexto.preCondicoes}
                onChange={handleChangeContexto}
                placeholder="1. Descreva a primeira pré condição..."
                onKeyDown={(e) =>
                  handleAutoNumbering(e, handleChangeContexto, "preCondicoes")
                }
              />
            </div>

            <div className="mb-4">
              <h1 className="text-[1.25rem] mb-6">Casos de Teste</h1>

              <label htmlFor="">ID do Caso de Teste</label>
              <input
                type="text"
                name="id"
                className="border border-gray-300 rounded-lg p-2 mb-3 w-full"
                value={casoTeste.id}
                onChange={handleChangeCasoTeste}
              />

              <label htmlFor="">Passos</label>
              <textarea
                name="passos"
                className="border border-gray-300 rounded-lg p-3 mb-3 w-full h-48 resize-y align-top leading-relaxed"
                value={casoTeste.passos}
                onChange={handleChangeCasoTeste}
                placeholder="1. Descreva o primeiro passo..."
                onKeyDown={(e) =>
                  handleAutoNumbering(e, handleChangeCasoTeste, "passos")
                }
              />

              <label htmlFor="">Resultado Esperado</label>
              <input
                type="text"
                name="resultadoEsperado"
                className="border border-gray-300 rounded-lg p-2 mb-3 w-full"
                value={casoTeste.resultadoEsperado}
                onChange={handleChangeCasoTeste}
              />

              <label htmlFor="">Resultado Obtido</label>
              <input
                type="text"
                name="resultadoObtido"
                className="border border-gray-300 rounded-lg p-2 mb-3 w-full"
                value={casoTeste.resultadoObtido}
                onChange={handleChangeCasoTeste}
              />

              <label htmlFor="">Status</label>
              <input
                type="text"
                name="status"
                className="border border-gray-300 rounded-lg p-2 mb-3 w-full"
                value={casoTeste.status}
                onChange={handleChangeCasoTeste}
              />
            </div>

            <label htmlFor="">Evidências (imagens)</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files);
                files.forEach((file) => {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setCasoTeste((prev) => ({
                      ...prev,
                      evidencias: [...prev.evidencias, reader.result], // 👈 base64
                    }));
                  };
                  reader.readAsDataURL(file);
                });
              }}
              className="border border-gray-300 rounded-lg p-2 mb-3 w-full cursor-pointer"
            />

            {/* Preview das imagens selecionadas */}
            <div className="flex flex-wrap gap-3 mb-4 cursor-pointer">
              {casoTeste.evidencias.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Evidência ${index + 1}`}
                  className="w-32 h-32 object-cover rounded-lg border"
                />
              ))}
            </div>

            <button
              onClick={adicionarCaso}
              className="px-6 py-4 rounded-lg bg-orange-600 text-white cursor-pointe mb-4 cursor-pointer"
            >
              Adicionar Caso de Teste
            </button>
            <button
              onClick={gerarMarkdown}
              className="px-6 py-4 rounded-lg bg-orange-600 text-white cursor-pointer mb-8"
            >
              Gerar Relatório
            </button>

            <button
              onClick={gerarPDF}
              className="px-6 py-4 rounded-lg bg-green-600 text-white cursor-pointer"
            >
              Gerar PDF
            </button>

            {listaCasos.map((caso, i) => (
              <div key={i} className="bg-[#e7e7e7] p-4 rounded-2xl mb-4">
                <p>
                  <strong>{caso.id}</strong>
                </p>
                <p>{caso.passos}</p>
                <p>{caso.resultadoEsperado}</p>
                <p>{caso.resultadoObtido}</p>
                <p>{caso.status}</p>

                {caso.evidencias && caso.evidencias.length > 0 && (
                  <div className="mt-2">
                    <p className="font-semibold">Evidências:</p>
                    <div className="flex flex-wrap gap-3 mt-2">
                      {caso.evidencias.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt={`Evidência ${idx + 1}`}
                          className="w-28 h-28 object-cover rounded-lg border"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

export default App;
