export function validarOrcamentoMensal(orcamento) {
    const erros = [];

    const formatoMesValido = /^\d{4}-(0[1-9]|1[0-2])$/;

    if (!formatoMesValido.test(orcamento.mes)) {
        erros.push("O mês deve estar no formato YYYY-MM.");
    }

    if (!Number.isFinite(orcamento.valorLimite)) {
        erros.push("Informe um limite válido.");
    } else if (orcamento.valorLimite <= 0) {
        erros.push("O limite deve ser maior que zero.");
    }

    return erros;
}
