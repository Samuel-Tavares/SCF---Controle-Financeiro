import { GOOGLE_CONFIG } from "../config/googleConfig.js";
import { requisicaoGoogle } from "./googleApiService.js";

export const ESTRUTURA_PLANILHA = {
    Transacoes: [
        "id",
        "tipo",
        "recorrencia",
        "essencialidade",
        "descricao",
        "valor",
        "categoria",
        "data",
        "observacao"
    ],

    OrcamentosMensais: [
        "id",
        "mes",
        "valorLimite"
    ],

    OrcamentosCategoria: [
        "id",
        "categoria",
        "mes",
        "valorLimite"
    ],

    Categorias: [
        "id",
        "nome",
        "tipoRelacionado"
    ]
};

function escaparConsulta(valor) {
    return valor
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'");
}

async function buscarPlanilha() {
    const nome = escaparConsulta(
        GOOGLE_CONFIG.spreadsheetTitle
    );

    const parametros = new URLSearchParams({
        q: [
            `name = '${nome}'`,
            "mimeType = 'application/vnd.google-apps.spreadsheet'",
            "trashed = false",
            "'me' in owners"
        ].join(" and "),
        fields: "nextPageToken,incompleteSearch,files(id,name)",
        pageSize: "100"
    });

    const arquivos = [];
    let proximaPagina;

    do {
        if (proximaPagina) {
            parametros.set("pageToken", proximaPagina);
        }

        const resultado = await requisicaoGoogle(
            `https://www.googleapis.com/drive/v3/files?${parametros}`
        );

        if (resultado.incompleteSearch) {
            throw new Error(
                "A busca pela planilha ficou incompleta. Tente novamente."
            );
        }

        arquivos.push(...(resultado.files ?? []));
        proximaPagina = resultado.nextPageToken;
    } while (proximaPagina);

    if (arquivos.length > 1) {
        throw new Error(
            "Foi encontrada mais de uma planilha do SCF com esse nome. Defina nomes diferentes antes de continuar."
        );
    }

    return arquivos[0] ?? null;
}

async function criarPlanilha() {
    const abas = Object.entries(ESTRUTURA_PLANILHA).map(
        ([nome, colunas]) => ({
            properties: {
                title: nome,
                gridProperties: {
                    frozenRowCount: 1
                }
            },

            data: [{
                startRow: 0,
                startColumn: 0,
                rowData: [{
                    values: colunas.map((coluna) => ({
                        userEnteredValue: {
                            stringValue: coluna
                        },
                        userEnteredFormat: {
                            textFormat: {
                                bold: true
                            }
                        }
                    }))
                }]
            }]
        })
    );

    const resultado = await requisicaoGoogle(
        "https://sheets.googleapis.com/v4/spreadsheets",
        {
            method: "POST",
            body: JSON.stringify({
                properties: {
                    title: GOOGLE_CONFIG.spreadsheetTitle,
                    locale: "pt_BR",
                    timeZone: "America/Sao_Paulo"
                },
                sheets: abas
            })
        }
    );

    return {
        id: resultado.spreadsheetId,
        name: resultado.properties.title
    };
}

export async function prepararPlanilha() {
    const existente = await buscarPlanilha();

    const planilha = existente ?? await criarPlanilha();

    return {
        id: planilha.id,
        nome: planilha.name,
        url: `https://docs.google.com/spreadsheets/d/${encodeURIComponent(planilha.id)}/edit`,
        criadaAgora: existente === null
    };
}

function obterEstruturaAba(nomeAba) {
    const colunas = ESTRUTURA_PLANILHA[nomeAba];

    if (!Array.isArray(colunas)) {
        throw new Error(`Aba desconhecida: ${nomeAba}.`);
    }

    const ultimaColuna = String.fromCharCode(
        65 + colunas.length - 1
    );

    return {
        colunas,
        intervalo: `'${nomeAba}'!A:${ultimaColuna}`
    };
}

export async function lerRegistros(planilhaId, nomeAba) {
    const { colunas, intervalo } = obterEstruturaAba(nomeAba);

    const parametros = new URLSearchParams({
        majorDimension: "ROWS",
        valueRenderOption: "UNFORMATTED_VALUE"
    });

    const url =
        "https://sheets.googleapis.com/v4/spreadsheets/"
        + `${encodeURIComponent(planilhaId)}/values/`
        + `${encodeURIComponent(intervalo)}?${parametros}`;

    const resultado = await requisicaoGoogle(url);

    const linhas = resultado.values ?? [];
    const cabecalho = linhas[0] ?? [];

    const cabecalhoValido =
        cabecalho.length === colunas.length
        && colunas.every(
            (coluna, indice) => cabecalho[indice] === coluna
        );

    if (!cabecalhoValido) {
        throw new Error(
            `Os cabeçalhos da aba ${nomeAba} não correspondem à estrutura esperada.`
        );
    }

    return linhas
        .slice(1)
        .filter((linha) =>
            linha.some((valor) => valor !== "" && valor != null)
        )
        .map((linha) => {
            const registro = Object.fromEntries(
                colunas.map((coluna, indice) => [
                    coluna,
                    linha[indice] ?? ""
                ])
            );

            if (
                typeof registro.id !== "string"
                || registro.id.trim() === ""
            ) {
                throw new Error(
                    `Existe um registro sem ID válido na aba ${nomeAba}.`
                );
            }

            return registro;
        });
}

export async function adicionarRegistros(
    planilhaId,
    nomeAba,
    registros
) {
    if (!Array.isArray(registros) || registros.length === 0) {
        throw new Error("Informe os registros que serão adicionados.");
    }

    const { colunas, intervalo } = obterEstruturaAba(nomeAba);

    const existentes = await lerRegistros(planilhaId, nomeAba);

    const ids = new Set(
        existentes.map((registro) => registro.id)
    );

    for (const registro of registros) {
        if (
            typeof registro.id !== "string"
            || registro.id.trim() === ""
        ) {
            throw new Error("Todo registro precisa ter um ID válido.");
        }

        if (ids.has(registro.id)) {
            throw new Error(
                `Já existe um registro com o ID ${registro.id} na aba ${nomeAba}.`
            );
        }

        ids.add(registro.id);
    }

    const valores = registros.map((registro) =>
        colunas.map((coluna) => registro[coluna] ?? "")
    );

    const parametros = new URLSearchParams({
        valueInputOption: "RAW",
        insertDataOption: "INSERT_ROWS"
    });

    const url =
        "https://sheets.googleapis.com/v4/spreadsheets/"
        + `${encodeURIComponent(planilhaId)}/values/`
        + `${encodeURIComponent(intervalo)}:append?${parametros}`;

    return requisicaoGoogle(url, {
        method: "POST",
        body: JSON.stringify({
            majorDimension: "ROWS",
            values: valores
        })
    });
}