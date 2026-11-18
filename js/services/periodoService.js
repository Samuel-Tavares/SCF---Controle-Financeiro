import { obterMesAtual, mesValido } from "../utils/periodo.js";

let mesSelecionado = obterMesAtual();
const observadores = new Set();

export function obterMesSelecionado() {
    return mesSelecionado;
}

export function selecionarMes(mes) {
    if (!mesValido(mes)) return false;
    if (mes === mesSelecionado) return true;

    mesSelecionado = mes;
    observadores.forEach((aoAlterar) => aoAlterar(mes));
    return true;
}

export function observarPeriodo(aoAlterar) {
    observadores.add(aoAlterar);
    return () => observadores.delete(aoAlterar);
}
