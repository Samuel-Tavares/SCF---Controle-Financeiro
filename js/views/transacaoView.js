import { formatarData, formatarMoeda } from "../utils/formatadores.js";

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

export function confirmarExclusao() {
    return window.confirm(
        "Deseja realmente excluir esta transação?"
    );
}

export function renderizarTransacoes(transacoes, aoExcluir) {
    const corpoTabela = document.querySelector("#corpo-tabela-transacoes");

    if (!corpoTabela) {
        throw new Error("Corpo da tabela de transações não encontrado.");
    }

    corpoTabela.replaceChildren();

    if (transacoes.length === 0) {
        const linha = document.createElement("tr");
        const celula = criarCelula("Nenhuma transação cadastrada.");

        celula.colSpan = 6;
        linha.append(celula);
        corpoTabela.append(linha);

        return;
    }

    transacoes.forEach((transacao) => {
        const linha = document.createElement("tr");
        const celulaAcoes = criarCelula("");

        linha.dataset.id = transacao.id;

        celulaAcoes.append(criarBotaoExcluir(transacao.id, aoExcluir));

        linha.append(
            criarCelula(transacao.descricao),
            criarCelula(transacao.categoria),
            criarCelula(formatarData(transacao.data)),
            criarCelula(transacao.tipo),
            criarCelula(formatarMoeda(transacao.valor)),
            celulaAcoes
        );

        corpoTabela.append(linha);
    });
}