export const COLECOES_GOOGLE = {
    transacoes: "Transacoes",
    categorias: "Categorias",
    orcamentosMensais: "OrcamentosMensais",
    orcamentosCategoria: "OrcamentosCategoria"
};

export const ESTRUTURA_PLANILHA = {
    Transacoes: ["id", "tipo", "recorrencia", "essencialidade", "descricao", "valor", "categoria", "data", "observacao"],
    OrcamentosMensais: ["id", "mes", "valorLimite"],
    OrcamentosCategoria: ["id", "categoria", "mes", "valorLimite"],
    Categorias: ["id", "nome", "tipoRelacionado"]
};
