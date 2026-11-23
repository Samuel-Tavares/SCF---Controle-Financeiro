import { exibirMensagem } from "../views/mensagemView.js";

const operacoesEmAndamento = new Set();

export async function executarAcaoFinanceira(seletorMensagem, operacao) {
    if (operacoesEmAndamento.has(seletorMensagem)) return;
    operacoesEmAndamento.add(seletorMensagem);
    try {
        return await operacao();
    } catch (erro) {
        exibirMensagem(seletorMensagem, erro.message);
    } finally {
        operacoesEmAndamento.delete(seletorMensagem);
    }
}

export function criarControleLeitura() {
    let sequencia = 0;
    return () => {
        const atual = ++sequencia;
        return () => atual === sequencia;
    };
}

export function exibirResultadoGravacao(seletor, mensagem, atualizou) {
    exibirMensagem(seletor, atualizou ? mensagem :
        `${mensagem} Não foi possível atualizar todos os dados na tela. Reconecte para recarregá-los.`,
    atualizou ? "sucesso" : "erro");
}
