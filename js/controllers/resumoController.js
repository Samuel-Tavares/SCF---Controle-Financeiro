import { calcularResumo } from "../services/financeiroService.js";
import { obterMesSelecionado } from "../services/periodoService.js";
import { renderizarResumo } from "../views/resumoView.js";
import { exibirMensagem, limparMensagem } from "../views/mensagemView.js";
import { criarControleLeitura } from "./operacaoController.js";

const iniciarLeitura = criarControleLeitura();

export async function atualizarResumoFinanceiro() {
    const aindaAtual = iniciarLeitura();
    const resultado = await calcularResumo(obterMesSelecionado());
    if (!aindaAtual()) return false;
    if (!resultado.sucesso) {
        document.querySelectorAll(".resumo-valor").forEach((elemento) => { elemento.textContent = "—"; });
        exibirMensagem("#mensagem-resumo", resultado.erros);
        return false;
    }
    limparMensagem("#mensagem-resumo");
    renderizarResumo(resultado.resumo);
    return true;
}
