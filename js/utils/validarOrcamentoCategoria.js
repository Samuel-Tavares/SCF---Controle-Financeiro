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

    return erros;
}
