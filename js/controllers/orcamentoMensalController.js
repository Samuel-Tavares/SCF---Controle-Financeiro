import {
    cadastrarOrcamentoMensal,
    listarOrcamentosMensais,
    editarOrcamentoMensal,
    excluirOrcamentoMensal
} from "../services/financeiroService.js";

import {
    confirmarExclusaoOrcamentoMensal,
    renderizarOrcamentosMensais
} from "../views/orcamentoMensalView.js";

import {
    exibirMensagem,
    limparMensagem
} from "../views/mensagemView.js";

import { obterMesSelecionado, observarPeriodo } from "../services/periodoService.js";
import { formatarMesReferencia } from "../utils/formatadores.js";
import { atualizarResumoFinanceiro } from "./resumoController.js";

let idOrcamentoMensalEmEdicao = null;

const SELETOR_MENSAGEM = "#mensagem-orcamento-mensal";

export function atualizarListaOrcamentosMensais() {
    const resultado = listarOrcamentosMensais(obterMesSelecionado());

    if (!resultado.sucesso) {
        exibirMensagem(
            SELETOR_MENSAGEM,
            resultado.erros
        );

        renderizarOrcamentosMensais(
            [],
            tratarEdicaoOrcamentoMensal,
            tratarExclusaoOrcamentoMensal
        );

        return;
    }

    renderizarOrcamentosMensais(
        resultado.orcamentos,
        tratarEdicaoOrcamentoMensal,
        tratarExclusaoOrcamentoMensal
    );
}

function restaurarModoCadastroOrcamentoMensal() {
    idOrcamentoMensalEmEdicao = null;

    const formulario = document.querySelector(
        "#form-orcamento-mensal"
    );

    const botaoEnviar = formulario.querySelector(
        'button[type="submit"]'
    );

    const botaoCancelar = document.querySelector(
        "#cancelar-edicao-orcamento-mensal"
    );

    formulario.reset();
    document.querySelector("#orcamento-mensal-mes").value = obterMesSelecionado();

    botaoEnviar.textContent =
        "Cadastrar orçamento mensal";

    botaoCancelar.hidden = true;
}

function tratarEdicaoOrcamentoMensal(orcamento) {
    limparMensagem(SELETOR_MENSAGEM);

    idOrcamentoMensalEmEdicao = orcamento.id;

    document.querySelector(
        "#orcamento-mensal-mes"
    ).value = orcamento.mes;

    document.querySelector(
        "#orcamento-mensal-valor-limite"
    ).value = orcamento.valorLimite;

    document.querySelector(
        "#cancelar-edicao-orcamento-mensal"
    ).hidden = false;

    const botaoEnviar = document.querySelector(
        '#form-orcamento-mensal button[type="submit"]'
    );

    botaoEnviar.textContent = "Salvar alterações";

    document.querySelector(
        "#orcamentos-mensais"
    ).scrollIntoView({
        behavior: "smooth"
    });
}

function tratarExclusaoOrcamentoMensal(id) {
    const confirmou = confirmarExclusaoOrcamentoMensal();

    if (!confirmou) {
        return;
    }

    limparMensagem(SELETOR_MENSAGEM);

    const resultado = excluirOrcamentoMensal(id);

    if (!resultado.sucesso) {
        exibirMensagem(
            SELETOR_MENSAGEM,
        resultado.erros
        );

        return;
    }

    if (idOrcamentoMensalEmEdicao === id) {
        restaurarModoCadastroOrcamentoMensal();
    }

    atualizarListaOrcamentosMensais();
    atualizarResumoFinanceiro();

    exibirMensagem(
        SELETOR_MENSAGEM,
        "Orçamento mensal excluído com sucesso.",
        "sucesso"
    );
}


export function inicializarOrcamentoMensalController() {
    const formulario = document.querySelector(
        "#form-orcamento-mensal"
    );

    const inputMes = document.querySelector(
        "#orcamento-mensal-mes"
    )
    inputMes.value = obterMesSelecionado();

    observarPeriodo(() => {
        if (idOrcamentoMensalEmEdicao === null) inputMes.value = obterMesSelecionado();
        atualizarListaOrcamentosMensais();
    });

    const inputValorLimite = document.querySelector(
        "#orcamento-mensal-valor-limite"
    )

    const botaoCancelar = document.querySelector(
        "#cancelar-edicao-orcamento-mensal"
    );

    atualizarListaOrcamentosMensais();

    botaoCancelar.addEventListener(
        "click",
        function () {
            restaurarModoCadastroOrcamentoMensal();
            limparMensagem(SELETOR_MENSAGEM);
        }
    );

    formulario.addEventListener(
        "submit",
        function (evento) {
            evento.preventDefault();

            limparMensagem(SELETOR_MENSAGEM);

            const estaEditando =
                idOrcamentoMensalEmEdicao !== null;

            const orcamento = {
                mes: inputMes.value,
                valorLimite: Number(
                    inputValorLimite.value
                )
            };

            const resultado = estaEditando
                ? editarOrcamentoMensal(
                    idOrcamentoMensalEmEdicao,
                    orcamento
                )
                : cadastrarOrcamentoMensal(orcamento);

            if (!resultado.sucesso) {
                exibirMensagem(
                    SELETOR_MENSAGEM,
                    resultado.erros
                );

                return;
            }

            restaurarModoCadastroOrcamentoMensal();
            atualizarListaOrcamentosMensais();
            atualizarResumoFinanceiro();

            let mensagem = estaEditando
                ? "Orçamento mensal atualizado com sucesso."
                : "Orçamento mensal cadastrado com sucesso.";

            if (orcamento.mes !== obterMesSelecionado()) {
                mensagem += ` Selecione ${formatarMesReferencia(orcamento.mes)} na visualização para consultá-lo.`;
            }

            exibirMensagem(
                SELETOR_MENSAGEM,
                mensagem,
                "sucesso"
            );
        }
    );
}
