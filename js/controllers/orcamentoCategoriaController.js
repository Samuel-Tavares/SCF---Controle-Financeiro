import {
    cadastrarOrcamentoCategoria,
    listarOrcamentosCategoria,
    excluirOrcamentoCategoria
} from "../services/financeiroService.js";

import {
    renderizarOrcamentosCategoria,
    confirmarExclusaoOrcamento
} from "../views/orcamentoCategoriaView.js";

//PUT
export function atualizarListaOrcamentosCategoria() {
    const resultado = listarOrcamentosCategoria();

    if (!resultado.sucesso) {
        console.error(resultado.erros);

        renderizarOrcamentosCategoria([], tratarExclusaoOrcamento);

        return;
    }

    renderizarOrcamentosCategoria(resultado.orcamentos, tratarExclusaoOrcamento);
}

//DELETE
function tratarExclusaoOrcamento(id) {
    const confirmou = confirmarExclusaoOrcamento();

    if (!confirmou) {
        return;
    }

    const resultado = excluirOrcamentoCategoria(id);

    if (!resultado.sucesso) {
        console.error(resultado.erros);
        return;
    }

    atualizarListaOrcamentosCategoria();
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

        const orcamento = {
            categoria: inputCategoria.value,
            valorLimite: Number(inputValorLimite.value),
            mesReferencia: inputMesReferencia.value
        };

        const resultado = cadastrarOrcamentoCategoria(
            orcamento
        );

        if(!resultado.sucesso) {
            console.error(resultado.erros);
            return;
        }

        formulario.reset();
        atualizarListaOrcamentosCategoria();
    })
}