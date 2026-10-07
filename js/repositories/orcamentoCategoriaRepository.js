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

export function removerOrcamento(id) {
    try {
        const orcamentos = carregarOrcamentos();

        const indice = orcamentos.findIndex(
            (orcamento) =>
                orcamento.id === id
        );

        if (indice === -1) {
            throw new Error("Orçamento não encontrado.");
        }

        const [orcamentoRemovido] = orcamentos.splice(indice, 1);

        localStorage.setItem(
            CHAVE,
            JSON.stringify(orcamentos)
        );

        return orcamentoRemovido;
    } catch (error) {
        throw new Error(`Erro ao remover orçamento: ${error.message}`);
    }
}

export function atualizarOrcamento(orcamentoAtualizado) {
    try {
        const orcamentos = carregarOrcamentos();


        const indice = orcamentos.findIndex(
            (orcamento) =>
                orcamento.id === orcamentoAtualizado.id
        );

        if (indice === -1) {
            throw new Error("Orçamento não encontrado.");
        }

        orcamentos[indice] = orcamentoAtualizado;

        localStorage.setItem(
            CHAVE,
            JSON.stringify(orcamentos)
        );

        return orcamentoAtualizado;
    } catch (error) {
        throw new Error(`Erro ao atualizar orçamento: ${error.message}`);
    }
}