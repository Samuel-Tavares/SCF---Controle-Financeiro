export function formatarMoeda(valor) {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL"
    }).format(valor);
}

export function formatarData(data) {
    const [ano, mes, dia] = data.split("-").map(Number);
    const dataLocal = new Date(ano, mes - 1, dia);

    return new Intl.DateTimeFormat("pt-BR").format(dataLocal);
}

export function formatarPorcentagem(valor) {
    return new Intl.NumberFormat("pt-BR", {
        style: "percent",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(valor / 100);
}

export function formatarMesReferencia(mesReferencia) {
    const [ano, mes] = mesReferencia.split("-").map(Number);

    const data = new Date(ano, mes - 1, 1);

    return new Intl.DateTimeFormat("pt-BR", {
        month: "long",
        year: "numeric"
    }).format(data);
}