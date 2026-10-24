const CHAVE = "scf_categorias";

export function carregarCategorias() {
    try {
        const categoriasSalvas = localStorage.getItem(CHAVE);

        if (categoriasSalvas === null) {
            return [];
        }

        const categorias = JSON.parse(categoriasSalvas);

        if (!Array.isArray(categorias)) {
            throw new Error("Os dados das categorias não são do tipo lista.");
        }

        return categorias;
    } catch (error) {
        throw new Error(`Falha ao carregar categorias: ${error.message}`);
    }
}

export function salvarCategoria(categoria) {
    try {
        const categorias = carregarCategorias();

        categorias.push(categoria);

        localStorage.setItem(CHAVE, JSON.stringify(categorias));

        return categoria;
    } catch (error) {
        throw new Error(`Falha ao salvar categoria: ${error.message}`);
    }
}

export function atualizarCategoria(categoriaAtualizada) {
    try {
        const categorias = carregarCategorias();

        const indice = categorias.findIndex(
            (categoria) =>
                categoria.id === categoriaAtualizada.id
        );

        if (indice === -1) {
            throw new Error("Categoria não encontrada");
        }

        categorias[indice] = categoriaAtualizada;

        localStorage.setItem(CHAVE, JSON.stringify(categorias));

        return categoriaAtualizada;
    } catch (error) {
        throw new Error(`Falha ao atualizar categoria: ${error.message}`);
    }
}

export function removerCategoria(id) {
    try {
        const categorias = carregarCategorias();

        const indice = categorias.findIndex(
            (categoria) =>
                categoria.id === id
        );

        if (indice === -1) {
            throw new Error("Categoria não encontrada.");
        }

        const [categoriaRemovida] = categorias.splice(indice, 1);

        localStorage.setItem(CHAVE, JSON.stringify(categorias));

        return categoriaRemovida;
    } catch (error) {
        throw new Error(`Falha ao remover categoria: ${error.message}`);
    }
}

export function buscarCategoriaPorId(id) {
    try {
        const categorias = carregarCategorias();

        const categoriaEncontrada = categorias.find(
            (categoria) => categoria.id === id
        );

        return categoriaEncontrada ?? null;
    } catch (error) {
        throw new Error(
            `Falha ao buscar categoria: ${error.message}`
        );
    }
}
