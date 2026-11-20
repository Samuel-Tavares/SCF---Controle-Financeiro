import { conectarGoogle } from "../services/googleAuthService.js";
import {
    prepararPlanilha,
    lerRegistros,
    adicionarRegistros
} from "../services/googleSheetsService.js";

import {
    CATEGORIAS_INICIAIS
} from "../services/financeiroService.js";

import {
    exibirMensagem,
    limparMensagem
} from "../views/mensagemView.js";

const SELETOR_MENSAGEM = "#mensagem-google";

export function inicializarGoogleController() {
    const botao = document.querySelector("#conectar-google");
    const linkPlanilha = document.querySelector(
        "#abrir-planilha-google"
    );

    botao.addEventListener("click", async () => {
        limparMensagem(SELETOR_MENSAGEM);

        linkPlanilha.hidden = true;
        linkPlanilha.removeAttribute("href");

        botao.disabled = true;
        botao.textContent = "Conectando...";

        try {
            await conectarGoogle();

            botao.textContent = "Preparando planilha...";

            const planilha = await prepararPlanilha();

            botao.textContent = "Carregando categorias...";

            let categorias = await lerRegistros(
                planilha.id,
                "Categorias"
            );

            if (categorias.length === 0) {
                await adicionarRegistros(
                    planilha.id,
                    "Categorias",
                    CATEGORIAS_INICIAIS
                );

                categorias = await lerRegistros(
                    planilha.id,
                    "Categorias"
                );
            }

            linkPlanilha.href = planilha.url;
            linkPlanilha.hidden = false;

            const mensagem = planilha.criadaAgora
                ? "Planilha criada com sucesso."
                : "Planilha localizada com sucesso.";

            exibirMensagem(
                SELETOR_MENSAGEM,
                `${mensagem} Os cadastros ainda estão sendo salvos neste navegador.`,
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