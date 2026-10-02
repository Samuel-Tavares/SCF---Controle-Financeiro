import { cadastrarTransacao, listarTransacoes } from "../services/financeiroService.js";
import { renderizarTransacoes } from "../views/transacaoView.js";

function atualizarListaTransacoes() {
    const resultado = listarTransacoes();

    if (!resultado.sucesso) {
        console.error(resultado.erros);
        renderizarTransacoes([]);
        return;
    }

    renderizarTransacoes(resultado.transacoes);
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

        const resultado = cadastrarTransacao(transacao);

        if (!resultado.sucesso) {
            console.error(resultado.erros);
            return;
        }

        console.log(resultado.transacao);
        formulario.reset();
        atualizarListaTransacoes();
    });
    
}
