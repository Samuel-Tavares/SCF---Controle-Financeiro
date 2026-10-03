export function validarOrcamentoCategoria(orcamento) {
    const erros = [];

    if (
        orcamento.categoria === ""
        || orcamento.categoria === undefined
        || orcamento.categoria === null
    ) {
        erros.push("A categoria é obrigatória");
    }

    if (!Number.isFinite(orcamento.valorLimite)) {
        erros.push("Informe um limite válido.");
    } else if (orcamento.valorLimite <= 0) {
        erros.push("O limite deve ser maior que zero.");
    }

    const formatoMesValido = /^\d{4}-(0[1-9]|1[0-2])$/;

    if (!formatoMesValido.test(orcamento.mesReferencia)) {
        erros.push("O mês de referência deve estar no formato YYYY-MM");
    }

    return erros;
}