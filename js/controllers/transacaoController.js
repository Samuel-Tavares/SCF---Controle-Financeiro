import { 
    cadastrarTransacao, 
    listarTransacoes,
    editarTransacao,
    excluirTransacao,
    calcularResumo
} from "../services/financeiroService.js";

import { renderizarTransacoes, confirmarExclusao } from "../views/transacaoView.js";
import { renderizarResumo } from "../views/resumoView.js";

let idTransacaoEmEdicao = null;

function atualizarListaTransacoes() {
    const resultado = listarTransacoes();

    if (!resultado.sucesso) {
        console.error(resultado.erros);
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
    idTransacaoEmEdicao = transacao.id;

    document.querySelector("#tipo").value = transacao.tipo;
    document.querySelector("#recorrencia").value =
        transacao.recorrencia;
    document.querySelector("#essencialidade").value =
        transacao.essencialidade;
    document.querySelector("#descricao").value =
        transacao.descricao;
    document.querySelector("#valor").value = transacao.valor;
    document.querySelector("#categoria").value =
        transacao.categoria;
    document.querySelector("#data").value = transacao.data;
    document.querySelector("#observacao").value =
        transacao.observacao ?? "";

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

    formulario.reset();
    botaoEnviar.textContent = "Cadastrar transação";
}

function tratarExclusaoTransacao(id) {
    const confirmou = confirmarExclusao();

    if(!confirmou) {
        return;
    }

    const resultado = excluirTransacao(id);

    if (!resultado.sucesso) {
        console.error(resultado.erros);
        return;
    }

    if (idTransacaoEmEdicao === id) {
        restaurarModoCadastro();
    }

    atualizarListaTransacoes();
    atualizarResumoFinanceiro();
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

    atualizarListaTransacoes();
    atualizarResumoFinanceiro();

    formulario.addEventListener('submit', function(evento) {
        evento.preventDefault();
        
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

        const resultado = idTransacaoEmEdicao
            ? editarTransacao(idTransacaoEmEdicao, transacao)
            : cadastrarTransacao(transacao);

        if (!resultado.sucesso) {
            console.error(resultado.erros);
            return;
        }
        
        restaurarModoCadastro();
        atualizarListaTransacoes();
        atualizarResumoFinanceiro();
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
