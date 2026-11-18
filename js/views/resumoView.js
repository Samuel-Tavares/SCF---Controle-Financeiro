import {
    formatarMoeda,
    formatarPorcentagem
} from "../utils/formatadores.js";

export function renderizarResumo(resumo) {
    const elementoReceitas = document.querySelector("#total-receitas");

    const elementoDespesas = document.querySelector("#total-despesas");

    const elementoSaldo = document.querySelector("#saldo");

    const elementoTaxaEconomia = document.querySelector("#taxa-economia");
    const elementoOrcamentoMensal = document.querySelector("#resumo-orcamento-mensal");

    if (
        !elementoReceitas
        || !elementoDespesas
        || !elementoSaldo
        || !elementoTaxaEconomia
        || !elementoOrcamentoMensal
    ) {
        throw new Error("Elementos do resumo financeiro não encontrados.");
    }

    elementoReceitas.textContent = formatarMoeda(resumo.totalReceitas);

    elementoDespesas.textContent = formatarMoeda(resumo.totalDespesas);

    elementoSaldo.textContent = formatarMoeda(resumo.saldo);

    elementoTaxaEconomia.textContent = formatarPorcentagem(resumo.taxaEconomia);

    const possuiOrcamento = resumo.orcamentoMensal !== null;
    elementoOrcamentoMensal.textContent = possuiOrcamento
        ? formatarMoeda(resumo.orcamentoMensal)
        : "Não definido";
    elementoOrcamentoMensal.classList.toggle("sem-orcamento", !possuiOrcamento);

}
