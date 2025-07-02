const products = {
  tigela300: { name: 'Tigela de 300ml', price: 15, complements: 4 },
  tigela400: { name: 'Tigela de 400ml', price: 19, complements: 4 },
  tigela700: { name: 'Tigela de 700ml', price: 35, complements: 7 },
  copo250: { name: 'Copo de 250ml', price: 12, complements: 4 },
  copo300: { name: 'Copo de 300ml', price: 14, complements: 4 },
  copo400: { name: 'Copo de 400ml', price: 18, complements: 4 },
  barcaP: { name: 'Barca Pequena', price: 35, complements: 0 },
  barcaG: { name: 'Barca Grande', price: 65, complements: 0 }
};

const complements = {
  leite_po: { name: 'Leite em pó', price: 0, category: 'gratis' },
  castanha: { name: 'Castanha', price: 0, category: 'gratis' },
  amendoim: { name: 'Amendoim', price: 0, category: 'gratis' },
  granola: { name: 'Granola', price: 0, category: 'gratis' },
  sucrilhos: { name: 'Sucrilhos', price: 0, category: 'gratis' },
  tapioca: { name: 'Tapioca', price: 0, category: 'gratis' },
  pacoca: { name: 'Paçoca', price: 0, category: 'gratis' },
  cereja: { name: 'Cereja', price: 0, category: 'gratis' },
  choco_power: { name: 'Choco Power', price: 0, category: 'gratis' },
  flocos_arroz: { name: 'Flocos de arroz', price: 0, category: 'gratis' },
  marshmallow: { name: 'Marshmallow', price: 0, category: 'gratis' },
  jujuba: { name: 'Jujuba', price: 0, category: 'gratis' },
  mm: { name: 'M&M', price: 0, category: 'gratis' },
  bolacha: { name: 'Bolacha', price: 0, category: 'gratis' },
  bolacha_trit: { name: 'Bolacha (triturado)', price: 0, category: 'gratis' },
  bolacha_triunfo: { name: 'Bolacha (Triunfo)', price: 0, category: 'gratis' },
  chocolate_trit: { name: 'Chocolate (triturado)', price: 0, category: 'gratis' },
  granulado: { name: 'Granulado', price: 0, category: 'gratis' },
  banana: { name: 'Banana', price: 0, category: 'gratis' },
  uva: { name: 'Uva', price: 0, category: 'gratis' },
  cob_chocolate: { name: 'Chocolate', price: 0, category: 'cobertura' },
  cob_morango: { name: 'Morango', price: 0, category: 'cobertura' },
  cob_caramelo: { name: 'Caramelo', price: 0, category: 'cobertura' },
  cob_uva: { name: 'Uva', price: 0, category: 'cobertura' },
  cob_abacaxi: { name: 'Abacaxi', price: 0, category: 'cobertura' },
  leite_condensado: { name: 'Leite condensado', price: 0, category: 'cobertura' },
  cob_kiwi: { name: 'Kiwi', price: 0, category: 'cobertura' },
  nutella: { name: 'Nutella', price: 2, category: 'adicional' },
  doce_leite: { name: 'Doce de leite', price: 2, category: 'adicional' },
  kiwi: { name: 'Kiwi', price: 2, category: 'adicional' },
  creme_ninho: { name: 'Ninho', price: 2, category: 'creme' },
  creme_bacuri: { name: 'Bacuri', price: 2, category: 'creme' },
  creme_maracuja: { name: 'Maracujá', price: 2, category: 'creme' }
};

let selectedProduct = null;
let selectedComplements = new Set();
const cart = [];
let complementsScrollListener = null;

// --- FUNÇÕES GERAIS PARA MODAIS ---
function toggleModal(modalId, show) {
    const modalOverlay = document.getElementById(modalId);
    if (modalOverlay) {
        if (show) {
            modalOverlay.classList.add('is-visible');
            document.body.classList.add('modal-open'); // Usa classe
        } else {
            modalOverlay.classList.remove('is-visible');
            document.body.classList.remove('modal-open'); // Usa classe
        }
    }
}

// --- FUNÇÕES DO MODAL DO CARRINHO ---
function openCartModal() {
    toggleModal('cart-modal-overlay', true);
    renderModalCart();
}

function closeCartModal() {
    toggleModal('cart-modal-overlay', false);
}

// --- FUNÇÕES DO MODAL DE COMPLEMENTOS ---
function checkComplementsScrollPosition() {
    const scrollArea = document.querySelector('.complements-scroll-area');
    const actionButtons = document.querySelector('.complement-modal-actions');
    if (!scrollArea || !actionButtons) return;

    if (scrollArea.scrollHeight <= scrollArea.clientHeight) {
        actionButtons.classList.add('is-scrolled-to-bottom');
        return;
    }
    const scrolledToBottom = (scrollArea.scrollTop + scrollArea.clientHeight >= scrollArea.scrollHeight - 5);
    if (scrolledToBottom) {
        actionButtons.classList.add('is-scrolled-to-bottom');
    } else {
        actionButtons.classList.remove('is-scrolled-to-bottom');
    }
}

function setupComplementsModalScrollListener() {
    const scrollArea = document.querySelector('.complements-scroll-area');
    if (scrollArea) {
        if (complementsScrollListener) {
            scrollArea.removeEventListener('scroll', complementsScrollListener);
        }
        complementsScrollListener = checkComplementsScrollPosition;
        scrollArea.addEventListener('scroll', complementsScrollListener);
        checkComplementsScrollPosition();
    }
}

function cleanupComplementsModalScrollListener() {
    const scrollArea = document.querySelector('.complements-scroll-area');
    const actionButtons = document.querySelector('.complement-modal-actions');
    if (scrollArea && complementsScrollListener) {
        scrollArea.removeEventListener('scroll', complementsScrollListener);
        complementsScrollListener = null;
    }
    if (actionButtons) {
        actionButtons.classList.remove('is-scrolled-to-bottom');
    }
}

function openComplementsModal() {
    toggleModal('complements-modal-overlay', true);
    const product = products[selectedProduct];
    if (product && product.complements > 0) {
        document.getElementById('complement-limit-info-modal').innerText = `Escolha até ${product.complements} complementos grátis`;
    } else {
        document.getElementById('complement-limit-info-modal').innerText = `Sem complementos grátis para este item.`;
    }
    setTimeout(setupComplementsModalScrollListener, 100);
}

function closeComplementsModal() {
    toggleModal('complements-modal-overlay', false);
    cleanupComplementsModalScrollListener();
}

// --- LÓGICA DE SELEÇÃO E ADIÇÃO ---
function selectProduct(productId) {
    const product = products[productId];
    if (!product) {
        console.error("Produto não encontrado:", productId);
        return;
    }
    if (product.complements > 0) {
        selectedProduct = productId;
        selectedComplements.clear();
        document.querySelectorAll('input[data-complement-id]').forEach(input => input.checked = false);
        openComplementsModal();
    } else {
        cart.push({ productId: productId, complements: [] });
        updateTotal();
        updateCartCount();
        renderCart();
        openCartModal();
    }
}

function toggleComplement(id, checked) {
    if (!selectedProduct) return;
    const product = products[selectedProduct];
    const comp = complements[id];
    if (checked) {
        if (comp.category === 'gratis') {
            const current = Array.from(selectedComplements).filter(cid => complements[cid].category === 'gratis');
            if (current.length >= product.complements) {
                alert(`Só pode escolher até ${product.complements} complementos grátis.`);
                document.getElementById(id).checked = false;
                return;
            }
        }
        if (comp.category === 'cobertura') {
            const has = Array.from(selectedComplements).some(cid => complements[cid].category === 'cobertura');
            if (has) {
                alert('Você só pode escolher uma cobertura.');
                document.getElementById(id).checked = false;
                return;
            }
        }
        selectedComplements.add(id);
    } else {
        selectedComplements.delete(id);
    }
    updateTotal();
}

function confirmComplementsAndAddToCart() {
    if (!selectedProduct) {
        alert('Nenhum produto selecionado para adicionar!');
        return;
    }
    cart.push({ productId: selectedProduct, complements: Array.from(selectedComplements) });
    selectedProduct = null;
    selectedComplements.clear();
    document.querySelectorAll('input[data-complement-id]').forEach(input => input.checked = false);
    updateTotal();
    updateCartCount();
    renderCart();
    closeComplementsModal();
    openCartModal();
}

function cancelComplementsSelection() {
    selectedProduct = null;
    selectedComplements.clear();
    document.querySelectorAll('input[data-complement-id]').forEach(input => input.checked = false);
    document.querySelectorAll('.select-btn.selected').forEach(btn => btn.classList.remove('selected'));
    closeComplementsModal();
    updateTotal();
}

// --- FUNÇÕES DE RENDERIZAÇÃO E ATUALIZAÇÃO DE TOTAIS ---
function updateCartCount() {
    const cartCountEl = document.getElementById('cart-count');
    if (cartCountEl) {
        cartCountEl.innerText = cart.length;
        cartCountEl.style.display = cart.length > 0 ? 'flex' : 'none';
    }
}

function updateModalTotal() {
    const modalTotalEl = document.getElementById('modal-total-price');
    if (!modalTotalEl) return;
    let total = 0;
    cart.forEach(item => {
        total += products[item.productId].price;
        item.complements.forEach(id => {
            if (complements[id]) {
                total += complements[id].price;
            }
        });
    });
    modalTotalEl.textContent = `R$ ${total.toFixed(2)}`;
}

function renderCart() {
    document.getElementById("confirm-all-btn").disabled = cart.length === 0;
}

function renderModalCart() {
    const list = document.getElementById('cart-modal-list');
    if (!list) return;
    list.innerHTML = "";
    if (cart.length === 0) {
        const li = document.createElement('li');
        li.textContent = "Seu carrinho está vazio.";
        li.style.textAlign = "center";
        li.style.fontStyle = "italic";
        li.style.color = "#888";
        li.style.borderBottom = "none";
        list.appendChild(li);
    } else {
        cart.forEach((item) => {
            const product = products[item.productId];
            const complementNames = item.complements.map(id => complements[id]?.name).filter(Boolean).join(", ");
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${product.name}</span>
                <span style="font-weight: bold;">R$ ${product.price.toFixed(2)}</span>
                ${complementNames ? `<small style="flex-basis: 100%;">${complementNames}</small>` : ''}
            `;
            list.appendChild(li);
        });
    }
    updateModalTotal();
}

function updateTotal() {
    let currentTotal = 0;
    cart.forEach(item => {
        currentTotal += products[item.productId].price;
        item.complements.forEach(id => {
            currentTotal += complements[id].price;
        });
    });
    if (selectedProduct) {
        currentTotal += products[selectedProduct].price;
        selectedComplements.forEach(id => {
            currentTotal += complements[id].price;
        });
    }
    if (document.getElementById('delivery-checkbox').checked) {
        currentTotal += 2;
    }
    const method = document.querySelector('input[name="payment"]:checked')?.value;
    if (method === 'cartao') {
        currentTotal += 1;
    }
    document.getElementById('total-price').textContent = `R$ ${currentTotal.toFixed(2)}`;
}

// --- FUNÇÕES DE ENTREGA E PAGAMENTO ---
function handleDeliveryChange(el) {
    const pickupCheckbox = document.getElementById('pickup-checkbox');
    let addressSection = document.getElementById('delivery-address-section');
    if (el.checked) {
        pickupCheckbox.checked = false;
        if (!addressSection) {
            const deliverySection = document.querySelector('.delivery-section');
            const newAddressSection = document.createElement('div');
            newAddressSection.id = 'delivery-address-section';
            newAddressSection.innerHTML = `
                <h3>Local de Entrega</h3>
                <input type="text" id="delivery-address" placeholder="Rua, número, bairro, complemento..." />
            `;
            deliverySection.parentNode.insertBefore(newAddressSection, deliverySection.nextSibling);
        } else {
            addressSection.style.display = 'block';
        }
    } else {
        if (addressSection) {
            addressSection.style.display = 'none';
        }
    }
    updateTotal();
}

function handlePickupChange(el) {
    if (el.checked) {
        document.getElementById('delivery-checkbox').checked = false;
        const addressSection = document.getElementById('delivery-address-section');
        if (addressSection) {
            addressSection.style.display = 'none';
        }
    }
    updateTotal();
}

function selectPaymentMethod(method) {
    document.querySelectorAll('.payment-card').forEach(el => {
        el.classList.toggle('selected', el.dataset.method === method);
    });
    document.querySelectorAll('input[name="payment"]').forEach(input => {
        input.checked = input.value === method;
    });
    document.getElementById("troco-section").style.display = method === "especie" ? "block" : "none";
    updateTotal();
}

// --- [NOVO] FUNÇÕES DE VALIDAÇÃO E DESTAQUE ---
function highlightField(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        closeCartModal(); // Fecha o modal para mostrar o campo na página
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.classList.add('highlight-error');
        setTimeout(() => {
            element.classList.remove('highlight-error');
        }, 2500); // Remove o destaque após 2.5 segundos
    }
}

function validateOrder() {
    if (cart.length === 0) {
        alert("Seu carrinho está vazio!");
        return false;
    }
    if (!document.getElementById('customer-name').value.trim()) {
        highlightField('customer-name');
        return false;
    }
    const isDelivery = document.getElementById('delivery-checkbox').checked;
    const isPickup = document.getElementById('pickup-checkbox').checked;
    if (!isDelivery && !isPickup) {
        highlightField('delivery-section');
        return false;
    }
    if (isDelivery && !document.getElementById('delivery-address')?.value.trim()) {
        highlightField('delivery-address-section');
        return false;
    }
    if (!document.querySelector('input[name="payment"]:checked')) {
        highlightField('payment-section');
        return false;
    }
    return true; // Se tudo estiver OK
}

// --- [ATUALIZADO] FUNÇÃO FINAL DE CONFIRMAÇÃO ---
// =======================================================
// SUBSTITUA SUA FUNÇÃO ANTIGA POR ESTAS TRÊS NOVAS FUNÇÕES
// =======================================================

/**
 * 1. A FUNÇÃO PRINCIPAL (ROTEADOR)
 * Esta função é chamada quando o usuário clica em "Enviar Pedido".
 * Ela valida o pedido e decide qual ação tomar.
 */
function confirmAllOrders() {
    // Primeiro, executa a sua validação. Se algo estiver faltando, ela para aqui.
    if (!validateOrder()) {
        return;
    }

    // Pega o método de pagamento que foi selecionado na tela.
    const selectedPaymentCard = document.querySelector('.payment-card.selected');

    // Medida de segurança para evitar erros.
    if (!selectedPaymentCard) {
        alert("Por favor, selecione uma forma de pagamento.");
        return;
    }

    const selectedMethod = selectedPaymentCard.dataset.method;

    // Decide o que fazer:
    if (selectedMethod === 'pix') {
        // Se for Pix, chama a função para gerar o QR Code.
        initiatePixPayment();
    } else {
        // Se for Dinheiro ou Cartão, chama a função para enviar para o WhatsApp.
        sendWhatsAppOrder();
    }
}

/**
 * 2. FUNÇÃO PARA GERAR O PAGAMENTO PIX
 * Esta função é chamada apenas quando o método de pagamento é Pix.
 */
async function initiatePixPayment() {
    const confirmBtn = document.getElementById('confirm-all-btn');
    confirmBtn.disabled = true;
    confirmBtn.textContent = "Gerando QR Code...";

    try {
        const totalPriceSpan = document.getElementById('total-price');
        const precoTexto = totalPriceSpan.textContent;
        const valorNumerico = parseFloat(precoTexto.replace('R$ ', '').replace(',', '.'));

        if (isNaN(valorNumerico) || valorNumerico <= 0) {
            throw new Error("Valor do carrinho inválido.");
        }

        const dadosDoPedido = {
            transaction_amount: valorNumerico,
            description: `Pedido de ${document.getElementById('customer-name').value.trim()}`
        };

        // ATENÇÃO: Verifique se esta é a URL correta do seu servidor no Render.
        const response = await fetch('https://api-pix-mercadopago.onrender.com/create_payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosDoPedido),
        });

        const payment = await response.json();
        if (!response.ok) {
            throw new Error(payment.error || 'Erro ao conectar com o servidor de pagamento.');
        }

        const summarySection = document.querySelector('.summary-section');
        summarySection.innerHTML = `
            <div id="pix-container-final" style="width: 100%; text-align: center;">
                <h4 style="color: #51125e; margin-bottom: 10px;">Escaneie o QR Code para pagar:</h4>
                <img id="qr-code-image" src="data:image/jpeg;base64,${payment.qr_code_base64}" alt="QR Code Pix" style="max-width: 250px; margin: 10px auto; display: block; border: 1px solid #ddd; padding: 4px; border-radius: 8px;">
                <p style="font-size: 0.9em; margin: 10px 0 5px 0;">Ou copie o código abaixo:</p>
                <input type="text" id="qr-code-text-final" value="${payment.qr_code_text}" readonly style="width: 100%; max-width: 400px; padding: 10px; text-align: center; font-size: 0.9em; margin: 0 auto 10px auto; border: 1px solid #ccc; border-radius: 5px; display: block;">
                <button id="copy-btn-final" class="select-btn" style="max-width: 400px; margin: 0 auto;">Copiar Código</button>
            </div>
        `;
        document.getElementById('copy-btn-final').addEventListener('click', () => {
            const qrCodeText = document.getElementById('qr-code-text-final');
            qrCodeText.select();
            document.execCommand('copy');
            alert('Código Pix copiado!');
        });

    } catch (error) {
        console.error("Erro no checkout Pix:", error);
        alert(`Ops! Houve um erro: ${error.message}`);
        confirmBtn.disabled = false;
        confirmBtn.textContent = "Enviar Pedido";
    }
}


/**
 * 3. FUNÇÃO PARA ENVIAR O PEDIDO PELO WHATSAPP
 * Esta é a sua lógica original, agora dentro de uma função separada.
 */
function sendWhatsAppOrder() {
    const nome = document.getElementById('customer-name').value.trim();
    let msg = `Olá! Pedido de *${nome}*:\n\n`;
    let total = 0;

    cart.forEach((item, i) => {
        const prod = products[item.productId];
        msg += `🍧 *Açaí ${i + 1}:* ${prod.name} - R$ ${prod.price.toFixed(2)}\n`;
        total += prod.price;
        const cats = { gratis: [], cobertura: [], adicional: [], creme: [] };
        item.complements.forEach(id => {
            const c = complements[id];
            if (c) {
                cats[c.category]?.push(c.name);
                total += c.price;
            }
        });
        if (cats.gratis.length) msg += `*Complementos:* ${cats.gratis.join(", ")}\n`;
        if (cats.cobertura.length) msg += `*Cobertura:* ${cats.cobertura.join(", ")}\n`;
        if (cats.adicional.length) msg += `*Adicionais Pagos:* ${cats.adicional.join(", ")}\n`;
        if (cats.creme.length) msg += `*Cremes:* ${cats.creme.join(", ")}\n`;
        msg += "\n";
    });

    const isDelivery = document.getElementById('delivery-checkbox').checked;
    if (isDelivery) {
        const deliveryAddress = document.getElementById('delivery-address').value.trim();
        msg += `🏍️ *Taxa de entrega:* R$ 2,00\n`;
        msg += `📍 *Local de entrega:* ${deliveryAddress}\n`;
        total += 2;
    } else {
        msg += `🚶 *Retirada no local*\n`;
    }

    const method = document.querySelector('.payment-card.selected').dataset.method;
    if (method === 'especie') {
        const troco = document.getElementById('troco-value').value;
        msg += `💵 *Pagamento:* Dinheiro`;
        if (troco) msg += ` (troco para R$ ${parseFloat(troco).toFixed(2)})`;
        msg += `\n`;
    } else if (method === 'cartao') {
        msg += `💳 *Pagamento:* Cartão* (+R$ 1,00)\n`;
        total += 1;
    }

    msg += `\n🧾 *Total Geral:* R$ ${total.toFixed(2)}`;
    const num = "558699127297"; // SEU NÚMERO DE TELEFONE AQUI
    const url = `https://wa.me/${num}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
}

// --- FUNÇÃO LIMPAR TUDO ---
function clearCart() {
    cart.length = 0;
    const addressInput = document.getElementById('delivery-address');
    if (addressInput) addressInput.value = '';
    document.getElementById('delivery-checkbox').checked = false;
    document.getElementById('pickup-checkbox').checked = false;
    const addressSection = document.getElementById('delivery-address-section');
    if (addressSection) addressSection.style.display = 'none';
    document.querySelectorAll('input[name="payment"]').forEach(input => input.checked = false);
    document.querySelectorAll('.payment-card').forEach(card => card.classList.remove('selected'));
    document.getElementById("troco-section").style.display = 'none';
    document.getElementById("troco-value").value = '';
    document.getElementById('customer-name').value = '';
    updateTotal();
    updateCartCount();
    renderCart();
    renderModalCart();
    closeCartModal();
}

// --- INICIALIZAÇÃO AO CARREGAR A PÁGINA ---
document.addEventListener('DOMContentLoaded', () => {
    updateTotal();
    updateCartCount();
    renderCart();
    closeCartModal();
    closeComplementsModal();

    const cartModalOverlay = document.getElementById('cart-modal-overlay');
    if (cartModalOverlay) {
        cartModalOverlay.addEventListener('click', function (event) {
            if (event.target === cartModalOverlay) {
                closeCartModal();
            }
        });
    }
    const complementsModalOverlay = document.getElementById('complements-modal-overlay');
    if (complementsModalOverlay) {
        complementsModalOverlay.addEventListener('click', function (event) {
            if (event.target === complementsModalOverlay) {
                cancelComplementsSelection();
            }
        });
    }
});