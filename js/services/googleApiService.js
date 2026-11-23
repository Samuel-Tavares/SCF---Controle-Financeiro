export function criarClienteGoogle({ obterToken, fetchImpl = globalThis.fetch }) {
    return async function requisicaoGoogle(url, opcoes = {}) {
        let resposta;
        try {
            const token = obterToken();
            resposta = await fetchImpl(url, {
                ...opcoes,
                headers: {
                    ...opcoes.headers,
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
        } catch (erro) {
            if (erro instanceof TypeError) {
                throw new Error("Falha de conexão. Confira a planilha antes de repetir uma gravação, pois ela pode ter sido recebida pelo Google.");
            }
            throw erro;
        }
        const dados = await resposta.json().catch(() => null);
        if (resposta.status === 401) throw new Error("A autorização expirou. Reconecte-se ao Google.");
        if (resposta.status === 429) throw new Error("O Google recebeu muitas solicitações. Aguarde um pouco e tente novamente.");
        if (!resposta.ok) throw new Error(dados?.error?.message ?? `Falha ao acessar o Google (${resposta.status}).`);
        if (!dados) throw new Error("Resposta inesperada do Google. Confira a planilha antes de repetir uma gravação.");
        return dados;
    };
}
