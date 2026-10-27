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

export function confirmarExclusaoOrcamentoMensal() {
    return window.confirm(
        "Deseja realmente excluir este orçamento mensal?"
    );
}

export function renderizarOrcamentosMensais(
    orcamentos,
    aoEditar,
    aoExcluir
) {
    const corpoTabela = document.querySelector(
        "#corpo-tabela-orcamentos-mensais"
    );

    if (!corpoTabela) {
        throw new Error(
            "Corpo da tabela de orçamentos mensais não encontrado."
        );
    }

    corpoTabela.replaceChildren();

    if (orcamentos.length === 0) {
        const linha = document.createElement("tr");

        const celula = criarCelula(
            "Nenhum orçamento mensal cadastrado."
        );

        celula.colSpan = 5;

        linha.append(celula);
        corpoTabela.append(linha);

        return;
    }

    orcamentos.forEach((orcamento) => {
        const linha = document.createElement("tr");
        const celulaAcoes = criarCelula("");

        linha.dataset.id = orcamento.id;

        celulaAcoes.classList.add(
            "acoes-orcamento"
        );

        if (orcamento.percentualAtingido >= 100) {
            linha.classList.add(
                "orcamento-excedido"
            );
        } else if (
            orcamento.percentualAtingido >= 80
        ) {
            linha.classList.add(
                "orcamento-alerta"
            );
        }

        celulaAcoes.append(
            criarBotaoEditar(orcamento, aoEditar),
            criarBotaoExcluir(orcamento.id, aoExcluir)
        );

        linha.append(
            criarCelula(formatarMesReferencia(orcamento.mes)),
            criarCelula(formatarMoeda(orcamento.valorLimite)),
            criarCelula(formatarMoeda(orcamento.valorUtilizado)),
            criarCelula(formatarPorcentagem(orcamento.percentualAtingido)),
            celulaAcoes
        );

        corpoTabela.append(linha);
    });
}

