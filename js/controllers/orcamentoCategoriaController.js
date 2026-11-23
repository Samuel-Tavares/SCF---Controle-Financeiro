import { executarAcaoFinanceira, criarControleLeitura, exibirResultadoGravacao } from "./operacaoController.js";
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

import {
    renderizarCategoriasOrcamento
} from "../views/categoriaView.js";

import { obterMesSelecionado, observarPeriodo } from "../services/periodoService.js";
import { formatarMesReferencia } from "../utils/formatadores.js";

const iniciarLeitura = criarControleLeitura();

let idOrcamentoEmEdicao = null;
const SELETOR_MENSAGEM = "#mensagem-orcamento";


export async function atualizarListaOrcamentosCategoria() {
    const aindaAtual = iniciarLeitura();
    const resultado = await listarOrcamentosCategoria(obterMesSelecionado());

    if (!aindaAtual()) return false;

    if (!resultado.sucesso) {
        exibirMensagem(
            SELETOR_MENSAGEM,
            resultado.erros
        );

        renderizarOrcamentosCategoria(
            [],
            tratarEdicaoOrcamento,
            tratarExclusaoOrcamento);

        return false;
    }

    renderizarOrcamentosCategoria(
        resultado.orcamentos,
        tratarEdicaoOrcamento,
        tratarExclusaoOrcamento);
    return true;
}

//DELETE
function tratarExclusaoOrcamento(id) {
    const confirmou = confirmarExclusaoOrcamento();

    if (!confirmou) {
        return;
    }

    return executarAcaoFinanceira(SELETOR_MENSAGEM, async () => {
        exibirMensagem(SELETOR_MENSAGEM, "Salvando alterações...", "sucesso");

        const resultado = await excluirOrcamentoCategoria(id);

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

        const atualizou = await atualizarListaOrcamentosCategoria();

        exibirResultadoGravacao(SELETOR_MENSAGEM, "Orçamento excluído com sucesso", atualizou);
    });
}

//POST
export function inicializarOrcamentoCategoriaController(categorias = []) {
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

    recarregarCategoriasOrcamento(categorias);

    botaoCancelar.addEventListener("click", function () {
        restaurarModoCadastroOrcamento();
        limparMensagem(SELETOR_MENSAGEM);
    })

    formulario.addEventListener("submit", function (evento) {
        evento.preventDefault();

        return executarAcaoFinanceira(SELETOR_MENSAGEM, async () => {
            exibirMensagem(SELETOR_MENSAGEM, "Salvando alterações...", "sucesso");

            const estaEditando = idOrcamentoEmEdicao != null;

            const orcamento = {
                categoria: inputCategoria.value,
                mes: inputMes.value,
                valorLimite: Number(inputValorLimite.value)
            };

            const resultado = estaEditando
                ? await editarOrcamentoCategoria(
                    idOrcamentoEmEdicao,
                    orcamento
                )
                : await cadastrarOrcamentoCategoria(orcamento);

            if(!resultado.sucesso) {
                exibirMensagem(SELETOR_MENSAGEM, resultado.erros);
                return;
            }

            restaurarModoCadastroOrcamento();
            const atualizou = await atualizarListaOrcamentosCategoria();

            let mensagemSucesso = estaEditando
                ? "Orçamento atualizado com sucesso."
                : "Orçamento cadastrado com sucesso."

            if (orcamento.mes !== obterMesSelecionado()) {
                mensagemSucesso += ` Selecione ${formatarMesReferencia(orcamento.mes)} na visualização para consultá-lo.`;
            }

            exibirResultadoGravacao(SELETOR_MENSAGEM, mensagemSucesso, atualizou);
        });
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

export function recarregarCategoriasOrcamento(categorias) {
    const selecionada = document.querySelector("#orcamento-categoria").value;
    renderizarCategoriasOrcamento(categorias.filter((categoria) => categoria.tipoRelacionado === "despesa"));
    document.querySelector("#orcamento-categoria").value = selecionada;
}
