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