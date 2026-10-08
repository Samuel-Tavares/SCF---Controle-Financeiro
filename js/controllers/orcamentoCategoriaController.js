import {
    cadastrarOrcamentoCategoria,
    listarOrcamentosCategoria,
    editarOrcamentoCategoria,
    excluirOrcamentoCategoria
} from "../services/financeiroService.js";

import {
    renderizarOrcamentosCategoria,
    confirmarExclusaoOrcamento
} from "../views/orcamentoCategoriaView.js";

import {
    exibirMensagem,
    limparMensagem
} from "../views/mensagemView.js";

let idOrcamentoEmEdicao = null;
const SELETOR_MENSAGEM = "#mensagem-orcamento";


export function atualizarListaOrcamentosCategoria() {
    const resultado = listarOrcamentosCategoria();

    if (!resultado.sucesso) {
        exibirMensagem(
            SELETOR_MENSAGEM,
            resultado.erros
        );

        renderizarOrcamentosCategoria(
            [],
            tratarEdicaoOrcamento,
            tratarExclusaoOrcamento);

        return;
    }

    renderizarOrcamentosCategoria(
        resultado.orcamentos,
        tratarEdicaoOrcamento,
        tratarExclusaoOrcamento);
}

//DELETE
function tratarExclusaoOrcamento(id) {
    const confirmou = confirmarExclusaoOrcamento();

    if (!confirmou) {
        return;
    }

    limparMensagem(SELETOR_MENSAGEM);

    const resultado = excluirOrcamentoCategoria(id);

    if (!resultado.sucesso) {
        exibirMensagem(
            SELETOR_MENSAGEM,
            resultado.erros
        );
        return;
    }

    if (idOrcamentoEmEdicao === id) {
        restaurarModoCadastroOrcamento();
    }

    atualizarListaOrcamentosCategoria();

    exibirMensagem(
        SELETOR_MENSAGEM,
        "Orçamento excluído com sucesso",
        "sucesso"
    );
}

//POST
export function inicializarOrcamentoCategoriaController() {
    const formulario = document.querySelector(
        "#form-novo-orcamento"
    );

    const inputCategoria = document.querySelector(
        "#orcamento-categoria"
    );

    const inputValorLimite = document.querySelector(
        "#orcamento-valor-limite"
    );

    const inputMesReferencia = document.querySelector(
        "#orcamento-mes-referencia"
    );

    atualizarListaOrcamentosCategoria();

    formulario.addEventListener("submit", function (evento) {
        evento.preventDefault();

        limparMensagem(SELETOR_MENSAGEM);

        const estaEditando = idOrcamentoEmEdicao != null;

        const orcamento = {
            categoria: inputCategoria.value,
            valorLimite: Number(inputValorLimite.value),
            mesReferencia: inputMesReferencia.value
        };

        const resultado = estaEditando
            ? editarOrcamentoCategoria(
                idOrcamentoEmEdicao,
                orcamento
            )
            : cadastrarOrcamentoCategoria(orcamento);

        if(!resultado.sucesso) {
            exibirMensagem(SELETOR_MENSAGEM, resultado.erros);
            return;
        }

        restaurarModoCadastroOrcamento();
        atualizarListaOrcamentosCategoria();

        const mensagemSucesso = estaEditando
            ? "Orçamento atualizado com sucesso."
            : "Orçamento cadastrado com sucesso."

        exibirMensagem(
            SELETOR_MENSAGEM,
            mensagemSucesso,
            "sucesso"
        );
    })
}

//PUT
function tratarEdicaoOrcamento(orcamento) {
    limparMensagem(SELETOR_MENSAGEM);

    idOrcamentoEmEdicao = orcamento.id;

    document.querySelector("#orcamento-categoria").value =
        orcamento.categoria;

    document.querySelector("#orcamento-valor-limite").value =
        orcamento.valorLimite;

    document.querySelector("#orcamento-mes-referencia").value =
        orcamento.mesReferencia;

    const botaoEnviar = document.querySelector(
        '#form-novo-orcamento button[type="submit"]'
    );

    botaoEnviar.textContent = "Salvar alterações";

    document.querySelector("#orcamentos-categoria").scrollIntoView({
        behavior: "smooth"
    });
}

function restaurarModoCadastroOrcamento() {
    idOrcamentoEmEdicao = null;

    const formulario = document.querySelector(
        "#form-novo-orcamento"
    );

    const botaoEnviar = formulario.querySelector(
        'button[type="submit"]'
    );

    formulario.reset();
    botaoEnviar.textContent = "Cadastrar orçamento";
}