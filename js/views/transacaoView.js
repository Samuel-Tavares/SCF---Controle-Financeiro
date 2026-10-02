import { formatarData, formatarMoeda } from "../utils/formatadores.js";

function criarCelula(conteudo) {
    const celula = document.createElement("td");
    celula.textContent = conteudo;

    return celula;
}

export function renderizarTransacoes(transacoes) {
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

        linha.dataset.id = transacao.id;

        linha.append(
            criarCelula(transacao.descricao),
            criarCelula(transacao.categoria),
            criarCelula(formatarData(transacao.data)),
            criarCelula(transacao.tipo),
            criarCelula(formatarMoeda(transacao.valor)),
            criarCelula("")
        );

        corpoTabela.append(linha);
    });
}