import {
    cadastrarTransacao,
    editarTransacao,
    excluirTransacao,
    filtrarTransacoes,
    paginarTransacoes,
    listarCategorias
} from "../services/financeiroService.js";

import {
    renderizarTransacoes,
    confirmarExclusao,
    renderizarPaginacao
} from "../views/transacaoView.js";

import { atualizarResumoFinanceiro } from "./resumoController.js";

import {
    atualizarListaOrcamentosCategoria
} from "../controllers/orcamentoCategoriaController.js"

import {
    atualizarListaOrcamentosMensais
} from "./orcamentoMensalController.js";

import {
    exibirMensagem,
    limparMensagem
} from "../views/mensagemView.js";

import {
    renderizarCategoriasTransacao,
    renderizarCategoriasFiltro
} from "../views/categoriaView.js";

import { obterMesSelecionado, observarPeriodo } from "../services/periodoService.js";

let idTransacaoEmEdicao = null;
let filtrosAtivos = {};
let paginaAtual = 1;
let categoriasDisponiveis = [];

const ITENS_POR_PAGINA = 5;
const SELETOR_MENSAGEM = "#mensagem-transacao";

function atualizarCategoriasDoFormulario(
    tipo,
    categoriaSelecionada = ""
) {
    const categoriasRelacionadas = categoriasDisponiveis.filter(
        (categoria) =>
            categoria.tipoRelacionado === tipo
    );

    const textoInicial = tipo === ""
        ? "Selecione primeiro o tipo"
        : "Selecione";

    renderizarCategoriasTransacao(
        categoriasRelacionadas,
        textoInicial
    );

    if (categoriaSelecionada !== "") {
        document.querySelector("#categoria").value =
            categoriaSelecionada;
    }
}

function atualizarListaTransacoes() {
    const resultado = filtrarTransacoes({
        ...filtrosAtivos,
        mesReferencia: obterMesSelecionado()
    });

    if (!resultado.sucesso) {
        paginaAtual = 1;

        exibirMensagem(
            SELETOR_MENSAGEM,
            resultado.erros
        );
        renderizarTransacoes([], tratarEdicaoTransacao, tratarExclusaoTransacao);

        renderizarPaginacao({paginaAtual: 1, totalPaginas: 1});
        return;
    }

    const possuiFiltrosAtivos = Object.values(
        filtrosAtivos
    ).some((valor) => valor !== "");

    const mensagemListaVazia = possuiFiltrosAtivos
        ? "Nenhuma transação encontrada para os filtros selecionados."
        : "Nenhuma transação cadastrada para o mês selecionado.";

    const paginacao = paginarTransacoes(resultado.transacoes, paginaAtual, ITENS_POR_PAGINA);

    paginaAtual = paginacao.paginaAtual;

    renderizarTransacoes(
        paginacao.itens,
        tratarEdicaoTransacao,
        tratarExclusaoTransacao,
        mensagemListaVazia
    );

    renderizarPaginacao(paginacao);
}

function tratarEdicaoTransacao(transacao) {
    limparMensagem(SELETOR_MENSAGEM);

    idTransacaoEmEdicao = transacao.id;

    document.querySelector("#cancelar-edicao-transacao").hidden = false;
    document.querySelector("#tipo").value = transacao.tipo;

    atualizarCategoriasDoFormulario(
        transacao.tipo,
        transacao.categoria
    );

    document.querySelector("#recorrencia").value = transacao.recorrencia;
    document.querySelector("#essencialidade").value = transacao.essencialidade;
    document.querySelector("#descricao").value = transacao.descricao;
    document.querySelector("#valor").value = transacao.valor;
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
    atualizarCategoriasDoFormulario("");
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
    atualizarListaOrcamentosMensais();

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
    const filtroDescricao = document.querySelector("#filtro-descricao");
    const botaoLimparFiltros = document.querySelector("#limpar-filtros-transacoes");
    const botaoPaginaAnterior = document.querySelector("#pagina-anterior");
    const botaoProximaPagina = document.querySelector("#proxima-pagina");

    const resultadoCategorias = listarCategorias();

    if (!resultadoCategorias.sucesso) {
        exibirMensagem(
            SELETOR_MENSAGEM,
            resultadoCategorias.erros
        );

        return;
    }

    categoriasDisponiveis = resultadoCategorias.categorias;

    atualizarCategoriasDoFormulario("");

    renderizarCategoriasFiltro(
        categoriasDisponiveis
    );

    atualizarListaTransacoes();
    atualizarResumoFinanceiro();

    observarPeriodo(() => {
        paginaAtual = 1;
        atualizarListaTransacoes();
        atualizarResumoFinanceiro();
    });

    inputTipo.addEventListener("change", function() {
        atualizarCategoriasDoFormulario(
            inputTipo.value
        );
    });

    botaoPaginaAnterior.addEventListener("click", function () {
        paginaAtual -= 1;
        atualizarListaTransacoes();
    });

    botaoProximaPagina.addEventListener("click", function () {
        paginaAtual += 1;
        atualizarListaTransacoes();
    });

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
                descricao: filtroDescricao.value
            };

            paginaAtual = 1;
            atualizarListaTransacoes();
        }
    )

    botaoLimparFiltros.addEventListener(
        "click",
        function () {
            formularioFiltros.reset();
            filtrosAtivos = {};
            paginaAtual = 1;
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
        paginaAtual = 1;
        atualizarListaTransacoes();
        atualizarResumoFinanceiro();
        atualizarListaOrcamentosCategoria();
        atualizarListaOrcamentosMensais();

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
