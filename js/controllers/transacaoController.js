import {validarTransacao} from '../utils/validarTransacao.js';

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

        const listaDeErros = validarTransacao(transacao);

        if (listaDeErros.length > 0) {
            return console.error(listaDeErros);
        }

        console.log('transação válida');
        console.log(transacao);
    });
    
}
