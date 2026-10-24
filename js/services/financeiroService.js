import { validarTransacao } from "../utils/validarTransacao.js";
import Transacao from "../models/Transacao.js";
import {
    salvarTransacao,
    carregarTransacoes,
    removerTransacao as removerTransacaoRepository,
    atualizarTransacao as atualizarTransacaoRepository
} from "../repositories/transacaoRepository.js";

import ResumoFinanceiro from "../models/ResumoFinanceiro.js";
import OrcamentoCategoria from "../models/OrcamentoCategoria.js"
import { validarOrcamentoCategoria } from "../utils/validarOrcamentoCategoria.js"
import {
    carregarOrcamentos,
    salvarOrcamento,
    removerOrcamento as removerOrcamentoRepository,
    atualizarOrcamento as atualizarOrcamentoRepository
} from "../repositories/orcamentoCategoriaRepository.js";

import Categoria from "../models/Categoria.js";

import {
    validarCategoria
} from "../utils/validarCategoria.js";

import {
    carregarCategorias,
    salvarCategoria,
    atualizarCategoria as atualizarCategoriaRepository,
    removerCategoria as removerCategoriaRepository,
    buscarCategoriaPorId
} from "../repositories/categoriaRepository.js";

const CATEGORIAS_INICIAIS = [
    {
        id: "alimentacao",
        nome: "Alimentação",
        tipoRelacionado: "despesa"
    },
    {
        id: "educacao",
        nome: "Educação",
        tipoRelacionado: "despesa"
    },
    {
        id: "lazer",
        nome: "Lazer",
        tipoRelacionado: "despesa"
    },
    {
        id: "moradia",
        nome: "Moradia",
        tipoRelacionado: "despesa"
    },
    {
        id: "saude",
        nome: "Saúde",
        tipoRelacionado: "despesa"
    },
    {
        id: "transporte",
        nome: "Transporte",
        tipoRelacionado: "despesa"
    },
    {
        id: "salario",
        nome: "Salário",
        tipoRelacionado: "receita"
    },
    {
        id: "investimentos",
        nome: "Investimentos",
        tipoRelacionado: "receita"
    },
    {
        id: "outros-despesa",
        nome: "Outros",
        tipoRelacionado: "despesa"
    },
    {
        id: "outros-receita",
        nome: "Outros",
        tipoRelacionado: "receita"
    }
];

export function inicializarCategorias() {
    try {
        const categoriasExistentes = carregarCategorias();

        if (categoriasExistentes.length > 0) {
            return {
                sucesso: true,
                categorias: categoriasExistentes,
                erros: []
            };
        }

        const categoriasSalvas = CATEGORIAS_INICIAIS.map(
            (dadosCategoria) => {
                const categoria = new Categoria(
                    dadosCategoria
                );

                return salvarCategoria(categoria);
            }
        );

        return {
            sucesso: true,
            categorias: categoriasSalvas,
            erros: []
        };
    } catch (error) {
        return {
            sucesso: false,
            categorias: [],
            erros: [error.message]
        };
    }
}

export function cadastrarTransacao(dados) {
    try {
        const categoria = buscarCategoriaPorId(
            dados.categoria
        );

        const erros = validarTransacao(dados, categoria);

        if (erros.length > 0) {
            return {
                sucesso: false,
                transacao: null,
                erros
            };
        }

        const transacao = new Transacao({
            ...dados,
            id: crypto.randomUUID()
        });

        const transacaoSalva = salvarTransacao(transacao);

        return {
            sucesso: true,
            transacao: transacaoSalva,
            erros: []
        };
    } catch (error) {
        return {
            sucesso: false,
            transacao: null,
            erros: [error.message]
        };
    }
}

export function excluirTransacao(id) {
    try {
        const transacaoRemovida = removerTransacaoRepository(id);

        return {
            sucesso: true,
            transacao: transacaoRemovida,
            erros: []
        };
    } catch (error) {
        return {
            sucesso: false,
            transacao: null,
            erros: [error.message]
        };
    }
}

export function editarTransacao(id, dados) {
    try {
        const categoria = buscarCategoriaPorId(
            dados.categoria
        );

        const erros = validarTransacao(
            dados,
            categoria
        );

        if (erros.length > 0) {
            return {
                sucesso: false,
                transacao: null,
                erros
            };
        }

        const transacaoAtualizada = new Transacao({
            ...dados,
            id
        });

        const transacaoSalva = atualizarTransacaoRepository(
            transacaoAtualizada
        );

        return {
            sucesso: true,
            transacao: transacaoSalva,
            erros: []
        };
    } catch (error) {
        return {
            sucesso: false,
            transacao: null,
            erros: [error.message]
        };
    }
}

export function calcularResumo() {
    try {
        const transacoes = carregarTransacoes();

        let receitasEmCentavos = 0;
        let despesasEmCentavos = 0;

        transacoes.forEach((transacao) => {
            const valorEmCentavos = Math.round(
                transacao.valor * 100
            );

            if (transacao.tipo === "receita") {
                receitasEmCentavos += valorEmCentavos;
            }

            if (transacao.tipo === "despesa") {
                despesasEmCentavos += valorEmCentavos;
            }
        });

        const totalReceitas = receitasEmCentavos / 100;
        const totalDespesas = despesasEmCentavos / 100;

        const saldo = (receitasEmCentavos - despesasEmCentavos) / 100;

        const taxaEconomia = receitasEmCentavos > 0 ? (
            (receitasEmCentavos - despesasEmCentavos) / receitasEmCentavos) * 100
            : 0;

        const resumo = new ResumoFinanceiro({
            totalReceitas,
            totalDespesas,
            saldo,
            taxaEconomia
        });

        return {
            sucesso: true,
            resumo,
            erros: []
        };
    } catch (error) {
        return {
            sucesso: false,
            resumo: null,
            erros: [error.message]
        };
    }
}

export function cadastrarOrcamentoCategoria(dados) {
    try {
        const categoria = buscarCategoriaPorId(
            dados.categoria
        );

        const erros = validarOrcamentoCategoria(
            dados,
            categoria
        );

        if (erros.length > 0) {
            return {
                sucesso: false,
                orcamento: null,
                erros
            };
        }

        const orcamentos = carregarOrcamentos();

        const orcamentoExistente = orcamentos.some(
            (orcamento) =>
                orcamento.categoria === dados.categoria
            && orcamento.mesReferencia
                === dados.mesReferencia
        );

        if (orcamentoExistente) {
            return {
                sucesso: false,
                orcamento: null,
                erros: [
                    "Já existe um orçamento para esta categoria e mês."
                ]
            };
        }

        const orcamento = new OrcamentoCategoria({
            ...dados,
            id: crypto.randomUUID()
        });

        const orcamentoSalvo = salvarOrcamento(
            orcamento
        );

        return {
            sucesso: true,
            orcamento: orcamentoSalvo,
            erros: []
        };
    } catch (error) {
        return {
            sucesso: false,
            orcamento: null,
            erros: [error.message]
        };
    }
}

export function listarOrcamentosCategoria() {
    try {
        const orcamentos = carregarOrcamentos();
        const transacoes = carregarTransacoes();
        const categorias = carregarCategorias();

        const orcamentosCalculados = orcamentos.map(
            (orcamento) => {
                const limiteEmCentavos = Math.round(
                    orcamento.valorLimite * 100
                );

                const gastoEmCentavos = transacoes.reduce(
                    (total, transacao) => {
                        const pertenceAoOrcamento =
                        transacao.tipo === "despesa"
                        && transacao.categoria
                            === orcamento.categoria
                        && transacao.data.startsWith(orcamento.mesReferencia);

                    if (!pertenceAoOrcamento) {
                        return total;
                    }

                    return total+Math.round(transacao.valor * 100);
                    },
                    0
                );

                const valorGasto = gastoEmCentavos / 100;

                const valorRestante = (limiteEmCentavos - gastoEmCentavos) / 100;

                const percentualUtilizado = limiteEmCentavos > 0 ? (
                    gastoEmCentavos / limiteEmCentavos
                ) * 100 : 0;

                const categoriaRelacionada = categorias.find(
                    (categoria) =>
                        categoria.id === orcamento.categoria
                );

                return {
                    ...orcamento,
                    categoriaNome:
                        categoriaRelacionada?.nome
                        ?? "Categoria não encontrada",
                    valorGasto,
                    valorRestante,
                    percentualUtilizado
                };
            }
        );

        return {
            sucesso: true,
            orcamentos: orcamentosCalculados,
            erros: []
        };
    } catch (error) {
        return {
            sucesso: false,
            orcamentos: [],
            erros: [error.message]
        };
    }
}

export function excluirOrcamentoCategoria(id) {
    try {
        const orcamentoRemovido = removerOrcamentoRepository(id);

        return {
            sucesso: true,
            orcamento: orcamentoRemovido,
            erros: []
        };
    } catch (error) {
        return {
            sucesso: false,
            orcamento: null,
            erros: [error.message]
        };
    }
}

export function editarOrcamentoCategoria(id, dados) {
    try {
        const categoria = buscarCategoriaPorId(
            dados.categoria
        );

        const erros = validarOrcamentoCategoria(
            dados,
            categoria
        );

        if (erros.length > 0) {
            return {
                sucesso: false,
                orcamento: null,
                erros
            };
        }

        const orcamentos = carregarOrcamentos();

        const orcamentoDuplicado = orcamentos.some(
            (orcamento) =>
                orcamento.id !== id
                && orcamento.categoria
                    === dados.categoria
                && orcamento.mesReferencia
                    === dados.mesReferencia
        );

        if (orcamentoDuplicado) {
            return {
                sucesso: false,
                orcamento: null,
                erros: [
                    "Já existe um orçamento para esta categoria e mês."
                ]
            };
        }

        const orcamentoAtualizado = new OrcamentoCategoria({
            ...dados,
            id
        });

        const orcamentoSalvo = atualizarOrcamentoRepository(
            orcamentoAtualizado
        );

        return {
            sucesso: true,
            orcamento: orcamentoSalvo,
            erros: []
        };
    } catch (error) {
        return {
            sucesso: false,
            orcamento: null,
            erros: [error.message]
        };
    }
}

export function filtrarTransacoes({
    tipo = "",
    categoria = "",
    mesReferencia = ""
} = {}) {
    try {
        const transacoes = carregarTransacoes();
        const categorias = carregarCategorias();

        const transacoesFiltradas = transacoes
            .filter((transacao) => {
                const correspondeAoTipo =
                    tipo === "" || transacao.tipo === tipo;

                const correspondeACategoria =
                    categoria === "" || transacao.categoria === categoria;

                const correspondeAoMes =
                    mesReferencia === "" || transacao.data.startsWith(mesReferencia);

                return (
                    correspondeAoTipo
                    && correspondeACategoria
                    && correspondeAoMes);
            })
            .sort(
                (transacaoA, transacaoB) =>
                    transacaoB.data.localeCompare(
                        transacaoA.data
                    )
            )
            .map((transacao) => {
                const categoriaRelacionada = categorias.find(
                    (categoria) =>
                        categoria.id === transacao.categoria
                );

                return {
                    ...transacao,
                    categoriaNome:
                        categoriaRelacionada?.nome
                        ?? "Categoria não encontrada"
                };
            });

        return {
            sucesso: true,
            transacoes: transacoesFiltradas,
            erros: []
        };
    } catch (error) {
        return {
            sucesso: false,
            transacoes: [],
            erros: [error.message]
        };
    }
}

export function paginarTransacoes(
    transacoes,
    paginaAtual = 1,
    itensPorPagina = 5
) {
    const totalItens = transacoes.length;
    const totalPaginas = Math.max(
        1,
        Math.ceil(totalItens / itensPorPagina)
    );

    const paginaValida = Math.min(
        Math.max(paginaAtual, 1),
        totalPaginas
    );

    const indiceInicial = (
        paginaValida - 1
    ) * itensPorPagina;

    const itens = transacoes.slice(
        indiceInicial,
        indiceInicial + itensPorPagina
    );

    return {
        itens,
        paginaAtual: paginaValida,
        totalPaginas,
        totalItens
    };
}

export function listarCategorias() {
    try {
        const categorias = carregarCategorias();

        return {
            sucesso: true,
            categorias,
            erros: []
        };
    } catch (error) {
        return {
            sucesso: false,
            categorias: [],
            erros: [error.message]
        };
    }
}

export function cadastrarCategoria(dados) {
    const dadosNormalizados = {
        ...dados,
        nome: typeof dados.nome === "string"
        ? dados.nome.trim()
        : ""
    };

    const erros = validarCategoria(dadosNormalizados);

    if (erros.length > 0) {
        return {
            sucesso: false,
            categoria: null,
            erros
        };
    }

    try {
        const categorias = carregarCategorias();

        const categoriaDuplicada = categorias.some(
            (categoria) =>
                categoria.nome.toLowerCase()
                    === dadosNormalizados.nome.toLowerCase()
                && categoria.tipoRelacionado
                    === dadosNormalizados.tipoRelacionado
        );

        if (categoriaDuplicada) {
            return {
                sucesso: false,
                categoria: null,
                erros: [
                    "Já existe uma categoria com este nome e tipo."
                ]
            };
        }

        const categoria = new Categoria({
            ...dadosNormalizados,
            id: crypto.randomUUID()
        });

        const categoriaSalva = salvarCategoria(categoria);

        return {
            sucesso: true,
            categoria: categoriaSalva,
            erros: []
        };
    } catch (error) {
        return {
            sucesso: false,
            categoria: null,
            erros: [error.message]
        };
    }

}

export function editarCategoria(id, dados) {
    const dadosNormalizados = {
        ...dados,
        nome: typeof dados.nome === "string"
            ? dados.nome.trim()
            : ""
    };

    const erros = validarCategoria(dadosNormalizados);

    if (erros.length > 0) {
        return {
            sucesso: false,
            categoria: null,
            erros
        };
    }

    try {
        const categorias = carregarCategorias();

        const categoriaDuplicada = categorias.some(
            (categoria) =>
                categoria.id !== id
                && categoria.nome.toLowerCase()
                    === dadosNormalizados.nome.toLowerCase()
                && categoria.tipoRelacionado
                    === dadosNormalizados.tipoRelacionado
        );

        if (categoriaDuplicada) {
            return {
                sucesso: false,
                categoria: null,
                erros: [
                    "Já existe uma categoria com este nome e tipo."
                ]
            };
        }

        const categoriaAtualizada = new Categoria({
            ...dadosNormalizados,
            id
        });

        const categoriaSalva = atualizarCategoriaRepository(categoriaAtualizada);

        return {
            sucesso: true,
            categoria: categoriaSalva,
            erros: []
        };
    } catch (error) {
        return {
            sucesso: false,
            categoria: null,
            erros: [error.message]
        };
    }
}

export function excluirCategoria(id) {
    try {
        const categoria = buscarCategoriaPorId(id);

        if (categoria === null) {
            return {
                sucesso: false,
                categoria: null,
                erros: ["Categoria não encontrada."]
            };
        }

        const transacoes = carregarTransacoes();
        const orcamentos = carregarOrcamentos();

        const categoriaEstaEmUso =
            transacoes.some(
                (transacao) => transacao.categoria === id
            )
            || orcamentos.some(
                (orcamento) => orcamento.categoria === id
            );

        if (categoriaEstaEmUso) {
            return {
                sucesso: false,
                categoria: null,
                erros: [
                    "Não é possível excluir uma categoria que está em uso."
                ]
            };
        }

        const categoriaRemovida = removerCategoriaRepository(id);

        return {
            sucesso: true,
            categoria: categoriaRemovida,
            erros: []
        };
    } catch (error) {
        return {
            sucesso: false,
            categoria: null,
            erros: [error.message]
        };
    }
}
