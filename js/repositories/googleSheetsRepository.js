import { COLECOES_GOOGLE, ESTRUTURA_PLANILHA } from "./googleSheetsSchema.js";

let conexao = null;

export function conectarGoogleSheets({ planilhaId, requisicao }) {
    conexao = { planilhaId, requisicao };
}

export function desconectarGoogleSheets() {
    conexao = null;
}

function obterConexao() {
    if (!conexao) throw new Error("Conecte-se para acessar os dados financeiros.");
    return conexao;
}

function obterBaseUrl() {
    const { planilhaId } = obterConexao();
    return `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(planilhaId)}/values/`;
}

function obterEstrutura(colecao) {
    const aba = COLECOES_GOOGLE[colecao];
    const colunas = ESTRUTURA_PLANILHA[aba];
    if (!colunas) throw new Error(`Coleção desconhecida: ${colecao}.`);
    return { aba, colunas, ultimaColuna: String.fromCharCode(64 + colunas.length) };
}

function selecionarCampos(registro, colunas) {
    return Object.fromEntries(colunas.map((coluna) => [coluna, registro[coluna] ?? ""]));
}

async function ler(colecao) {
    const { requisicao } = obterConexao();
    const { aba, colunas, ultimaColuna } = obterEstrutura(colecao);
    const intervalo = encodeURIComponent(`'${aba}'!A:${ultimaColuna}`);
    const resposta = await requisicao(`${obterBaseUrl()}${intervalo}?valueRenderOption=UNFORMATTED_VALUE&majorDimension=ROWS`);
    const [cabecalho = [], ...linhas] = resposta.values ?? [];

    if (cabecalho.length !== colunas.length || colunas.some((coluna, i) => coluna !== cabecalho[i])) {
        throw new Error(`Confira os cabeçalhos da aba ${aba}.`);
    }

    return linhas.map((linha, i) => {
        if (!linha.some((valor) => valor !== "" && valor != null)) return null;
        const dados = Object.fromEntries(colunas.map((coluna, j) => [coluna, linha[j]]));
        return { registro: selecionarCampos(dados, colunas), numeroLinha: i + 2 };
    }).filter(Boolean);
}

async function localizar(colecao, id) {
    const itens = await ler(colecao);
    const item = itens.find(({ registro }) => registro.id === id);
    if (!item) throw new Error("Registro não encontrado na planilha.");

    const { requisicao } = obterConexao();
    const { aba, ultimaColuna } = obterEstrutura(colecao);
    const intervalo = encodeURIComponent(`'${aba}'!A${item.numeroLinha}:${ultimaColuna}${item.numeroLinha}`);
    return { ...item, url: obterBaseUrl() + intervalo };
}

export async function listar(colecao) {
    return (await ler(colecao)).map(({ registro }) => ({ ...registro }));
}

export async function buscarPorId(colecao, id) {
    const registros = await listar(colecao);
    return registros.find((registro) => registro.id === id) ?? null;
}

export async function criar(colecao, registro) {
    const { requisicao } = obterConexao();
    const { aba, colunas, ultimaColuna } = obterEstrutura(colecao);
    const novo = selecionarCampos(registro, colunas);
    const intervalo = encodeURIComponent(`'${aba}'!A:${ultimaColuna}`);
    await requisicao(`${obterBaseUrl()}${intervalo}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`, {
        method: "POST",
        body: JSON.stringify({ majorDimension: "ROWS", values: [colunas.map((coluna) => novo[coluna])] })
    });
    return novo;
}

export async function atualizar(colecao, registro) {
    const item = await localizar(colecao, registro.id);
    const { colunas } = obterEstrutura(colecao);
    const novo = selecionarCampos(registro, colunas);
    await obterConexao().requisicao(`${item.url}?valueInputOption=RAW`, {
        method: "PUT",
        body: JSON.stringify({ majorDimension: "ROWS", values: [colunas.map((coluna) => novo[coluna])] })
    });
    return novo;
}

export async function excluir(colecao, id) {
    const item = await localizar(colecao, id);
    await obterConexao().requisicao(`${item.url}:clear`, { method: "POST" });
    return item.registro;
}
