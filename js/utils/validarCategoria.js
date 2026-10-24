export function validarCategoria(categoria) {
    const erros = [];

    if (
        typeof categoria.nome !== "string"
        || categoria.nome.trim() === ""
    ) {
        erros.push("O nome da categoria é obrigatório.");
    }

    if (!["receita", "despesa"].includes(categoria.tipoRelacionado)) {
        erros.push("O tipo relacionado deve ser receita ou despesa.");
    }

    return erros;
}
