export default class OrcamentoCategoria {
    constructor({
        id = null,
        categoria,
        valorLimite,
        mesReferencia
    }) {
        this.id = id;
        this.categoria = categoria;
        this.valorLimite = valorLimite;
        this.mesReferencia = mesReferencia;
    }
}
