let temporizadorToast;

function buscarElementoMensagem(seletor) {
    const elemento = document.querySelector(seletor);

    if (!elemento) {
        throw new Error(`Elemento de mensagem não encontrado: ${seletor}`);
    }

    return elemento;
}

export function exibirMensagem(
    seletor,
    mensagens,
    tipo = "erro"
) {
    const elemento = buscarElementoMensagem(seletor);

    const conteudo = Array.isArray(mensagens)
        ? mensagens.join(" ")
        : mensagens;

    elemento.textContent = conteudo;

    elemento.classList.remove(
        "mensagem-erro",
        "mensagem-sucesso"
    );

    const classe = tipo === "sucesso"
        ? "mensagem-sucesso"
        : "mensagem-erro";

    elemento.classList.add(classe);

    if (elemento.classList.contains("toast-message")) {
        clearTimeout(temporizadorToast);
        elemento.classList.add("toast-visible");
        temporizadorToast = setTimeout(() => {
            elemento.classList.remove("toast-visible");
            elemento.textContent = "";
            elemento.classList.remove("mensagem-erro", "mensagem-sucesso");
        }, 4500);
    }
}

export function limparMensagem(seletor) {
    const elemento = buscarElementoMensagem(seletor);

    if (elemento.classList.contains("toast-message")) {
        clearTimeout(temporizadorToast);
        elemento.classList.remove("toast-visible");
    }

    elemento.textContent = "";

    elemento.classList.remove("mensagem-erro", "mensagem-sucesso");
}
