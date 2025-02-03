/**
 * Inicializa as variáveis globais do sistema.
 * 
 * As variáveis são inicializadas da seguinte forma:
 * 1. `clientes` - Carrega a lista de clientes do localStorage, ou inicializa como um array vazio se não houver dados.
 * 2. `produtos` - Carrega a lista de produtos do localStorage, ou inicializa como um array vazio se não houver dados.
 * 3. `vendas` - Carrega a lista de vendas do localStorage, ou inicializa como um array vazio se não houver dados.
 * 4. `pedidoAtual` - Inicializa um objeto representando o pedido atual, com o cliente definido como `null` e uma lista vazia de itens.
 */
let clientes = JSON.parse(localStorage.getItem('clientes')) || [];
let produtos = JSON.parse(localStorage.getItem('produtos')) || [];
let vendas = JSON.parse(localStorage.getItem('vendas')) || [];
let pedidoAtual = { cliente: null, itens: [] };


/**
 * Mostra a página especificada pelo ID e oculta todas as outras.
 * 
 * @param {string} pageId - O ID da página a ser exibida.
 * 1. Seleciona todos os elementos com a classe 'container' e adiciona a classe 'hidden' para ocultá-los.
 * 2. Remove a classe 'hidden' do elemento com o ID especificado por `pageId` para exibi-lo.
 * 3. Chama funções específicas para atualizar o conteúdo das páginas 'listaClientes', 'listaProdutos' e 'vendas', se `pageId` corresponder a esses IDs.
 * 4. Verifica se existe um elemento com o ID 'valorTotalCompra' e ajusta sua visibilidade:
 *    - Se `pageId` não for 'paginaPedidos', oculta o elemento.
 *    - Se `pageId` for 'paginaPedidos', exibe o elemento.
 */
function showPage(pageId) {
    document.querySelectorAll('.container').forEach(page => {
        page.classList.add('hidden');
    });
    document.getElementById(pageId).classList.remove('hidden');
    if (pageId === 'listaClientes') atualizarListaClientes();
    if (pageId === 'listaProdutos') atualizarListaProdutos();
    if (pageId === 'vendas') atualizarVendas();

    let valorTotalElement = document.getElementById('valorTotalCompra');
    if (valorTotalElement) {
        if (pageId !== 'paginaPedidos') {
            valorTotalElement.style.display = 'none';
        } else {
            valorTotalElement.style.display = 'block';
        }
    }
}

/**
 * Salva os dados dos clientes, produtos e vendas no localStorage.
 * 1. Converte o objeto `clientes` em uma string JSON e armazena no localStorage com a chave 'clientes'.
 * 2. Converte o objeto `produtos` em uma string JSON e armazena no localStorage com a chave 'produtos'.
 * 3. Converte o objeto `vendas` em uma string JSON e armazena no localStorage com a chave 'vendas'.
 */
function salvarDados() {
    localStorage.setItem('clientes', JSON.stringify(clientes));
    localStorage.setItem('produtos', JSON.stringify(produtos));
    localStorage.setItem('vendas', JSON.stringify(vendas));
}


/**
 * Carrega os dados dos clientes, produtos e vendas do localStorage.
 * 1. Recupera a string JSON armazenada no localStorage com a chave 'clientes', converte para um objeto e atribui à variável `clientes`. Se não houver dados, atribui um array vazio.
 * 2. Recupera a string JSON armazenada no localStorage com a chave 'produtos', converte para um objeto e atribui à variável `produtos`. Se não houver dados, atribui um array vazio.
 * 3. Recupera a string JSON armazenada no localStorage com a chave 'vendas', converte para um objeto e atribui à variável `vendas`. Se não houver dados, atribui um array vazio.
 * 4. Chama a função `atualizarVendas` para atualizar a interface com os dados carregados.
 */
function carregarDados() {
    clientes = JSON.parse(localStorage.getItem('clientes')) || [];
    produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    vendas = JSON.parse(localStorage.getItem('vendas')) || [];
    atualizarVendas();
}


/**
 * Exibe uma mensagem temporária na interface do usuário.
 * 
 * @param {string} mensagem - O texto da mensagem a ser exibida.
 * @param {string} tipo - O tipo da mensagem (por exemplo, 'sucesso', 'erro'), usado para definir a classe CSS.
 * 1. Seleciona o elemento com o ID 'message'.
 * 2. Define o conteúdo de texto do elemento como a mensagem fornecida.
 * 3. Define a classe do elemento como 'message' seguido pelo tipo fornecido.
 * 4. Exibe o elemento definindo seu estilo 'display' como 'block'.
 * 5. Após 3 segundos, oculta o elemento definindo seu estilo 'display' como 'none'.
 */
function exibirMensagem(mensagem, tipo) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = mensagem;
    messageDiv.className = `message ${tipo}`;
    messageDiv.style.display = 'block';
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 3000);
}


/**
 * Valida um número de CPF (Cadastro de Pessoas Físicas) brasileiro.
 * 
 * @param {string} cpf - O número de CPF a ser validado.
 * @returns {boolean} - Retorna `true` se o CPF for válido, caso contrário, retorna `false`.
 * 1. Remove todos os caracteres não numéricos do CPF.
 * 2. Verifica se o CPF tem 11 dígitos e se todos os dígitos não são iguais. Se não, retorna `false`.
 * 3. Calcula o primeiro dígito verificador e verifica se é válido.
 * 4. Calcula o segundo dígito verificador e verifica se é válido.
 * 5. Retorna `true` se ambos os dígitos verificadores forem válidos, caso contrário, retorna `false`.
 */
function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
        return false;
    }
    let soma = 0;
    let resto;

    for (let i = 1; i <= 9; i++) {
        soma += parseInt(cpf[i - 1]) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf[9])) {
        return false;
    }
    soma = 0;

    for (let i = 1; i <= 10; i++) {
        soma += parseInt(cpf[i - 1]) * (12 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf[10])) {
        return false;
    }
    return true;
}

/**
 * Remove a pontuação de um número de CPF (Cadastro de Pessoas Físicas) brasileiro.
 * 
 * @param {string} cpf - O número de CPF com pontuação.
 * @returns {string} - O número de CPF sem pontuação.
 * 1. Remove todos os caracteres não numéricos do CPF usando uma expressão regular.
 * 2. Retorna o CPF sem pontuação.
 */
function removerPontuacaoCPF(cpf) {
    return cpf.replace(/\D/g, '');
}

/**
 * Cadastra um novo cliente.
 * 1. Remove a pontuação do CPF fornecido no campo de entrada 'clienteId'.
 * 2. Obtém o nome do cliente do campo de entrada 'clienteNome'.
 * 3. Verifica se ambos os campos (CPF e nome) estão preenchidos. Se não, exibe uma mensagem de erro e retorna.
 * 4. Valida o CPF. Se for inválido, exibe uma mensagem de erro e retorna.
 * 5. Verifica se o CPF já está cadastrado. Se estiver, exibe uma mensagem de erro e retorna.
 * 6. Adiciona o novo cliente à lista de clientes.
 * 7. Salva os dados atualizados no localStorage.
 * 8. Exibe uma mensagem de sucesso.
 * 9. Limpa os campos de entrada 'clienteId' e 'clienteNome'.
 */
function cadastrarCliente() {
    let id = removerPontuacaoCPF(document.getElementById('clienteId').value);
    let nome = document.getElementById('clienteNome').value;

    if (!id || !nome) {
        exibirMensagem('Preencha todos os campos!', 'error');
        return;
    }

    if (!validarCPF(id)) {
        exibirMensagem('CPF inválido!', 'error');
        return;
    }

    if (clientes.some(cliente => cliente.id === id)) {
        exibirMensagem('Este CPF já está cadastrado!', 'error');
        return;
    }

    clientes.push({ id, nome });
    salvarDados();
    exibirMensagem('Cliente cadastrado!', 'success');
    document.getElementById('clienteId').value = '';
    document.getElementById('clienteNome').value = '';
}


/**
 * Cadastra um novo produto.
 * 1. Obtém o ID, nome e preço do produto dos campos de entrada correspondentes.
 * 2. Verifica se todos os campos (ID, nome e preço) estão preenchidos. Se não, exibe uma mensagem de erro e retorna.
 * 3. Verifica se o ID do produto tem exatamente 9 dígitos numéricos. Se não, exibe uma mensagem de erro e retorna.
 * 4. Verifica se o ID do produto já está cadastrado. Se estiver, exibe uma mensagem de erro e retorna.
 * 5. Verifica se o preço do produto é um valor positivo. Se não, exibe uma mensagem de erro e retorna.
 * 6. Adiciona o novo produto à lista de produtos.
 * 7. Salva os dados atualizados no localStorage.
 * 8. Exibe uma mensagem de sucesso.
 * 9. Limpa os campos de entrada 'produtoId', 'produtoNome' e 'produtoPreco'.
 */
function cadastrarProduto() {
    let id = document.getElementById('produtoId').value;
    let nome = document.getElementById('produtoNome').value;
    let preco = document.getElementById('produtoPreco').value;

    if (!id || !nome || !preco) {
        exibirMensagem('Preencha todos os campos!', 'error');
        return;
    }

    if (id.length !== 9 || !/^\d{9}$/.test(id)) {
        exibirMensagem('O ID do produto deve ter exatamente 9 dígitos numéricos!', 'error');
        return;
    }

    if (produtos.some(produto => produto.id === id)) {
        exibirMensagem('Este ID de produto já está cadastrado!', 'error');
        return;
    }

    if (preco <= 0) {
        exibirMensagem('O preço do produto deve ser um valor positivo!', 'error');
        return;
    }

    produtos.push({ id, nome, preco });
    salvarDados();
    exibirMensagem('Produto cadastrado com sucesso!', 'success');
    document.getElementById('produtoId').value = '';
    document.getElementById('produtoNome').value = '';
    document.getElementById('produtoPreco').value = '';
}


/**
 * Atualiza a lista de clientes exibida na interface do usuário.
 * 1. Seleciona o elemento com o ID 'clientesLista'.
 * 2. Limpa o conteúdo atual do elemento.
 * 3. Itera sobre a lista de clientes e adiciona um parágrafo para cada cliente, exibindo o CPF e o nome.
 */
function atualizarListaClientes() {
    let clientesDiv = document.getElementById('clientesLista');
    clientesDiv.innerHTML = '';
    clientes.forEach(cliente => {
        clientesDiv.innerHTML += `<p>CPF: ${cliente.id}, Nome: ${cliente.nome}</p>`;
    });
}


/**
 * Atualiza a lista de produtos exibida na interface do usuário.
 * 1. Seleciona o elemento com o ID 'produtosLista'.
 * 2. Limpa o conteúdo atual do elemento.
 * 3. Itera sobre a lista de produtos e adiciona um parágrafo para cada produto, exibindo o ID, nome e preço.
 */
function atualizarListaProdutos() {
    let produtosDiv = document.getElementById('produtosLista');
    produtosDiv.innerHTML = '';
    produtos.forEach(produto => {
        produtosDiv.innerHTML += `<p>ID: ${produto.id}, Nome: ${produto.nome}, Preço: R$ ${produto.preco}</p>`;
    });
}


/**
 * Atualiza a lista de vendas exibida na interface do usuário.
 * 1. Seleciona o elemento com o ID 'vendasLista'.
 * 2. Limpa o conteúdo atual do elemento.
 * 3. Verifica se há vendas registradas:
 *    - Se não houver, exibe uma mensagem indicando que nenhuma venda foi realizada.
 *    - Se houver, itera sobre a lista de vendas e adiciona um bloco de informações para cada venda, incluindo:
 *      - Data da venda.
 *      - Nome e CPF do cliente.
 *      - Lista de itens vendidos, com nome do produto, quantidade, preço unitário e total por item.
 *      - Valor total da compra.
 */
function atualizarVendas() {
    let vendasDiv = document.getElementById('vendasLista');
    vendasDiv.innerHTML = '';

    if (vendas.length === 0) {
        vendasDiv.innerHTML = '<p>Nenhuma venda realizada.</p>';
    } else {
        vendas.forEach(venda => {
            let vendaInfo = `<div class="venda-item">`;
            vendaInfo += `<h4>Venda realizada em: ${venda.data}</h4>`;
            vendaInfo += `<p>Cliente: ${venda.cliente.nome} (CPF: ${venda.cliente.id})</p>`;
            vendaInfo += '<ul>';

            let totalCompra = 0;
            venda.itens.forEach(item => {
                let precoItem = item.produto.preco * item.quantidade;
                totalCompra += precoItem;
                vendaInfo += `<li>Produto: ${item.produto.nome}, Quantidade: ${item.quantidade}, Preço Unitário: R$ ${item.produto.preco}, Total: R$ ${precoItem.toFixed(2)}</li>`;
            });

            vendaInfo += `</ul><h4>Valor Total da Compra: R$ ${totalCompra.toFixed(2)}</h4>`;
            vendaInfo += `</div>`;
            vendasDiv.innerHTML += vendaInfo;
        });
    }
}

/**
 * Adiciona um produto ao pedido atual.
 * 1. Obtém o ID do cliente, o ID do produto e a quantidade dos campos de entrada correspondentes.
 * 2. Verifica se todos os campos (clienteId, produtoId e quantidade) estão preenchidos. Se não, exibe uma mensagem de erro e retorna.
 * 3. Verifica se a quantidade é um número positivo. Se não, exibe uma mensagem de erro e retorna.
 * 4. Verifica se o cliente existe na lista de clientes. Se não, exibe uma mensagem de erro e retorna.
 * 5. Verifica se o produto existe na lista de produtos. Se não, exibe uma mensagem de erro e retorna.
 * 6. Verifica se o pedido atual já contém produtos de outro cliente. Se sim, pergunta ao usuário se deseja reiniciar o pedido.
 * 7. Se o pedido atual não tiver um cliente, define o cliente do pedido atual.
 * 8. Verifica se o produto já está no pedido atual. Se estiver, incrementa a quantidade. Se não, adiciona o produto ao pedido.
 * 9. Atualiza a lista de produtos no pedido chamando a função `atualizarProdutosPedido`.
 */
function adicionarProdutoPedido() {
    let clienteId = removerPontuacaoCPF(document.getElementById('pedidoClienteId').value);
    let produtoId = document.getElementById('pedidoProdutoId').value;
    let quantidade = parseInt(document.getElementById('pedidoQuantidade').value);

    if (!clienteId || !produtoId || !quantidade) {
        exibirMensagem('Preencha todos os campos!', 'error');
        return;
    }

    if (!clienteId || !produtoId || !quantidade || quantidade <= 0) {
        exibirMensagem('A quantidade deve ser um número positivo!', 'error');
        return;
    }

    let cliente = clientes.find(c => c.id === clienteId);
    if (!cliente) {
        exibirMensagem('Cliente não encontrado', 'error');
        return;
    }

    let produto = produtos.find(p => p.id === produtoId);
    if (!produto) {
        exibirMensagem('Produto não encontrado', 'error');
        return;
    }

    if (pedidoAtual.cliente && pedidoAtual.cliente.id !== cliente.id) {
        let continuar = confirm(`Este pedido já contém produtos de outro cliente (${pedidoAtual.cliente.nome}). Deseja reiniciar o pedido?`);
        if (continuar) {
            pedidoAtual = { cliente, itens: [] };
        } else {
            return;
        }
    }

    if (!pedidoAtual.cliente) {
        pedidoAtual.cliente = cliente;
    }

    let itemExistente = pedidoAtual.itens.find(item => item.produto.id === produtoId);
    if (itemExistente) {
        itemExistente.quantidade += quantidade;
    } else {
        pedidoAtual.itens.push({ produto, quantidade });
    }

    atualizarProdutosPedido();
}


/**
 * Remove um produto do pedido atual.
 * 
 * @param {string} produtoId - O ID do produto a ser removido do pedido.
 * 1. Filtra a lista de itens do pedido atual, removendo o item cujo ID do produto corresponde ao `produtoId` fornecido.
 * 2. Atualiza a lista de produtos no pedido chamando a função `atualizarProdutosPedido`.
 */
function removerProdutoPedido(produtoId) {
    pedidoAtual.itens = pedidoAtual.itens.filter(item => item.produto.id !== produtoId);
    atualizarProdutosPedido();
}


/**
 * Atualiza a lista de produtos no pedido atual exibida na interface do usuário.
 * 1. Seleciona o elemento com o ID 'listaProdutosPedido'.
 * 2. Limpa o conteúdo atual do elemento.
 * 3. Inicializa a variável `totalCompra` para calcular o valor total da compra.
 * 4. Itera sobre os itens do pedido atual, calculando o total por item e o valor total da compra.
 * 5. Adiciona um item à lista de produtos no pedido, exibindo o nome do produto, quantidade, preço unitário e total por item.
 * 6. Adiciona um botão "Remover" para cada item, permitindo a remoção do produto do pedido.
 * 7. Seleciona ou cria o elemento com o ID 'valorTotalCompra' para exibir o valor total da compra.
 * 8. Define o conteúdo do elemento 'valorTotalCompra' com o valor total da compra e o exibe.
 */
function atualizarProdutosPedido() {
    let listaProdutosPedido = document.getElementById('listaProdutosPedido');
    listaProdutosPedido.innerHTML = '';

    let totalCompra = 0;

    pedidoAtual.itens.forEach(item => {
        let totalItem = item.produto.preco * item.quantidade;
        totalCompra += totalItem;
        listaProdutosPedido.innerHTML += `
<li         
    style="
        display: flex;
        justify-content: space-between;
        align-items: center;
    ">

    <span>
        ${item.produto.nome} - Quantidade: ${item.quantidade} - Preço Unitário: R$ ${item.produto.preco} - Total: R$ ${totalItem.toFixed(2)}
    </span>

    <span style="display: flex; justify-content: flex-end;">
        <button 
            onclick="removerProdutoPedido('${item.produto.id}')"
            style="
                background-color: red;
                color: white;
                border: none;
                padding: 5px 10px;
                cursor: pointer;
                border-radius: 5px;
                transition: background-color 0.3s ease;
            "
            onmouseover="this.style.backgroundColor='darkred'"
            onmouseout="this.style.backgroundColor='red'"
        >
            Remover
        </button>
    </span>
</li>
`;
    });

    let valorTotalElement = document.getElementById('valorTotalCompra');
    if (!valorTotalElement) {
        valorTotalElement = document.createElement('div');
        valorTotalElement.id = 'valorTotalCompra';
        valorTotalElement.className = 'valor-total-compra';
        document.body.appendChild(valorTotalElement);
    }
    valorTotalElement.innerHTML = `Valor Total da Compra: R$ ${totalCompra.toFixed(2)}`;
    valorTotalElement.style.display = 'block';
}


/**
 * Finaliza o pedido atual e registra a venda.
 * 1. Verifica se um cliente foi selecionado para o pedido. Se não, exibe uma mensagem de erro e retorna.
 * 2. Verifica se há itens no pedido. Se não, exibe uma mensagem de erro e retorna.
 * 3. Adiciona o pedido atual à lista de vendas, incluindo a data, cliente e itens do pedido.
 * 4. Salva os dados atualizados no localStorage.
 * 5. Exibe uma mensagem de sucesso indicando que o pedido foi finalizado e registrado.
 * 6. Reseta o pedido atual, removendo o cliente e itens.
 * 7. Atualiza a lista de produtos no pedido chamando a função `atualizarProdutosPedido`.
 * 8. Limpa e oculta o elemento que exibe o valor total da compra.
 */
function finalizarPedido() {
    if (!pedidoAtual.cliente) {
        exibirMensagem('Selecione um cliente antes de finalizar o pedido.', 'error');
        return;
    }

    if (pedidoAtual.itens.length === 0) {
        exibirMensagem('Adicione pelo menos um item ao pedido antes de finalizar.', 'error');
        return;
    }

    vendas.push({
        data: new Date().toLocaleString(),
        cliente: pedidoAtual.cliente,
        itens: pedidoAtual.itens
    });
    salvarDados();
    exibirMensagem('Pedido finalizado e registrado!', 'success');
    pedidoAtual = { cliente: null, itens: [] };
    atualizarProdutosPedido();

    let valorTotalElement = document.getElementById('valorTotalCompra');
    if (valorTotalElement) {
        valorTotalElement.innerHTML = '';
    }
    document.getElementById('valorTotalCompra').style.display = 'none';
}
