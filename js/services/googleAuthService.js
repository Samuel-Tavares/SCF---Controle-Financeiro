import { GOOGLE_CONFIG } from "../config/googleConfig.js";

let tokenAcesso = null;
let expiraEm = 0;

export function conectarGoogle() {
    return new Promise((resolve, reject) => {
        const oauth2 = window.google?.accounts?.oauth2;

        if (!oauth2) {
            reject(new Error(
                "A biblioteca do Google ainda não carregou. Tente novamente."
            ));
            return;
        }

        tokenAcesso = null;
        expiraEm = 0;

        const cliente = oauth2.initTokenClient({
            client_id: GOOGLE_CONFIG.clientId,
            scope: GOOGLE_CONFIG.scope,

            callback: (resposta) => {
                if (resposta.error) {
                    reject(new Error(
                        `Não foi possível autorizar: ${resposta.error}.`
                    ));
                    return;
                }

                const possuiPermissao = oauth2.hasGrantedAllScopes(
                    resposta,
                    ...GOOGLE_CONFIG.scope.split(/\s+/)
                );

                if (!possuiPermissao) {
                    reject(new Error(
                        "Autorize o acesso aos arquivos utilizados pelo aplicativo."
                    ));
                    return;
                }

                const duracao = Number(resposta.expires_in);

                if (
                    !resposta.access_token
                    || !Number.isFinite(duracao)
                    || duracao <= 0
                ) {
                    reject(new Error(
                        "O Google não retornou uma autorização válida."
                    ));
                    return;
                }

                tokenAcesso = resposta.access_token;
                expiraEm = Date.now() + duracao * 1000;

                resolve();
            },

            error_callback: (erro) => {
                const mensagem = erro.type === "popup_closed"
                ? "A janela de autorização foi fechada."
                : "Não foi possível abrir ou concluir a autorização. Verifique se o navegador permite pop-ups para este site.";

                reject(new Error(mensagem));
            }
        });

        cliente.requestAccessToken();
    });
}

export function obterTokenGoogle() {
    const margemDeSeguranca = 30_000;

    if (
        !tokenAcesso
        || Date.now() >= expiraEm - margemDeSeguranca
    ) {
        tokenAcesso = null;
        expiraEm = 0;

        throw new Error(
            "Conecte-se ao Google para continuar."
        );
    }

    return tokenAcesso;
}