# Como o SCF armazena os dados

O Google Sheets é o armazenamento padrão do projeto. A pessoa conecta a conta
Google ao abrir o aplicativo; depois disso, o sistema lê e grava diretamente
na planilha. Não há banco local nem cópia automática no navegador.

## Fluxo

```text
Tela → Controller → Serviço financeiro → Repositório Google Sheets
```

- **Controllers:** recebem ações e atualizam a interface.
- **Serviço financeiro:** valida dados, aplica regras e calcula resumos e
  orçamentos.
- **Repositório Google Sheets:** executa leitura, cadastro, edição e exclusão
  na planilha.
- **Google Sheets:** guarda os registros nas abas `Transacoes`, `Categorias`,
  `OrcamentosMensais` e `OrcamentosCategoria`.

O repositório é específico para Google Sheets porque esse é o armazenamento
definido para o projeto. Não há uma camada genérica para alternar entre bancos.
O schema centraliza os nomes das abas e dos cabeçalhos.

## Primeiro uso

1. Configure o `clientId` em `js/config/googleConfig.js` com um cliente OAuth
   do tipo aplicativo da Web. Mantenha esse arquivo fora do Git.
2. Abra `index.html` por um servidor local.
3. Clique em **Conectar ao Google Sheets** e autorize o acesso.
4. O SCF cria a planilha `SCF Controle Financeiro` se ela ainda não existir.

O aplicativo cria as abas e os cabeçalhos esperados. Não renomeie as abas nem
altere a ordem dos cabeçalhos. Após a conexão, use o link exibido para abrir a
planilha. Ao recarregar o aplicativo, conecte-se novamente para autorizar a
sessão.

As gravações passam pelas validações financeiras e só são confirmadas na
interface após a resposta do Google. Os valores calculados são exibidos pelo
aplicativo, mas não são gravados. Se a conexão cair durante uma gravação,
confira a planilha antes de tentar novamente.
