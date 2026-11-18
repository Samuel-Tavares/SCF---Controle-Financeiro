import { obterMesSelecionado, selecionarMes, observarPeriodo } from "../services/periodoService.js";
import { obterMesAtual } from "../utils/periodo.js";
import { formatarMesReferencia } from "../utils/formatadores.js";

export function inicializarPeriodoController() {
    const inputMes = document.querySelector("#mes-visualizacao");
    const botaoAtual = document.querySelector("#visualizar-mes-atual");

    function atualizarPeriodo() {
        const mes = obterMesSelecionado();
        const mesAtual = obterMesAtual();
        inputMes.value = mes;
        document.querySelector("#periodo-selecionado").textContent =
            `Exibindo ${formatarMesReferencia(mes)}${mes === mesAtual ? " (mês atual)" : ""}.`;
        document.querySelector("#mes-atual-identificado").textContent =
            `Mês atual: ${formatarMesReferencia(mesAtual)}.`;
        document.querySelectorAll("[data-periodo]").forEach((elemento) => {
            elemento.textContent = formatarMesReferencia(mes);
        });
    }

    inputMes.addEventListener("change", () => {
        if (!selecionarMes(inputMes.value)) inputMes.value = obterMesSelecionado();
    });
    botaoAtual.addEventListener("click", () => {
        selecionarMes(obterMesAtual());
        atualizarPeriodo();
    });
    observarPeriodo(atualizarPeriodo);
    atualizarPeriodo();
}
