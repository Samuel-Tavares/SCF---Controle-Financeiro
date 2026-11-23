
import { ESTRUTURA_PLANILHA } from "../repositories/googleSheetsSchema.js";
import { CATEGORIAS_INICIAIS } from "../config/categoriasIniciais.js";

function escaparConsulta(valor) {
    return valor
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'");
}

async function buscarPlanilha(requisicaoGoogle, nomePlanilha) {
    const nome = escaparConsulta(
        nomePlanilha
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

async function criarPlanilha(requisicaoGoogle, nomePlanilha) {
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
                }, ...(nome === "Categorias" ? CATEGORIAS_INICIAIS.map((categoria) => ({
                    values: colunas.map((coluna) => ({
                        userEnteredValue: { stringValue: categoria[coluna] }
                    }))
                })) : [])]
            }]
        })
    );

    const resultado = await requisicaoGoogle(
        "https://sheets.googleapis.com/v4/spreadsheets",
        {
            method: "POST",
            body: JSON.stringify({
                properties: {
                    title: nomePlanilha,
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

export async function prepararPlanilha({ requisicao, nomePlanilha }) {
    const existente = await buscarPlanilha(requisicao, nomePlanilha);

    const planilha = existente ?? await criarPlanilha(requisicao, nomePlanilha);

    return {
        id: planilha.id,
        nome: planilha.name,
        url: `https://docs.google.com/spreadsheets/d/${encodeURIComponent(planilha.id)}/edit`,
        criadaAgora: existente === null
    };
}
