import {
    formatarMoeda,
    formatarPorcentagem,
    formatarMesReferencia
} from "../utils/formatadores.js";

function criarCelula(conteudo) {
    const celula = document.createElement("td");
    celula.textContent = conteudo;

    return celula;
}

export function renderizarOrcamentosCategoria(orcamentos) {
    const corpoTabela = document.querySelector(
        "#corpo-tabela-orcamentos"
    );

    if (!corpoTabela) {
        throw new Error(
            "Corpo da tabela de orçamentos não encontrado."
        );
    }

    corpoTabela.replaceChildren();

    if (orcamentos.length === 0) {
        const linha = document.createElement("tr");

        const celula = criarCelula("Nenhum orçamento cadastrado");

        celula.colSpan = 6;

        linha.append(celula);
        corpoTabela.append(linha);

        return;
    }

    orcamentos.forEach((orcamento) => {
        const linha = document.createElement("tr");

        linha.dataset.id = orcamento.id;

        if (orcamento.percentualUtilizado >= 100) {
            linha.classList.add("orcamento-excedido");
        } else if (orcamento.percentualUtilizado >= 80) {
            linha.classList.add("orcamento-alerta");
        }

        linha.append(
            criarCelula(orcamento.categoria),
            criarCelula(
                formatarMesReferencia(
                    orcamento.mesReferencia
                )
            ),
            criarCelula(
                formatarMoeda(orcamento.valorLimite)
            ),
            criarCelula(
                formatarMoeda(orcamento.valorGasto)
            ),
            criarCelula(
                formatarMoeda(orcamento.valorRestante)
            ),
            criarCelula(
                formatarPorcentagem(
                    orcamento.percentualUtilizado
                )
            )
        );

        corpoTabela.append(linha);
    });
}