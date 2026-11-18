import { calcularResumo } from "../services/financeiroService.js";
import { obterMesSelecionado } from "../services/periodoService.js";
import { renderizarResumo } from "../views/resumoView.js";

export function atualizarResumoFinanceiro() {
    const resultado = calcularResumo(obterMesSelecionado());

    if (!resultado.sucesso) {
        console.error(resultado.erros);
        return;
    }

    renderizarResumo(resultado.resumo);
}
