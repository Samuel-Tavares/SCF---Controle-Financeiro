import { inicializarTransacaoController } from "./controllers/transacaoController.js";
import { inicializarOrcamentoCategoriaController } from "./controllers/orcamentoCategoriaController.js";
import { inicializarCategorias } from "./services/financeiroService.js";
import { inicializarOrcamentoMensalController } from "./controllers/orcamentoMensalController.js";
import { inicializarPeriodoController } from "./controllers/periodoController.js";
import { inicializarGoogleController } from "./controllers/googleController.js";

const resultadoCategorias = inicializarCategorias();

if (!resultadoCategorias.sucesso) {
    console.error(resultadoCategorias.erros);
}

inicializarPeriodoController();
inicializarTransacaoController();
inicializarOrcamentoCategoriaController();
inicializarOrcamentoMensalController();
inicializarGoogleController();
