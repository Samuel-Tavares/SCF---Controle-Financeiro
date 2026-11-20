import { obterTokenGoogle } from "./googleAuthService.js";

export async function requisicaoGoogle(url, opcoes = {}) {
    const resposta = await fetch(url, {
        ...opcoes,
        headers: {
            ...opcoes.headers,
            Authorization: `Bearer ${obterTokenGoogle()}`,
            "Content-Type": "application/json"
        }
    });

    const dados = await resposta.json();

    if (resposta.status === 401) {
        throw new Error(
            "A autorização expirou. Conecte-se novamente ao Google."
        );
    }

    if (!resposta.ok) {
        throw new Error(
            dados.error?.message
            ?? `Erro ao acessar o Google: ${resposta.status}.`
        );
    }

    return dados;
}