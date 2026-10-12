import { formatarData, formatarMoeda } from "../utils/formatadores.js";

function criarCelula(conteudo) {
    const celula = document.createElement("td");
    celula.textContent = conteudo;

    return celula;
}

function criarBotao(texto, classe, aoClicar) {
    const botao = document.createElement("button");

    botao.type = "button";
    botao.textContent = texto;
    botao.classList.add(classe);
    botao.addEventListener("click", aoClicar);

    return botao;
}

export function confirmarExclusao() {
    return window.confirm(
        "Deseja realmente excluir esta transação?"
    );
}

export function renderizarTransacoes(
    transacoes,
    aoEditar,
    aoExcluir,
    mensagemListaVazia = "Nenhuma transação cadastrada."
) {
    const corpoTabela = document.querySelector("#corpo-tabela-transacoes");

    if (!corpoTabela) {
        throw new Error("Corpo da tabela de transações não encontrado.");
    }

    corpoTabela.replaceChildren();

    if (transacoes.length === 0) {
        const linha = document.createElement("tr");
        const celula = criarCelula(mensagemListaVazia);

        celula.colSpan = 6;
        linha.append(celula);
        corpoTabela.append(linha);

        return;
    }

    transacoes.forEach((transacao) => {
        const linha = document.createElement("tr");
        const celulaAcoes = criarCelula("");

        linha.dataset.id = transacao.id;
        celulaAcoes.classList.add("acoes-transacao");

        const botaoEditar = criarBotao(
            "Editar",
            "botao-editar",
            () => aoEditar(transacao)
        );

        const botaoExcluir = criarBotao(
            "Excluir",
            "botao-excluir",
            () => aoExcluir(transacao.id)
        );

        celulaAcoes.append(botaoEditar, botaoExcluir);

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
