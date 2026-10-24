export function renderizarCategoriasTransacao(
    categorias,
    textoInicial = "Selecione"
) {
    const campoCategoria = document.querySelector(
        "#categoria"
    );

    if (!campoCategoria) {
        throw new Error(
            "Campo de categoria da transação não encontrado."
        );
    }

    campoCategoria.replaceChildren();

    const opcaoInicial = document.createElement("option");

    opcaoInicial.value = "";
    opcaoInicial.textContent = textoInicial;
    opcaoInicial.disabled = true;
    opcaoInicial.selected = true;

    campoCategoria.append(opcaoInicial);

    categorias.forEach(categoria => {
        const opcao = document.createElement("option");

        opcao.value = categoria.id;
        opcao.textContent = categoria.nome;

        campoCategoria.append(opcao);
    });
}

export function renderizarCategoriasFiltro(
    categorias
) {
    const campoCategoria = document.querySelector(
        "#filtro-categoria"
    );

    if (!campoCategoria) {
        throw new Error(
            "Campo de categoria do filtro não encontrado."
        )
    }

    campoCategoria.replaceChildren();

    const opcaoTodas = document.createElement("option");

    opcaoTodas.value = "";
    opcaoTodas.textContent = "Todas";
    opcaoTodas.selected = true;

    campoCategoria.append(opcaoTodas);

    categorias.forEach((categoria) => {
        const opcao = document.createElement("option");

        const tipoFormatado =
            categoria.tipoRelacionado === "receita"
                ? "Receita"
                : "Despesa";

        opcao.value = categoria.id;
        opcao.textContent =
            `${categoria.nome} (${tipoFormatado})`;

        campoCategoria.append(opcao);
    });
}

export function renderizarCategoriasOrcamento(
    categorias
) {
    const campoCategoria = document.querySelector(
        "#orcamento-categoria"
    );

    if (!campoCategoria) {
        throw new Error(
            "Campo de categoria do orçamento não encontrado."
        );
    }

    campoCategoria.replaceChildren();

    const opcaoInicial = document.createElement("option");

    opcaoInicial.value = "";
    opcaoInicial.textContent = "Selecione";
    opcaoInicial.disabled = true;
    opcaoInicial.selected = true;

    campoCategoria.append(opcaoInicial);

    categorias.forEach((categoria) => {
        const opcao = document.createElement("option");

        opcao.value = categoria.id;
        opcao.textContent = categoria.nome;

        campoCategoria.append(opcao);
    });
}
