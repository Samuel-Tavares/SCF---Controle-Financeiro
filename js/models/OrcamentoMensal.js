export default class OrcamentoMensal {
    constructor({
        id = null,
        mes,
        valorLimite,
        valorUtilizado = 0,
        percentualAtingido = 0
    }) {
        this.id = id;
        this.mes = mes;
        this.valorLimite = valorLimite;
        this.valorUtilizado = valorUtilizado;
        this.percentualAtingido = percentualAtingido;
    }
}
