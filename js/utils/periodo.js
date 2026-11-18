export function obterMesAtual(data = new Date()) {
    return `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, "0")}`;
}

export function mesValido(mes) {
    return typeof mes === "string"
        && /^(?!0000)\d{4}-(0[1-9]|1[0-2])$/.test(mes);
}

export function pertenceAoMes(data, mes) {
    return typeof data === "string" && data.slice(0, 7) === mes;
}
