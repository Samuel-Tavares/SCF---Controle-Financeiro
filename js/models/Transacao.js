export default class Transacao {
    constructor({
        id = null,
        tipo,
        recorrencia,
        essencialidade,
        descricao,
        valor,
        categoria,
        data,
        observacao = null
    }) {
        this.id = id;
        this.tipo = tipo;
        this.recorrencia = recorrencia;
        this.essencialidade = essencialidade;
        this.descricao = descricao;
        this.valor = valor;
        this.categoria = categoria;
        this.data = data;
        this.observacao = observacao;
    }
}