export default class OrcamentoCategoria {
    constructor({
        id = null,
        categoria,
        valorLimite,
        valorUtilizado = 0,
        percentualAtingido = 0,
        mesReferencia
    }) {
        this.id = id;
        this.categoria = categoria;
        this.valorLimite = valorLimite;
        this.valorUtilizado = valorUtilizado;
        this.percentualAtingido = percentualAtingido;
        this.mesReferencia = mesReferencia;
    }
}
