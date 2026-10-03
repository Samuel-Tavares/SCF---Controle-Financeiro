export default class ResumoFinanceiro{
    constructor({
        totalReceitas,
        totalDespesas,
        saldo,
        taxaDeEconomia
    }) {
        this.totalReceitas = totalReceitas;
        this.totalDespesas = totalDespesas;
        this.saldo = saldo;
        this.taxaDeEconomia = taxaDeEconomia;
    }
}