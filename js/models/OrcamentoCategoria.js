export default class OrcamentoCategoria {
    constructor({
        id = null,
        categoria,
        mes,
        valorLimite,
        valorUtilizado = 0,
        percentualAtingido = 0,
    }) {
        this.id = id;
        this.categoria = categoria;
        this.mes = mes;
        this.valorLimite = valorLimite;
        this.valorUtilizado = valorUtilizado;
        this.percentualAtingido = percentualAtingido;
    }
}
