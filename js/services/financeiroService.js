import { validarTransacao } from "../utils/validarTransacao.js";
import Transacao from "../models/Transacao.js";
import { salvarTransacao } from "../repositories/transacaoRepository.js"


export function cadastrarTransacao(dados) {
    const erros = validarTransacao(dados);

    if (erros.length > 0) {
        return {
            sucesso: false,
            transacao: null,
            erros
        };
    }

    try {
        const transacao = new Transacao({
            ...dados,
            id: crypto.randomUUID()
        })

        const transacaoSalva = salvarTransacao(transacao);

        return {
            sucesso: true,
            transacao: transacaoSalva,
            erros: []
        };

    } catch (error) {
        return {
            sucesso: false,
            transacao: null,
            erros: [error.message]
        };
    }
}