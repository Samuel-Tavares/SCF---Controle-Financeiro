import {
    cadastrarOrcamentoCategoria,
    listarOrcamentosCategoria
} from "../services/financeiroService.js";

import {
    renderizarOrcamentosCategoria
} from "../views/orcamentoCategoriaView.js";

export function atualizarListaOrcamentosCategoria() {
    const resultado = listarOrcamentosCategoria();

    if (!resultado.sucesso) {
        console.error(resultado.erros);
        renderizarOrcamentosCategoria([]);
        return;
    }

    renderizarOrcamentosCategoria(resultado.orcamentos);
}

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

