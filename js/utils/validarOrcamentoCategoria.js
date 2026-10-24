export function validarOrcamentoCategoria(orcamento, categoria) {
    const erros = [];

    if (
        orcamento.categoria === ""
        || orcamento.categoria === undefined
        || orcamento.categoria === null
    ) {
        erros.push("A categoria é obrigatória");
    } else if (categoria === null) {
        erros.push("A categoria selecionada não existe.");
    } else if (
        categoria.tipoRelacionado !== "despesa"
    ) {
        erros.push(
            "O orçamento deve utilizar uma categoria de despesa."
        );
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
