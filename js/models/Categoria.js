export default class Categoria {
    constructor({
        id = null,
        nome,
        tipoRelacionado
    }) {
        this.id = id;
        this.nome = nome;
        this.tipoRelacionado = tipoRelacionado;
    }
}
