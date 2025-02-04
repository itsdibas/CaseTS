![HTML](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)


# Sistema de Vendas

Este sistema de vendas foi desenvolvido utilizando **HTML, CSS e JavaScript**, com armazenamento de dados no **localStorage**. Ele permite:

- Cadastro de clientes e produtos
- Criação de pedidos
- Exibição das vendas realizadas

## Como Executar o Sistema

1. **Download e Extração**  
   Faça o download dos arquivos e extraia-os para uma pasta local.

2. **Abrir o Arquivo Principal**  
   Localize o arquivo **index.html** e abra-o em um navegador web de sua preferência (Google Chrome, Firefox, Edge, etc.).

3. **Utilização do Sistema**  

   - **Cadastro de Clientes**  
     No menu inicial, clique no botão **Cadastrar Cliente**. Insira o **CPF (11 dígitos numéricos)** e o **nome** no formulário. Em seguida, clique em **"Cadastrar Cliente"**.
   
   - **Cadastro de Produtos**  
     No menu inicial, clique no botão **Cadastrar Produto**. Informe o **ID do produto (9 dígitos numéricos)**, o **nome do produto** e o **valor**. Em seguida, clique em **"Cadastrar Produto"**.
   
   - **Criação de Pedidos**  
     No menu inicial, clique no botão **Cadastrar Pedido**. Insira um **CPF cadastrado** e um **produto cadastrado**, defina a **quantidade** e clique em **"Adicionar Produto ao Pedido"**. Após adicionar os produtos desejados, clique em **"Finalizar Pedido"**. Caso necessário, é possível remover um produto do pedido clicando em **"Remover"** ao lado do item desejado.
   
   - **Exibição das Vendas**  
     No menu inicial, clique no botão **Vendas Realizadas**. A lista de vendas será exibida automaticamente com base nos dados armazenados no **localStorage**.

   - **Lista de Clientes**  
     No menu inicial, clique no botão **Lista de Clientes**. A lista de clientes será exibida automaticamente com base nos dados armazenados no **localStorage**.

   - **Lista de Produtos**  
     No menu inicial, clique no botão **Lista de Produtos**. A lista de produtos será exibida automaticamente com base nos dados armazenados no **localStorage**.

   - Em todas as páginas, é possível retornar ao menu inicial clicando no botão **Voltar**.

## Armazenamento de Dados

Os dados de **clientes, produtos e pedidos** são armazenados no **localStorage** do navegador.


Para **resetar os dados**, basta limpar o cache do navegador.

## Tecnologias Utilizadas

- **HTML**: Estrutura da aplicação
- **CSS**: Estilização da interface
- **JavaScript**: Lógica do sistema e manipulação de dados no localStorage
- **localStorage**: O localStorage é uma funcionalidade do HTML5 que permite armazenar dados no navegador de forma persistente, sem necessidade de conexão com um servidor. Os dados armazenados permanecem disponíveis mesmo após o fechamento do navegador, até que sejam removidos manualmente ou por meio do código.


## Considerações

Decisões de projeto:

- Foi estipulado que cada ID de produto deve ter 9 digitos numéricos. 
- O nome do cliente não deve ter números

