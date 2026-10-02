const CHAVE = "scf_transacoes";

export function carregarTransacoes() {
    try {
        const transacoes = localStorage.getItem(CHAVE);

        if (transacoes === null) {
            return [];
        }

        const transacoesConvertidas = JSON.parse(transacoes);

        if (!Array.isArray(transacoesConvertidas)) {
            throw new Error('Os dados das transações não são do tipo lista!');
        }

        return transacoesConvertidas;

    } catch (error) {
            throw new Error(`Falha ao carregar transações: ${error.message}`);
    }

}

export function salvarTransacao(transacao) {
    try {
        const listaDeTransacoes = carregarTransacoes();

        listaDeTransacoes.push(transacao);

        const listaDeTransacoesConvertida = JSON.stringify(listaDeTransacoes);

        localStorage.setItem(CHAVE, listaDeTransacoesConvertida);

        return transacao;
    } catch (error) {
        throw new Error(`Erro ao salvar transação: ${error.message}`);
    }
}

export function removerTransacao(id) {
    try {
        const transacoes = carregarTransacoes();

        const indice = transacoes.findIndex(
            (transacao) => transacao.id === id
        );

        if (indice === -1) {
            throw new Error("Transacao não encontrada.");
        }

        const [transacaoRemovida] = transacoes.splice(indice, 1);

        localStorage.setItem(CHAVE, JSON.stringify(transacoes));

        return transacaoRemovida;
    } catch (error) {
        throw new Error(
            `Erro ao remover transação: ${error.message}`
        );
    }
}