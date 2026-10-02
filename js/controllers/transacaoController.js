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

        const tipo = inputTipo.value;
        const recorrencia = inputRecorrencia.value;
        const essencialidade = inputEssencialidade.value;
        const descricao = inputDescricao.value;
        const valor = inputValor.value;
        const categoria = inputCategoria.value;
        const data = inputData.value;
        const observacao = inputObservacao.value;

        const valorConvertido = Number(valor);
        const descricaoLimpa = descricao.trim();
        const observacaoLimpa = observacao.trim();
        
        const transacao = {
            tipo: tipo,
            recorrencia: recorrencia,
            essencialidade: essencialidade,
            descricao: descricaoLimpa,
            valor: valorConvertido,
            categoria: categoria,
            data: data,
            observacao: observacaoLimpa
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
