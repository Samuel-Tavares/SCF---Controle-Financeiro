import { validarTransacao } from "../utils/validarTransacao.js";
import Transacao from "../models/Transacao.js";
import { 
    salvarTransacao, 
    carregarTransacoes, 
    removerTransacao as removerTransacaoRepository,
    atualizarTransacao as atualizarTransacaoRepository
} from "../repositories/transacaoRepository.js";

import ResumoFinanceiro from "../models/ResumoFinanceiro.js";
import OrcamentoCategoria from "../models/OrcamentoCategoria.js"
import { validarOrcamentoCategoria } from "../utils/validarOrcamentoCategoria.js"
import { carregarOrcamentos, salvarOrcamento} from "../repositories/orcamentoCategoriaRepository.js"

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

export function listarTransacoes() {
    try {
        const transacoes = carregarTransacoes();

        return {
            sucesso: true,
            transacoes,
            erros: []
        }
    } catch (error) {
        return {
            sucesso: false,
            transacoes: [],
            erros: [error.message]
        }
    }
}

export function excluirTransacao(id) {
    try {
        const transacaoRemovida = removerTransacaoRepository(id);

        return {
            sucesso: true,
            transacao: transacaoRemovida,
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

export function editarTransacao(id, dados) {
    const erros = validarTransacao(dados);

    if (erros.length > 0) {
        return {
            sucesso: false,
            transacao: null,
            erros
        };
    }

    try {
        const transacaoAtualizada = new Transacao({
            ...dados,
            id
        });

        const transacaoSalva = atualizarTransacaoRepository(
            transacaoAtualizada
        );

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

export function calcularResumo() {
    try {
        const transacoes = carregarTransacoes();

        let receitasEmCentavos = 0;
        let despesasEmCentavos = 0;

        transacoes.forEach((transacao) => {
            const valorEmCentavos = Math.round(
                transacao.valor * 100
            );

            if (transacao.tipo === "receita") {
                receitasEmCentavos += valorEmCentavos;
            }

            if (transacao.tipo === "despesa") {
                despesasEmCentavos += valorEmCentavos;
            }
        });

        const totalReceitas = receitasEmCentavos / 100;
        const totalDespesas = despesasEmCentavos / 100;

        const saldo = (receitasEmCentavos - despesasEmCentavos) / 100;

        const taxaEconomia = receitasEmCentavos > 0 ? (
            (receitasEmCentavos - despesasEmCentavos) / receitasEmCentavos) * 100
            : 0;
        
        const resumo = new ResumoFinanceiro({
            totalReceitas,
            totalDespesas,
            saldo,
            taxaEconomia
        });

        return {
            sucesso: true,
            resumo,
            erros: []
        };
    } catch (error) {
        return {
            sucesso: false,
            resumo: null,
            erros: [error.message]
        };
    }
}

export function cadastrarOrcamentoCategoria(dados) {
    const erros = validarOrcamentoCategoria(dados);

    if (erros.length > 0) {
        return {
            sucesso: false,
            orcamento: null,
            erros
        };
    }

    try {
        const orcamentos = carregarOrcamentos();

        const orcamentoExistente = orcamentos.some(
            (orcamento) => 
                orcamento.categoria === dados.categoria
                && orcamento.mesReferencia === dados.mesReferencia
        );

        if (orcamentoExistente) {
            return {
                sucesso: false,
                orcamento: null,
                erros: ["Já existe um orçamento para esta categoria e mês"]
            };
        }

        const orcamento = new OrcamentoCategoria({
            ...dados,
            id: crypto.randomUUID()
        });

        const orcamentoSalvo = salvarOrcamento(orcamento);

        return {
            sucesso: true,
            orcamento: orcamentoSalvo,
            erros: []
        };
    } catch (error) {
        return {
            sucesso: false,
            orcamento: null,
            erros: [error.message]
        };
    }
}
