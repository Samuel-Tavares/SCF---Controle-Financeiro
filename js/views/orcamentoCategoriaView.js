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

function criarBotaoExcluir(id, aoExcluir) {
    const botao = document.createElement("button");

    botao.type = "button";
    botao.textContent = "Excluir";
    botao.classList.add("botao-excluir");

    botao.addEventListener("click", () => {
        aoExcluir(id);
    });

    return botao;
}

export function confirmarExclusaoOrcamento() {
    return window.confirm(
        "Deseja realmente excluir este orçamento?"
    );
}

export function renderizarOrcamentosCategoria(orcamentos, aoExcluir) {
    const corpoTabela = document.querySelector("#corpo-tabela-orcamentos");

    if (!corpoTabela) {
        throw new Error("Corpo da tabela de orçamentos não encontrado.");
    }

    corpoTabela.replaceChildren();

    if (orcamentos.length === 0) {
        const linha = document.createElement("tr");

        const celula = criarCelula("Nenhum orçamento cadastrado.");

        celula.colSpan = 7;

        linha.append(celula);
        corpoTabela.append(linha);

        return;
    }

    orcamentos.forEach((orcamento) => {
        const linha = document.createElement("tr");
        const celulaAcoes = criarCelula("");

        linha.dataset.id = orcamento.id;

        if (orcamento.percentualUtilizado >= 100) {
            linha.classList.add("orcamento-excedido");
        } else if (orcamento.percentualUtilizado >= 80) {
            linha.classList.add("orcamento-alerta");
        }

        celulaAcoes.append(
            criarBotaoExcluir(orcamento.id, aoExcluir)
        );

        linha.append(
            criarCelula(orcamento.categoria),
            criarCelula(formatarMesReferencia(orcamento.mesReferencia)),
            criarCelula(formatarMoeda(orcamento.valorLimite)),
            criarCelula(formatarMoeda(orcamento.valorGasto)),
            criarCelula(formatarMoeda(orcamento.valorRestante)),
            criarCelula(formatarPorcentagem(orcamento.percentualUtilizado)),
            celulaAcoes
        );
        
        corpoTabela.append(linha);
    });
}