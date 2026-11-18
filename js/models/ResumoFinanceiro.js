export default class ResumoFinanceiro{
    constructor({
        totalReceitas,
        totalDespesas,
        saldo,
        taxaEconomia,
        orcamentoMensal = null
    }) {
        this.totalReceitas = totalReceitas;
        this.totalDespesas = totalDespesas;
        this.saldo = saldo;
        this.taxaEconomia = taxaEconomia;
        this.orcamentoMensal = orcamentoMensal;
    }
}
