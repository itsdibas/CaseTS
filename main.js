let clientes = JSON.parse(localStorage.getItem('clientes')) || [];
let produtos = JSON.parse(localStorage.getItem('produtos')) || [];
let vendas = JSON.parse(localStorage.getItem('vendas')) || [];
let pedidoAtual = { cliente: null, itens: [] };

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

function salvarDados() {
    localStorage.setItem('clientes', JSON.stringify(clientes));
    localStorage.setItem('produtos', JSON.stringify(produtos));
    localStorage.setItem('vendas', JSON.stringify(vendas));
}

function carregarDados() {
    clientes = JSON.parse(localStorage.getItem('clientes')) || [];
    produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    vendas = JSON.parse(localStorage.getItem('vendas')) || [];
    atualizarVendas();
}

function exibirMensagem(mensagem, tipo) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = mensagem;
    messageDiv.className = `message ${tipo}`;
    messageDiv.style.display = 'block';
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 3000);
}

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

function removerPontuacaoCPF(cpf) {
    return cpf.replace(/\D/g, '');
}

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

function atualizarListaClientes() {
    let clientesDiv = document.getElementById('clientesLista');
    clientesDiv.innerHTML = '';
    clientes.forEach(cliente => {
        clientesDiv.innerHTML += `<p>CPF: ${cliente.id}, Nome: ${cliente.nome}</p>`;
    });
}

function atualizarListaProdutos() {
    let produtosDiv = document.getElementById('produtosLista');
    produtosDiv.innerHTML = '';
    produtos.forEach(produto => {
        produtosDiv.innerHTML += `<p>ID: ${produto.id}, Nome: ${produto.nome}, Preço: R$ ${produto.preco}</p>`;
    });
}

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

function removerProdutoPedido(produtoId) {
    pedidoAtual.itens = pedidoAtual.itens.filter(item => item.produto.id !== produtoId);
    atualizarProdutosPedido();
}

function atualizarProdutosPedido() {
    let listaProdutosPedido = document.getElementById('listaProdutosPedido');
    listaProdutosPedido.innerHTML = '';

    let totalCompra = 0;

    pedidoAtual.itens.forEach(item => {
        let totalItem = item.produto.preco * item.quantidade;
        totalCompra += totalItem;
        listaProdutosPedido.innerHTML += `
    <li>
        ${item.produto.nome} - Quantidade: ${item.quantidade} - Preço Unitário: R$ ${item.produto.preco} - Total: R$ ${totalItem.toFixed(2)}
        <button 
            onclick="removerProdutoPedido('${item.produto.id}')"
            style="
                background-color: red;
                color: white;
                border: none;
                padding: 5px 10px;
                cursor: pointer;
                border-radius: 5px;
                margin-left: 10px;
                transition: background-color 0.3s ease;
            "
            onmouseover="this.style.backgroundColor='darkred'"
            onmouseout="this.style.backgroundColor='red'"
        >
            Remover
        </button>
    </li>`;
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
