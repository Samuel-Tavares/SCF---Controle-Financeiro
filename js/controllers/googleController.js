import { conectarGoogle } from "../services/googleAuthService.js";

import {
    exibirMensagem,
    limparMensagem
} from "../views/mensagemView.js";

const SELETOR_MENSAGEM = "#mensagem-google";

export function inicializarGoogleController() {
    const botao = document.querySelector("#conectar-google");

    botao.addEventListener("click", async () => {
        limparMensagem(SELETOR_MENSAGEM);

        botao.disabled = true;
        botao.textContent = "Conectando...";

        try {
            await conectarGoogle();

            exibirMensagem(
                SELETOR_MENSAGEM,
                "Conta autorizada com sucesso. Nesta etapa, os dados continuam salvos neste navegador.",
                "sucesso"
            );

            botao.textContent = "Reconectar ao Google";
        } catch (erro) {
            exibirMensagem(
                SELETOR_MENSAGEM,
                erro.message
            );

            botao.textContent = "Conectar ao Google Sheets";
        } finally {
            botao.disabled = false;
        }
    });
}