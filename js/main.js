import { inicializarTransacaoController, atualizarListaTransacoes, recarregarCategoriasTransacao } from "./controllers/transacaoController.js";
import { inicializarOrcamentoCategoriaController, atualizarListaOrcamentosCategoria, recarregarCategoriasOrcamento } from "./controllers/orcamentoCategoriaController.js";
import { inicializarOrcamentoMensalController, atualizarListaOrcamentosMensais } from "./controllers/orcamentoMensalController.js";
import { atualizarResumoFinanceiro } from "./controllers/resumoController.js";
import { inicializarPeriodoController } from "./controllers/periodoController.js";
import { inicializarGoogleController } from "./controllers/googleController.js";
import { limparMensagem } from "./views/mensagemView.js";

let painelInicializado = false;

inicializarPeriodoController();
inicializarGoogleController(async ({ categorias }) => {
    if (!painelInicializado) {
        inicializarTransacaoController(categorias);
        inicializarOrcamentoCategoriaController(categorias);
        inicializarOrcamentoMensalController();
        painelInicializado = true;
    } else {
        recarregarCategoriasTransacao(categorias);
        recarregarCategoriasOrcamento(categorias);
    }
    for (const seletor of ["#mensagem-transacao", "#mensagem-orcamento", "#mensagem-orcamento-mensal"]) {
        limparMensagem(seletor);
    }
    const resultados = await Promise.all([
        atualizarListaTransacoes(), atualizarResumoFinanceiro(),
        atualizarListaOrcamentosCategoria(), atualizarListaOrcamentosMensais()
    ]);
    return resultados.every(Boolean);
});
