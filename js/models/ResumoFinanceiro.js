export default class ResumoFinanceiro{
    constructor({
        totalReceitas,
        totalDespesas,
        saldo,
        taxaEconomia
    }) {
        this.totalReceitas = totalReceitas;
        this.totalDespesas = totalDespesas;
        this.saldo = saldo;
        this.taxaEconomia = taxaEconomia;
    }
}
