const CHAVE = "scf_orcamentos_mensais";

export function carregarOrcamentosMensais() {
    try {
        const dadosSalvos = localStorage.getItem(CHAVE);

        if (dadosSalvos === null) {
            return [];
        }

        const orcamentos = JSON.parse(dadosSalvos);

        if (!Array.isArray(orcamentos)) {
            throw new Error(
                "Os dados dos orçamentos mensais não são do tipo lista."
            );
        }

        return orcamentos;
    } catch (error) {
        throw new Error(
            `Falha ao carregar orçamentos mensais: ${error.message}`
        );
    }
}

export function salvarOrcamentoMensal(orcamento) {
    try {
        const orcamentos = carregarOrcamentosMensais();

        orcamentos.push(orcamento);

        localStorage.setItem(
            CHAVE,
            JSON.stringify(orcamentos)
        );

        return orcamento;
    } catch (error) {
        throw new Error(
            `Falha ao salvar orçamento mensal: ${error.message}`
        );
    }
}

export function atualizarOrcamentoMensal(
    orcamentoAtualizado
) {
    try {
        const orcamentos = carregarOrcamentosMensais();

        const indice = orcamentos.findIndex(
            (orcamento) =>
                orcamento.id === orcamentoAtualizado.id
        );

        if (indice === -1) {
            throw new Error(
                "Orçamento mensal não encontrado."
            );
        }

        orcamentos[indice] = orcamentoAtualizado;

        localStorage.setItem(
            CHAVE,
            JSON.stringify(orcamentos)
        );

        return orcamentoAtualizado;
    } catch (error) {
        throw new Error(
            `Falha ao atualizar orçamento mensal: ${error.message}`
        );
    }
}

export function removerOrcamentoMensal(id) {
    try {
        const orcamentos = carregarOrcamentosMensais();

        const indice = orcamentos.findIndex(
            (orcamento) => orcamento.id === id
        );

        if (indice === -1) {
            throw new Error("Orçamento mensal não encontrado.");
        }

        const [orcamentoRemovido] = orcamentos.splice(indice,1);

        localStorage.setItem(
            CHAVE,
            JSON.stringify(orcamentos)
        );

        return orcamentoRemovido;
    } catch (error) {
        throw new Error(`Falha ao remover orçamentos mensais: ${error.message}`);
    }
}
