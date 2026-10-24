import { inicializarTransacaoController } from "./controllers/transacaoController.js";
import { inicializarOrcamentoCategoriaController } from "./controllers/orcamentoCategoriaController.js";
import { inicializarCategorias } from "./services/financeiroService.js";

const resultadoCategorias = inicializarCategorias();

if (!resultadoCategorias.sucesso) {
    console.error(resultadoCategorias.erros);
}

inicializarTransacaoController();
inicializarOrcamentoCategoriaController();
