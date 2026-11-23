import { validarTransacao } from "../utils/validarTransacao.js";
import * as repositorio from "../repositories/googleSheetsRepository.js";
import { validarOrcamentoCategoria } from "../utils/validarOrcamentoCategoria.js"

import {
    validarCategoria
} from "../utils/validarCategoria.js";

import {
    validarOrcamentoMensal
} from "../utils/validarOrcamentoMensal.js";

import { tratarErros } from "../utils/tratarErros.js";
import { obterMesAtual, pertenceAoMes } from "../utils/periodo.js";

import { CATEGORIAS_INICIAIS } from "../config/categoriasIniciais.js";
export { CATEGORIAS_INICIAIS };


export async function inicializarCategorias() {
    try {
        const categoriasExistentes = await repositorio.listar("categorias");

        if (categoriasExistentes.length > 0) {
            return {
                sucesso: true,
                categorias: categoriasExistentes,
                erros: []
            };
        }

        const categoriasSalvas = [];

        for (const dadosCategoria of CATEGORIAS_INICIAIS) {
            categoriasSalvas.push(await repositorio.criar("categorias", { ...dadosCategoria }));
        }


        return {
            sucesso: true,
            categorias: categoriasSalvas,
            erros: []
        };
    } catch (error) {
        return {
            sucesso: false,
            categorias: [],
            erros: tratarErros(error)
        };
    }
}

export async function cadastrarTransacao(dados) {
    try {
        const categoria = await repositorio.buscarPorId("categorias",
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

        const transacao = {
            ...dados,
            id: crypto.randomUUID()
        };

        const transacaoSalva = await repositorio.criar("transacoes", transacao);

        return {
            sucesso: true,
            transacao: transacaoSalva,
            erros: []
        };
    } catch (error) {
        return {
            sucesso: false,
            transacao: null,
            erros: tratarErros(error)
        };
    }
}

export async function excluirTransacao(id) {
    try {
        const transacaoRemovida = await repositorio.excluir("transacoes", id);

        return {
            sucesso: true,
            transacao: transacaoRemovida,
            erros: []
        };
    } catch (error) {
        return {
            sucesso: false,
            transacao: null,
            erros: tratarErros(error)
        };
    }
}

export async function editarTransacao(id, dados) {
    try {
        const categoria = await repositorio.buscarPorId("categorias",
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

        const transacaoAtualizada = {
            ...dados,
            id
        };

        const transacaoSalva = await repositorio.atualizar("transacoes",
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
            erros: tratarErros(error)
        };
    }
}

export function calcularSaldo(
    receitasEmCentavos,
    despesasEmCentavos
) {
    return (receitasEmCentavos - despesasEmCentavos) / 100;
}

export async function calcularResumo(mesReferencia = obterMesAtual()) {
    try {
        const [todasTransacoes, orcamentosMensais] = await Promise.all([
            repositorio.listar("transacoes"), repositorio.listar("orcamentosMensais")
        ]);
        const transacoes = todasTransacoes.filter(
            (transacao) => pertenceAoMes(transacao.data, mesReferencia)
        );

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

        const saldo = calcularSaldo(
            receitasEmCentavos,
            despesasEmCentavos
        );

        const taxaEconomia = receitasEmCentavos > 0 ? (
            (receitasEmCentavos - despesasEmCentavos) / receitasEmCentavos) * 100
            : 0;

        const orcamentoDoMes = orcamentosMensais.find(
            (orcamento) => orcamento.mes === mesReferencia
        );

        const resumo = {
            totalReceitas,
            totalDespesas,
            saldo,
            taxaEconomia,
            orcamentoMensal: orcamentoDoMes?.valorLimite ?? null
        };

        return {
            sucesso: true,
            resumo,
            erros: []
        };
    } catch (error) {
        return {
            sucesso: false,
            resumo: null,
            erros: tratarErros(error)
        };
    }
}

export async function cadastrarOrcamentoCategoria(dados) {
    try {
        const categoria = await repositorio.buscarPorId("categorias",
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

        const orcamentos = await repositorio.listar("orcamentosCategoria");

        const orcamentoExistente = orcamentos.some(
            (orcamento) =>
                orcamento.categoria === dados.categoria
                && orcamento.mes === dados.mes
        );

        if (orcamentoExistente) {
            return {
                sucesso: false,
                orcamento: null,
                erros: [
                    "Já existe um orçamento para esta categoria neste mês."
                ]
            };
        }

        const orcamento = {
            ...dados,
            id: crypto.randomUUID()
        };

        const orcamentoSalvo = await repositorio.criar("orcamentosCategoria",
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
            erros: tratarErros(error)
        };
    }
}

export function calcularOrcamentos(valorLimite, despesas) {
    const limiteEmCentavos = Math.round(valorLimite * 100);

    const utilizadoEmCentavos = despesas.reduce(
        (total, despesa) =>
            total + Math.round(despesa.valor * 100), 0
    );

    return {
        valorUtilizado: utilizadoEmCentavos / 100,
        percentualAtingido: limiteEmCentavos > 0
            ? (utilizadoEmCentavos / limiteEmCentavos) * 100
            : 0
    };
}

export async function listarOrcamentosCategoria(mesReferencia = obterMesAtual()) {
    try {
        const [todosOrcamentos, transacoes, categorias] = await Promise.all([
            repositorio.listar("orcamentosCategoria"), repositorio.listar("transacoes"), repositorio.listar("categorias")
        ]);
        const orcamentos = todosOrcamentos.filter(
            (orcamento) => orcamento.mes === mesReferencia
        );

        const orcamentosCalculados = orcamentos.map(
            (orcamento) => {
                const despesasDaCategoria = transacoes.filter(
                    (transacao) =>
                        transacao.tipo === "despesa"
                        && transacao.categoria === orcamento.categoria
                        && pertenceAoMes(transacao.data, orcamento.mes)
                );

                const { valorUtilizado, percentualAtingido } =
                    calcularOrcamentos(
                        orcamento.valorLimite,
                        despesasDaCategoria
                    );

                const categoriaRelacionada = categorias.find(
                    (categoria) =>
                        categoria.id === orcamento.categoria
                );

                return {
                    ...orcamento,
                    categoriaNome:
                        categoriaRelacionada?.nome
                        ?? "Categoria não encontrada",
                    valorUtilizado,
                    percentualAtingido
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
            erros: tratarErros(error)
        };
    }
}

export async function excluirOrcamentoCategoria(id) {
    try {
        const orcamentoRemovido = await repositorio.excluir("orcamentosCategoria", id);

        return {
            sucesso: true,
            orcamento: orcamentoRemovido,
            erros: []
        };
    } catch (error) {
        return {
            sucesso: false,
            orcamento: null,
            erros: tratarErros(error)
        };
    }
}

export async function editarOrcamentoCategoria(id, dados) {
    try {
        const categoria = await repositorio.buscarPorId("categorias",
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

        const orcamentos = await repositorio.listar("orcamentosCategoria");

        const orcamentoDuplicado = orcamentos.some(
            (orcamento) =>
                orcamento.id !== id
                && orcamento.categoria === dados.categoria
                && orcamento.mes === dados.mes
        );

        if (orcamentoDuplicado) {
            return {
                sucesso: false,
                orcamento: null,
                erros: [
                    "Já existe um orçamento para esta categoria neste mês."
                ]
            };
        }

        const orcamentoAtualizado = {
            ...dados,
            id
        };

        const orcamentoSalvo = await repositorio.atualizar("orcamentosCategoria",
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
            erros: tratarErros(error)
        };
    }
}

export function pesquisarPorDescricao(transacoes, descricao = "") {
    const termo = descricao.trim().toLowerCase();

    return transacoes.filter((transacao) =>
        transacao.descricao.toLowerCase().includes(termo)
    );
}

export function ordenar(transacoes) {
    return [...transacoes].sort(
        (transacaoA, transacaoB) =>
            transacaoB.data.localeCompare(transacaoA.data)
    );
}

export async function filtrarTransacoes({
    tipo = "",
    categoria = "",
    mesReferencia = obterMesAtual(),
    descricao = ""
} = {}) {
    try {
        const [todasTransacoes, categorias] = await Promise.all([
            repositorio.listar("transacoes"), repositorio.listar("categorias")
        ]);
        const transacoes = pesquisarPorDescricao(todasTransacoes, descricao);

        const transacoesFiltradas = transacoes
            .filter((transacao) => {
                const correspondeAoTipo =
                    tipo === "" || transacao.tipo === tipo;

                const correspondeACategoria =
                    categoria === "" || transacao.categoria === categoria;

                const correspondeAoMes =
                    pertenceAoMes(transacao.data, mesReferencia);

                return (
                    correspondeAoTipo
                    && correspondeACategoria
                    && correspondeAoMes);
            })
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
            transacoes: ordenar(transacoesFiltradas),
            erros: []
        };
    } catch (error) {
        return {
            sucesso: false,
            transacoes: [],
            erros: tratarErros(error)
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

export async function listarCategorias() {
    try {
        const categorias = await repositorio.listar("categorias");

        return {
            sucesso: true,
            categorias,
            erros: []
        };
    } catch (error) {
        return {
            sucesso: false,
            categorias: [],
            erros: tratarErros(error)
        };
    }
}

export async function cadastrarCategoria(dados) {
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
        const categorias = await repositorio.listar("categorias");

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

        const categoria = {
            ...dadosNormalizados,
            id: crypto.randomUUID()
        };

        const categoriaSalva = await repositorio.criar("categorias", categoria);

        return {
            sucesso: true,
            categoria: categoriaSalva,
            erros: []
        };
    } catch (error) {
        return {
            sucesso: false,
            categoria: null,
            erros: tratarErros(error)
        };
    }

}

export async function editarCategoria(id, dados) {
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
        const categorias = await repositorio.listar("categorias");

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

        const categoriaAtualizada = {
            ...dadosNormalizados,
            id
        };

        const categoriaSalva = await repositorio.atualizar("categorias", categoriaAtualizada);

        return {
            sucesso: true,
            categoria: categoriaSalva,
            erros: []
        };
    } catch (error) {
        return {
            sucesso: false,
            categoria: null,
            erros: tratarErros(error)
        };
    }
}

export async function excluirCategoria(id) {
    try {
        const categoria = await repositorio.buscarPorId("categorias", id);

        if (categoria === null) {
            return {
                sucesso: false,
                categoria: null,
                erros: ["Categoria não encontrada."]
            };
        }

        const transacoes = await repositorio.listar("transacoes");
        const orcamentos = await repositorio.listar("orcamentosCategoria");

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

        const categoriaRemovida = await repositorio.excluir("categorias", id);

        return {
            sucesso: true,
            categoria: categoriaRemovida,
            erros: []
        };
    } catch (error) {
        return {
            sucesso: false,
            categoria: null,
            erros: tratarErros(error)
        };
    }
}

export async function cadastrarOrcamentoMensal(dados) {
    const erros = validarOrcamentoMensal(dados);

    if (erros.length > 0) {
        return {
            sucesso: false,
            orcamento: null,
            erros
        };
    }

    try {
        const orcamentos = await repositorio.listar("orcamentosMensais");

        const orcamentoExistente = orcamentos.some(
            (orcamento) => orcamento.mes === dados.mes
        );

        if (orcamentoExistente) {
            return {
                sucesso: false,
                orcamento: null,
                erros: ["Já existe um orçamento mensal para este mês."]
            };
        }

        const orcamento = {
            id: crypto.randomUUID(),
            mes: dados.mes,
            valorLimite: dados.valorLimite
        };

        const orcamentoSalvo = await repositorio.criar("orcamentosMensais", orcamento);

        return {
            sucesso: true,
            orcamento: orcamentoSalvo,
            erros: []
        };
    } catch (error) {
        return {
            sucesso: false,
            orcamento: null,
            erros: tratarErros(error)
        };
    }
}

export async function listarOrcamentosMensais(mesReferencia = obterMesAtual()) {
    try {
        const [todosOrcamentos, transacoes] = await Promise.all([
            repositorio.listar("orcamentosMensais"), repositorio.listar("transacoes")
        ]);
        const orcamento = todosOrcamentos.filter(
            (orcamento) => orcamento.mes === mesReferencia
        );

        const orcamentosCalculados = orcamento.map(
            (orcamento) => {
                const despesasDoMes = transacoes.filter(
                    (transacao) =>
                        transacao.tipo === "despesa"
                        && pertenceAoMes(transacao.data, orcamento.mes)
                );

                const { valorUtilizado, percentualAtingido } =
                    calcularOrcamentos(
                        orcamento.valorLimite,
                        despesasDoMes
                    );

                return {
                    ...orcamento,
                    valorUtilizado,
                    percentualAtingido
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
            erros: tratarErros(error)
        };
    }
}

export async function editarOrcamentoMensal(id, dados) {
    const erros = validarOrcamentoMensal(dados);

    if (erros.length > 0) {
        return {
            sucesso: false,
            orcamento: null,
            erros
        };
    }

    try {
        const orcamentos = await repositorio.listar("orcamentosMensais");

        const orcamentoDuplicado = orcamentos.some(
            (orcamento) =>
                orcamento.id !== id
                && orcamento.mes === dados.mes
        );

        if (orcamentoDuplicado) {
            return {
                sucesso: false,
                orcamento: null,
                erros: [
                    "Já existe um orçamento mensal para este mês."
                ]
            };
        }

        const orcamentoAtualizado = {
            id,
            mes: dados.mes,
            valorLimite: dados.valorLimite
        };

        const orcamentoSalvo = await repositorio.atualizar("orcamentosMensais", orcamentoAtualizado);

        return {
            sucesso: true,
            orcamento: orcamentoSalvo,
            erros: []
        };
    } catch (error) {
        return {
            sucesso: false,
            orcamento: null,
            erros: tratarErros(error)
        };
    }
}

export async function excluirOrcamentoMensal(id) {
    try {
        const orcamentoRemovido = await repositorio.excluir("orcamentosMensais", id);

        return {
            sucesso: true,
            orcamento: orcamentoRemovido,
            erros: []
        };
    } catch (error) {
        return {
            sucesso: false,
            orcamento: null,
            erros: tratarErros(error)
        };
    }
}
