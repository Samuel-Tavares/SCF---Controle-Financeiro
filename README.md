# SCF — Sistema de Controle Financeiro

Aplicação web para registrar receitas e despesas pessoais, planejar orçamentos e acompanhar um resumo financeiro usando uma planilha do Google Sheets como armazenamento.

## Sobre o projeto

Organizar as finanças pessoais pode exigir tempo e disciplina. O SCF foi criado para tornar esse acompanhamento mais simples e rápido, reunindo transações, orçamentos e resumo financeiro em uma interface própria.

## Funcionalidades

- Cadastrar, editar e excluir receitas e despesas.
- Cadastrar, editar e excluir orçamentos mensais.
- Cadastrar, editar e excluir orçamentos por categoria.
- Consultar o resumo financeiro do mês, incluindo receitas, despesas, saldo e taxa de economia.
- Consultar e filtrar o histórico de transações por tipo, categoria e descrição.
- Selecionar o mês usado na visão geral, nos orçamentos e no histórico.
- Salvar transações, categorias e orçamentos no Google Sheets.
- Abrir a planilha vinculada pelo atalho exibido após a conexão.
- Alternar entre os temas claro e escuro.

## Tecnologias utilizadas

- **HTML:** estrutura das páginas e formulários.
- **CSS:** estilos e apresentação dos temas claro e escuro.
- **JavaScript (módulos ES):** regras financeiras, validações, interação com a interface e organização da aplicação.
- **Google Identity Services:** autorização da conta Google no navegador.
- **Google Sheets API:** leitura e gravação dos dados na planilha.

## Como executar o projeto

### Pré-requisitos

- Navegador atualizado com suporte a módulos JavaScript.
- Conta Google.
- Acesso à internet para carregar os serviços do Google e conectar à planilha.
- Servidor HTTP local. O projeto não deve ser aberto diretamente pelo caminho do arquivo (`file://`).
- Credencial OAuth do tipo aplicativo Web, configurada para o endereço local usado pelo servidor.

### Configuração

1. No Google Cloud, crie ou selecione um projeto e habilite a Google Sheets API.
2. Configure a tela de consentimento OAuth conforme as opções disponíveis para sua conta e crie um ID de cliente OAuth do tipo **Aplicativo da Web**.
3. Cadastre como origem JavaScript autorizada o endereço local usado para abrir o aplicativo, incluindo protocolo, host e porta.
4. Copie `js/config/googleConfig.example.js` para `js/config/googleConfig.js`.
5. No arquivo `js/config/googleConfig.js`, substitua `COLE_AQUI_SEU_ID_DO_CLIENTE` pelo ID de cliente OAuth.

O arquivo `js/config/googleConfig.js` está listado no `.gitignore` e não deve ser enviado ao repositório. Não adicione tokens de acesso ou `client_secret` ao código do navegador.

### Execução

Uma opção é usar a extensão **Live Server** no Visual Studio Code:

1. Abra a pasta do projeto no VS Code e instale a extensão Live Server, caso ainda não esteja instalada.
2. Clique com o botão direito em `index.html` e escolha **Open with Live Server**.
3. O navegador abrirá o endereço local servido pela extensão. Use esse mesmo endereço como origem JavaScript autorizada na configuração OAuth.
4. Clique em **Conectar ao Google Sheets** e autorize o acesso solicitado.

O aplicativo cria a planilha `SCF Controle Financeiro` e as abas esperadas quando necessário. Após a conexão, use o link **Abrir planilha** para acessá-la.

## Como usar

1. Abra o aplicativo pelo servidor local.
2. Clique em **Conectar ao Google Sheets** e autorize a conta Google.
3. Selecione o mês de visualização. Esse período se aplica ao resumo, aos orçamentos e ao histórico.
4. Use **Nova transação** para informar tipo, recorrência, essencialidade, descrição, valor, categoria e data. A observação é opcional.
5. Use as áreas de orçamento mensal e orçamento por categoria para cadastrar limites para o mês escolhido.
6. Consulte o **Histórico de transações** e use os filtros disponíveis para localizar registros. As ações disponíveis em cada registro permitem editar ou excluir.
7. Use o botão de tema no topo para alternar entre aparência clara e escura.

## Armazenamento dos dados

Transações, categorias e orçamentos são lidos e gravados diretamente no Google Sheets da conta autorizada. O SCF prepara as abas e os cabeçalhos necessários. A preferência de tema é guardada localmente no navegador; os dados financeiros não são armazenados localmente pelo aplicativo.

A autorização do Google precisa ser refeita após recarregar a página. Consulte [`docs/armazenamento.md`](docs/armazenamento.md) para detalhes sobre o fluxo, as abas e o primeiro uso.

## Estrutura do projeto

```text
SCF_Controle_Financeiro/
├── css/
│   └── style.css                 # estilos da aplicação
├── docs/
│   └── armazenamento.md          # detalhes sobre a persistência no Google Sheets
├── js/
│   ├── config/                   # configurações e categorias iniciais
│   ├── controllers/              # eventos da interface e coordenação das ações
│   ├── repositories/             # acesso ao Google Sheets e estrutura das abas
│   ├── services/                 # regras financeiras e integração com serviços Google
│   ├── utils/                    # validações, formatação e funções auxiliares
│   ├── views/                    # atualização de elementos da interface
│   └── main.js                   # inicialização da aplicação
├── index.html                    # estrutura da página
└── README.md                     # documentação principal
```

## Limitações conhecidas

- É necessária uma conexão com a internet e autorização da conta Google para ler e gravar os dados financeiros.
- Após recarregar a página, é necessário conectar-se novamente ao Google.
- O projeto não mantém uma cópia local nem faz backup automático dos dados financeiros. Se uma gravação falhar ou a conexão cair, confira a planilha antes de repetir a operação.
- A estrutura das abas e a ordem dos cabeçalhos da planilha devem ser mantidas conforme criadas pelo aplicativo.

## Segurança e configuração local

O arquivo `js/config/googleConfig.js` contém a configuração local do cliente OAuth e é ignorado pelo Git. Use `js/config/googleConfig.example.js` como modelo para preparar sua cópia.

## Autor

Samuel Oliveira
