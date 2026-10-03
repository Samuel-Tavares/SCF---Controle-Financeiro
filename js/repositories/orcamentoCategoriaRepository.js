const CHAVE = "scf_orcamentos";

export function carregarOrcamentos() {
    try {
        const orcamentos = localStorage.getItem(CHAVE);

        if (orcamentos === null) {
            return [];
        }

        const orcamentosConvertidos = JSON.parse(orcamentos);

        if (!Array.isArray(orcamentosConvertidos)) {
            throw new Error(
                "Os dados dos orçamentos não são do tipo lista."
            );
        }

        return orcamentosConvertidos;
    } catch (error) {
        throw new Error(`Falha ao carregar orçamentos: ${error.message}`);
    }
}

export function salvarOrcamento(orcamento) {
    try {
        const orcamentos = carregarOrcamentos();

        orcamentos.push(orcamento);

        localStorage.setItem(
            CHAVE,
            JSON.stringify(orcamentos)
        );

        return orcamento;
    } catch (error) {
        throw new Error(`Erro ao salvar orçamento: ${error.message}`);
    }
}