export function validarTransacao(transacao) {
    const erros = [];

    if (!["receita", "despesa"].includes(transacao.tipo)) {
        erros.push("Selecione um tipo de transação válido.");
    }

    if (!["fixa", "variavel"].includes(transacao.recorrencia)) {
        erros.push("Selecione uma recorrência válida.");
    }

    if (!["essencial", "nao-essencial"].includes(transacao.essencialidade)) {
        erros.push("Selecione uma essencialidade válida.");
    }

    if (
        transacao.descricao === "" 
        || transacao.descricao === undefined
        || transacao.descricao === null
    ) {
        erros.push('A descrição não deve ser vazia');
    }

    if (
        transacao.categoria === "" 
        || transacao.categoria === undefined
        || transacao.categoria === null
    ) {
        erros.push('A categoria não deve ser vazia');
    }

    if (!Number.isFinite(transacao.valor)) {
        erros.push('Informe um valor válido!');
    } else if (transacao.valor <= 0) {
        erros.push('O valor deve ser maior que 0');
    }

    const resultadoValidacaoData = validarDatasPossiveis(transacao.data);

    if (resultadoValidacaoData) {
        erros.push(resultadoValidacaoData);
    }

    return erros;
}

function anoBissexto(ano) {
    return (ano % 4 === 0 && ano % 100 !== 0) || (ano % 400 === 0);
}

function validarDatasPossiveis(dataStr) {
    if (!dataStr) {
        return "A data é obrigatória.";
    }

    const regexData = /^\d{4}-\d{2}-\d{2}$/;
    if (!regexData.test(dataStr)) {
        return "Formato inválido (use YYYY-MM-DD).";
    }

    const [ano, mes, dia] = dataStr.split("-").map(Number);

    const diasPorMes = [31, (anoBissexto(ano) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    if (mes < 1 || mes > 12) {
        return "Mês inválido.";
    }

    if (dia < 1 || dia > diasPorMes[mes - 1]) {
        return `Dia inválido para o mês ${mes}.`;
    }

    return;
}
