import {
    cadastrarOrcamentoCategoria,
    listarOrcamentosCategoria,
    editarOrcamentoCategoria,
    excluirOrcamentoCategoria,
    listarCategorias
} from "../services/financeiroService.js";

import {
    renderizarOrcamentosCategoria,
    confirmarExclusaoOrcamento
} from "../views/orcamentoCategoriaView.js";

import {
    exibirMensagem,
    limparMensagem
} from "../views/mensagemView.js";

import {
    renderizarCategoriasOrcamento
} from "../views/categoriaView.js";

import { obterMesSelecionado, observarPeriodo } from "../services/periodoService.js";
import { formatarMesReferencia } from "../utils/formatadores.js";

let idOrcamentoEmEdicao = null;
const SELETOR_MENSAGEM = "#mensagem-orcamento";


export function atualizarListaOrcamentosCategoria() {
    const resultado = listarOrcamentosCategoria(obterMesSelecionado());

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

    const botaoCancelar = document.querySelector("#cancelar-edicao-orcamento");
    const inputMes = document.querySelector("#orcamento-categoria-mes");
    inputMes.value = obterMesSelecionado();

    observarPeriodo(() => {
        if (idOrcamentoEmEdicao === null) inputMes.value = obterMesSelecionado();
        atualizarListaOrcamentosCategoria();
    });

    const resultadoCategorias = listarCategorias();

    if (!resultadoCategorias.sucesso) {
        exibirMensagem(
            SELETOR_MENSAGEM,
            resultadoCategorias.erros
        );

        return;
    }

    const categoriasDeDespesa = resultadoCategorias.categorias
        .filter((categoria) => categoria.tipoRelacionado === "despesa");

    renderizarCategoriasOrcamento(categoriasDeDespesa);

    atualizarListaOrcamentosCategoria();

    botaoCancelar.addEventListener("click", function () {
        restaurarModoCadastroOrcamento();
        limparMensagem(SELETOR_MENSAGEM);
    })

    formulario.addEventListener("submit", function (evento) {
        evento.preventDefault();

        limparMensagem(SELETOR_MENSAGEM);

        const estaEditando = idOrcamentoEmEdicao != null;

        const orcamento = {
            categoria: inputCategoria.value,
            mes: inputMes.value,
            valorLimite: Number(inputValorLimite.value)
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

        let mensagemSucesso = estaEditando
            ? "Orçamento atualizado com sucesso."
            : "Orçamento cadastrado com sucesso."

        if (orcamento.mes !== obterMesSelecionado()) {
            mensagemSucesso += ` Selecione ${formatarMesReferencia(orcamento.mes)} na visualização para consultá-lo.`;
        }

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

    document.querySelector("#orcamento-categoria").value = orcamento.categoria;
    document.querySelector("#orcamento-categoria-mes").value = orcamento.mes;
    document.querySelector("#orcamento-valor-limite").value = orcamento.valorLimite;
    document.querySelector("#cancelar-edicao-orcamento").hidden = false;

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

    const botaoCancelar = document.querySelector("#cancelar-edicao-orcamento");

    formulario.reset();
    document.querySelector("#orcamento-categoria-mes").value = obterMesSelecionado();
    botaoEnviar.textContent = "Cadastrar orçamento";
    botaoCancelar.hidden = true;
}
