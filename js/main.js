import { inicializarTransacaoController, atualizarListaTransacoes, recarregarCategoriasTransacao } from "./controllers/transacaoController.js";
import { inicializarOrcamentoCategoriaController, atualizarListaOrcamentosCategoria, recarregarCategoriasOrcamento } from "./controllers/orcamentoCategoriaController.js";
import { inicializarOrcamentoMensalController, atualizarListaOrcamentosMensais } from "./controllers/orcamentoMensalController.js";
import { atualizarResumoFinanceiro } from "./controllers/resumoController.js";
import { inicializarPeriodoController } from "./controllers/periodoController.js";
import { inicializarGoogleController } from "./controllers/googleController.js";
import { limparMensagem } from "./views/mensagemView.js";

let painelInicializado = false;

function inicializarNavegacao() {
    const links = [...document.querySelectorAll(".sidebar-nav a[href^='#']")];
    const secoes = links
        .map((link) => document.querySelector(link.getAttribute("href")))
        .filter(Boolean);

    function ativarSecao(secao) {
        links.forEach((link) => {
            if (link.getAttribute("href") === `#${secao.id}`) {
                link.setAttribute("aria-current", "location");
            } else {
                link.removeAttribute("aria-current");
            }
        });
    }

    links.forEach((link) => link.addEventListener("click", () => {
        const secao = document.querySelector(link.getAttribute("href"));
        if (secao && !secao.hidden) ativarSecao(secao);
    }));

    const observador = new IntersectionObserver((entradas) => {
        const visiveis = entradas
            .filter((entrada) => entrada.isIntersecting)
            .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visiveis.length) ativarSecao(visiveis[0].target);
    }, { rootMargin: "-18% 0px -68% 0px" });

    secoes.forEach((secao) => observador.observe(secao));
}

function inicializarTema() {
    const botao = document.querySelector("#alternar-tema");
    const temaSalvo = localStorage.getItem("scf-tema");

    function aplicarTema(tema) {
        const escuro = tema === "escuro";
        document.documentElement.dataset.theme = escuro ? "dark" : "light";
        botao.setAttribute("aria-pressed", String(escuro));
    }

    aplicarTema(temaSalvo === "escuro" ? "escuro" : "claro");
    botao.addEventListener("click", () => {
        const tema = document.documentElement.dataset.theme === "dark" ? "claro" : "escuro";
        localStorage.setItem("scf-tema", tema);
        aplicarTema(tema);
    });
}

inicializarNavegacao();
inicializarTema();

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
