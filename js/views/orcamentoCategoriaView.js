import {
    formatarMoeda,
    formatarPorcentagem
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

function criarBotaoEditar(orcamento, aoEditar) {
    const botao = document.createElement("button");

    botao.type = "button";
    botao.textContent = "Editar";
    botao.classList.add("botao-editar");

    botao.addEventListener("click", () => {
        aoEditar(orcamento);
    });

    return botao;
}

export function confirmarExclusaoOrcamento() {
    return window.confirm(
        "Deseja realmente excluir este orçamento?"
    );
}

export function renderizarOrcamentosCategoria(orcamentos, aoEditar, aoExcluir) {
    const corpoTabela = document.querySelector("#corpo-tabela-orcamentos");

    if (!corpoTabela) {
        throw new Error("Corpo da tabela de orçamentos não encontrado.");
    }

    corpoTabela.replaceChildren();

    if (orcamentos.length === 0) {
        const linha = document.createElement("tr");

        const celula = criarCelula("Nenhum orçamento cadastrado.");

        celula.colSpan = 5;

        linha.append(celula);
        corpoTabela.append(linha);

        return;
    }

    orcamentos.forEach((orcamento) => {
        const linha = document.createElement("tr");
        const celulaAcoes = criarCelula("");

        celulaAcoes.classList.add("acoes-orcamento");

        linha.dataset.id = orcamento.id;

        if (orcamento.percentualAtingido >= 100) {
            linha.classList.add("orcamento-excedido");
        } else if (orcamento.percentualAtingido >= 80) {
            linha.classList.add("orcamento-alerta");
        }

        celulaAcoes.append(
            criarBotaoEditar(orcamento, aoEditar),
            criarBotaoExcluir(orcamento.id, aoExcluir)
        );

        linha.append(
            criarCelula(orcamento.categoriaNome),
            criarCelula(formatarMoeda(orcamento.valorLimite)),
            criarCelula(formatarMoeda(orcamento.valorUtilizado)),
            criarCelula(formatarPorcentagem(orcamento.percentualAtingido)),
            celulaAcoes
        );

        corpoTabela.append(linha);
    });
}
