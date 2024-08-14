let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

function adicionarAoCarrinho(nome, preco, imagem) {
    const itemExistente = carrinho.find(item => item.nome === nome);
    if (itemExistente) {
        itemExistente.quantidade += 1;
    } else {
        carrinho.push({ nome, preco, imagem, quantidade: 1 });
    }
    atualizarCarrinho();
}
function removerDoCarrinho(nome) {
    carrinho = carrinho.filter(item => item.nome !== nome);
    atualizarCarrinho();
}
function atualizarCarrinho() {
    const itensCarrinho = document.getElementById('itensCarrinho');
    itensCarrinho.innerHTML = '';
    let subtotal = 0;

    carrinho.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('item-carrinho');
        itemDiv.innerHTML = `
            <span>${item.nome}</span>
            <span>Quantidade: ${item.quantidade}</span>
            <span>Preço: R$${(item.preco * item.quantidade).toFixed(2)}</span>
            <button onclick="removerDoCarrinho('${item.nome}')">Remover</button>
        `;
        itensCarrinho.appendChild(itemDiv);
        subtotal += item.preco * item.quantidade;
    });

    const subtotalElement = document.getElementById('subtotal');
    subtotalElement.innerText = `Subtotal: R$${subtotal.toFixed(2)}`;

    const total = calcularTotal(subtotal);
    const totalElement = document.getElementById('total');
    totalElement.innerText = `Total: R$${total.toFixed(2)}`;
}

function calcularTotal(subtotal) {
    const imposto = 0.1 * subtotal; 
    const frete = 0; 
    const total = subtotal + imposto + frete;
    return total;
}

function finalizarCompra() {
    salvarCarrinho();
    enviarCarrinhoParaAPI(carrinho)
        .then(() => {
            window.location.href = 'page_compras.html';
        })
        .catch(error => {
            console.error('Erro ao finalizar a compra:', error);
        });
}

function salvarCarrinho() {
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
}

async function enviarCarrinhoParaAPI(carrinho) {
    try {
        const response = await fetch('API_carrinho', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(carrinho)
        });

        if (!response.ok) {
            throw new Error(`Erro na API: ${response.statusText}`);
        }

        const result = await response.json();
        console.log('Carrinho salvo com sucesso:', result);
    } catch (error) {
        console.error('Erro ao enviar o carrinho para a API:', error);
    }
}
document.addEventListener('DOMContentLoaded', atualizarCarrinho);
