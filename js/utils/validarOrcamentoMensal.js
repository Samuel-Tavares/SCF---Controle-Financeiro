import { mesValido } from "./periodo.js";

export function validarOrcamentoMensal(orcamento) {
    const erros = [];

    if (!mesValido(orcamento.mes)) {
        erros.push("O mês deve estar no formato YYYY-MM.");
    }

    if (!Number.isFinite(orcamento.valorLimite)) {
        erros.push("Informe um limite válido.");
    } else if (orcamento.valorLimite <= 0) {
        erros.push("O limite deve ser maior que zero.");
    }

    return erros;
}
