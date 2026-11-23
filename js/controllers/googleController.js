import { GOOGLE_CONFIG } from "../config/googleConfig.js";
import { conectarGoogle, obterTokenGoogle } from "../services/googleAuthService.js";
import { criarClienteGoogle } from "../services/googleApiService.js";
import { prepararPlanilha } from "../services/googleSheetsService.js";
import { conectarGoogleSheets, desconectarGoogleSheets } from "../repositories/googleSheetsRepository.js";
import { inicializarCategorias } from "../services/financeiroService.js";
import { exibirMensagem, limparMensagem } from "../views/mensagemView.js";
import { executarAcaoFinanceira } from "./operacaoController.js";

const SELETOR_MENSAGEM = "#mensagem-google";

export function inicializarGoogleController(aoConectar) {
    const botao = document.querySelector("#conectar-google");
    const link = document.querySelector("#abrir-planilha-google");

    botao.addEventListener("click", () => executarAcaoFinanceira(SELETOR_MENSAGEM, async () => {
        limparMensagem(SELETOR_MENSAGEM);
        desconectarGoogleSheets();
        document.querySelectorAll("[data-requer-conexao]").forEach((secao) => { secao.hidden = true; });
        link.hidden = true;
        link.removeAttribute("href");
        botao.textContent = "Conectando...";
        try {
            await conectarGoogle();
            const requisicao = criarClienteGoogle({ obterToken: obterTokenGoogle });
            botao.textContent = "Carregando planilha...";
            const planilha = await prepararPlanilha({ requisicao, nomePlanilha: GOOGLE_CONFIG.spreadsheetTitle });

            conectarGoogleSheets({ planilhaId: planilha.id, requisicao });
            const resultado = await inicializarCategorias();
            if (!resultado.sucesso) throw new Error(resultado.erros.join(" "));

            const carregou = await aoConectar({ categorias: resultado.categorias });
            link.href = planilha.url;
            link.hidden = false;
            document.querySelectorAll("[data-requer-conexao]").forEach((secao) => { secao.hidden = false; });
            exibirMensagem(SELETOR_MENSAGEM, carregou
                ? "Conectado. Transações, categorias e orçamentos são lidos e salvos no Google Sheets."
                : "Conectado, mas alguns dados não puderam ser carregados. Confira os avisos e reconecte para tentar novamente.",
            carregou ? "sucesso" : "erro");
            botao.textContent = "Reconectar / atualizar dados";
        } catch (erro) {
            desconectarGoogleSheets();
            botao.textContent = "Conectar ao Google Sheets";
            throw erro;
        }
    }));
}
