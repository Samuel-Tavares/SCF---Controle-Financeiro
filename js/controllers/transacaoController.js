import {
    cadastrarTransacao,
    editarTransacao,
    excluirTransacao,
    calcularResumo,
    filtrarTransacoes
} from "../services/financeiroService.js";
import { renderizarTransacoes, confirmarExclusao } from "../views/transacaoView.js";
import { renderizarResumo } from "../views/resumoView.js";
import {
    atualizarListaOrcamentosCategoria
} from "../controllers/orcamentoCategoriaController.js"
import {
    exibirMensagem,
    limparMensagem
} from "../views/mensagemView.js";

let idTransacaoEmEdicao = null;
let filtrosAtivos = {};

const SELETOR_MENSAGEM = "#mensagem-transacao";

function atualizarListaTransacoes() {
    const resultado = filtrarTransacoes(filtrosAtivos);

    if (!resultado.sucesso) {
        exibirMensagem(
            SELETOR_MENSAGEM,
            resultado.erros
        );
        renderizarTransacoes([], tratarEdicaoTransacao, tratarExclusaoTransacao);
        return;
    }

    renderizarTransacoes(
        resultado.transacoes,
        tratarEdicaoTransacao,
        tratarExclusaoTransacao
    );
}

function tratarEdicaoTransacao(transacao) {
    limparMensagem(SELETOR_MENSAGEM);

    idTransacaoEmEdicao = transacao.id;

    document.querySelector("#cancelar-edicao-transacao").hidden = false;
    document.querySelector("#tipo").value = transacao.tipo;
    document.querySelector("#recorrencia").value = transacao.recorrencia;
    document.querySelector("#essencialidade").value = transacao.essencialidade;
    document.querySelector("#descricao").value = transacao.descricao;
    document.querySelector("#valor").value = transacao.valor;
    document.querySelector("#categoria").value = transacao.categoria;
    document.querySelector("#data").value = transacao.data;
    document.querySelector("#observacao").value = transacao.observacao ?? "";

    const botaoEnviar = document.querySelector(
        '#form-nova-transacao button[type="submit"]'
    );

    botaoEnviar.textContent = "Salvar alterações";

    document.querySelector("#nova-transacao").scrollIntoView({
        behavior: "smooth"
    });
}

function restaurarModoCadastro() {
    idTransacaoEmEdicao = null;

    const formulario = document.querySelector("#form-nova-transacao");
    const botaoEnviar = formulario.querySelector('button[type="submit"]');
    const botaoCancelar = document.querySelector("#cancelar-edicao-transacao");

    formulario.reset();
    botaoEnviar.textContent = "Cadastrar transação";
    botaoCancelar.hidden = true;
}

function tratarExclusaoTransacao(id) {
    const confirmou = confirmarExclusao();

    if(!confirmou) {
        return;
    }

    limparMensagem(SELETOR_MENSAGEM);

    const resultado = excluirTransacao(id);

    if (!resultado.sucesso) {
        exibirMensagem(
            SELETOR_MENSAGEM,
            resultado.erros
        );

        return;
    }

    if (idTransacaoEmEdicao === id) {
        restaurarModoCadastro();
    }

    atualizarListaTransacoes();
    atualizarResumoFinanceiro();
    atualizarListaOrcamentosCategoria();

    exibirMensagem(
        SELETOR_MENSAGEM,
        "Transação excluída com sucesso.",
        "sucesso"
    );
}

export function inicializarTransacaoController() {
    const formulario = document.querySelector('#form-nova-transacao');

    const inputTipo = document.querySelector('#tipo');
    const inputRecorrencia = document.querySelector('#recorrencia');
    const inputEssencialidade = document.querySelector('#essencialidade');
    const inputDescricao = document.querySelector('#descricao');
    const inputValor = document.querySelector('#valor');
    const inputCategoria = document.querySelector('#categoria');
    const inputData = document.querySelector('#data');
    const inputObservacao = document.querySelector('#observacao');
    const botaoCancelar = document.querySelector("#cancelar-edicao-transacao");
    const formularioFiltros = document.querySelector("#form-filtros-transacoes");
    const filtroTipo = document.querySelector("#filtro-tipo");
    const filtroCategoria = document.querySelector("#filtro-categoria");
    const filtroMes = document.querySelector("#filtro-mes");
    const botaoLimparFiltros = document.querySelector("#limpar-filtros-transacoes");

    atualizarListaTransacoes();
    atualizarResumoFinanceiro();

    botaoCancelar.addEventListener("click", function() {
        restaurarModoCadastro();
        limparMensagem(SELETOR_MENSAGEM);
    })

    formularioFiltros.addEventListener(
        "submit",
        function (eventos) {
            eventos.preventDefault();

            filtrosAtivos = {
                tipo: filtroTipo.value,
                categoria: filtroCategoria.value,
                mesReferencia: filtroMes.value
            };

            atualizarListaTransacoes();
        }
    )

    botaoLimparFiltros.addEventListener(
        "click",
        function () {
            formularioFiltros.reset();
            filtrosAtivos = {};
            atualizarListaTransacoes();
        }
    )

    formulario.addEventListener('submit', function(evento) {
        evento.preventDefault();

        limparMensagem(SELETOR_MENSAGEM);

        const estaEditando = idTransacaoEmEdicao !== null;
        
        const transacao = {
            tipo: inputTipo.value,
            recorrencia: inputRecorrencia.value,
            essencialidade: inputEssencialidade.value,
            descricao: inputDescricao.value.trim(),
            valor: Number(inputValor.value),
            categoria: inputCategoria.value,
            data: inputData.value,
            observacao: inputObservacao.value.trim()
        };

        const resultado = estaEditando
            ? editarTransacao(idTransacaoEmEdicao, transacao)
            : cadastrarTransacao(transacao);

        if (!resultado.sucesso) {
            exibirMensagem(
                SELETOR_MENSAGEM,
                resultado.erros
            )

            return;
        }
        
        restaurarModoCadastro();
        atualizarListaTransacoes();
        atualizarResumoFinanceiro();
        atualizarListaOrcamentosCategoria();

        const mensagemSucesso = estaEditando
            ? "Transação atualizada com sucesso."
            : "Transação cadastrada com sucesso."

        exibirMensagem(
            SELETOR_MENSAGEM,
            mensagemSucesso,
            "sucesso"
        );
    });
}

function atualizarResumoFinanceiro() {
    const resultado = calcularResumo();

    if (!resultado.sucesso) {
        console.error(resultado.erros);
        return;
    }

    renderizarResumo(resultado.resumo);
}
