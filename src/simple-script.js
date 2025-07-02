// =======================================================
// ARQUIVO JAVASCRIPT FINAL E UNIFICADO
// =======================================================

// --- Definições de Produtos e Complementos ---
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

// --- Variáveis Globais ---
let selectedProduct = null;
let selectedComplements = new Set();
const cart = [];

// --- Funções de Modal ---
function toggleModal(modalId, show) {
    const modalOverlay = document.getElementById(modalId);
    if (!modalOverlay) return;
    modalOverlay.classList.toggle('is-visible', show);
    document.body.classList.toggle('modal-open', show);
}

function openCartModal() {
    renderModalCart();
    toggleModal('cart-modal-overlay', true);
}

function closeCartModal() {
    toggleModal('cart-modal-overlay', false);
}

function openComplementsModal() {
    const product = products[selectedProduct];
    const limitInfo = document.getElementById('complement-limit-info-modal');
    if (limitInfo) {
        limitInfo.innerText = product.complements > 0 ? `Escolha até ${product.complements} complementos grátis` : 'Sem complementos grátis para este item.';
    }
    toggleModal('complements-modal-overlay', true);
}

function closeComplementsModal() {
    toggleModal('complements-modal-overlay', false);
}

// --- Lógica do Carrinho e Seleção ---
function selectProduct(productId) {
    selectedProduct = productId;
    const product = products[productId];
    if (product.complements > 0) {
        selectedComplements.clear();
        document.querySelectorAll('#complements-modal-overlay input[type="checkbox"]').forEach(input => input.checked = false);
        openComplementsModal();
    } else {
        cart.push({ productId, complements: [] });
        updateCartAndTotal();
        openCartModal();
    }
}

function toggleComplement(complementId, isChecked) {
    const checkbox = document.getElementById(complementId);
    // Para complementos adicionados dinamicamente, buscamos o preço do data-attribute
    const price = parseFloat(checkbox.dataset.price || '0');
    const complementInfo = complements[complementId] || { category: 'adicional', price: price };
    const productInfo = products[selectedProduct];

    if (isChecked) {
        if (complementInfo.category === 'gratis' && Array.from(selectedComplements).filter(id => (complements[id]?.category || 'adicional') === 'gratis').length >= productInfo.complements) {
            alert(`Limite de ${productInfo.complements} complementos grátis atingido.`);
            checkbox.checked = false;
            return;
        }
        selectedComplements.add(complementId);
    } else {
        selectedComplements.delete(complementId);
    }
}

function confirmComplementsAndAddToCart() {
    if (!selectedProduct) return;
    cart.push({ productId: selectedProduct, complements: Array.from(selectedComplements) });
    selectedProduct = null;
    updateCartAndTotal();
    closeComplementsModal();
    openCartModal();
}

function cancelComplementsSelection() {
    selectedProduct = null;
    selectedComplements.clear();
    closeComplementsModal();
}

// --- Funções de Atualização e Renderização ---
function updateCartAndTotal() {
    updateCartCount();
    updateTotal();
    renderModalCart();
}

function updateCartCount() {
    const cartCountEl = document.getElementById('cart-count');
    if (cartCountEl) {
        cartCountEl.innerText = cart.length;
        cartCountEl.style.display = cart.length > 0 ? 'flex' : 'none';
    }
}

function renderModalCart() {
    const list = document.getElementById('cart-modal-list');
    const modalTotalEl = document.getElementById('modal-total-price');
    if (!list || !modalTotalEl) return;
    list.innerHTML = "";
    let total = 0;
    if (cart.length === 0) {
        list.innerHTML = `<li style="text-align: center; font-style: italic; color: #888; border: none;">Seu carrinho está vazio.</li>`;
    } else {
        cart.forEach(item => {
            const product = products[item.productId];
            let itemTotal = product.price;
            item.complements.forEach(id => {
                const complementInfo = complements[id] || { price: parseFloat(document.getElementById(id)?.dataset.price || 0) };
                itemTotal += complementInfo.price;
            });
            total += itemTotal;
            const complementNames = item.complements.map(id => (complements[id] || { name: id }).name).filter(Boolean).join(", ");
            list.innerHTML += `
                <li>
                  <span>${product.name}</span>
                  <span style="font-weight: bold;">R$ ${itemTotal.toFixed(2)}</span>
                  ${complementNames ? `<small style="flex-basis: 100%;">${complementNames}</small>` : ''}
                </li>
            `;
        });
    }
    modalTotalEl.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

function updateTotal() {
    let total = 0;
    cart.forEach(item => {
        total += products[item.productId].price;
        item.complements.forEach(id => {
            const complementInfo = complements[id] || { price: parseFloat(document.getElementById(id)?.dataset.price || 0) };
            total += complementInfo.price;
        });
    });

    if (document.getElementById('delivery-checkbox')?.checked) total += 2;
    if (document.querySelector('.payment-card.selected[data-method="cartao"]')) total += 1;

    document.getElementById('total-price').textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    
    const customerName = document.getElementById('customer-name')?.value.trim();
    const confirmBtn = document.getElementById('confirm-all-btn');
    if(confirmBtn) confirmBtn.disabled = cart.length === 0 || !customerName;
}

// --- Lógica de Entrega e Pagamento ---
function handleDeliveryChange(el) {
    if (el.checked) document.getElementById('pickup-checkbox').checked = false;
    let addressSection = document.getElementById('delivery-address-section');
    if (el.checked && !addressSection) {
        addressSection = document.createElement('div');
        addressSection.id = 'delivery-address-section';
        // Adicionando oninput para recalcular o total quando o endereço é preenchido (melhora a validação)
        addressSection.innerHTML = `<h3>Local de Entrega</h3><input type="text" id="delivery-address" placeholder="Rua, número, bairro..." oninput="updateTotal()"/>`;
        document.querySelector('.delivery-section').insertAdjacentElement('afterend', addressSection);
    } else if (addressSection) {
        addressSection.style.display = el.checked ? 'block' : 'none';
    }
    updateTotal();
}

function handlePickupChange(el) {
    if (el.checked) document.getElementById('delivery-checkbox').checked = false;
    const addressSection = document.getElementById('delivery-address-section');
    if (addressSection) addressSection.style.display = 'none';
    updateTotal();
}

function selectPaymentMethod(method) {
    document.querySelectorAll('.payment-card').forEach(card => card.classList.toggle('selected', card.dataset.method === method));
    document.getElementById("troco-section").style.display = method === "especie" ? "block" : "none";
    updateTotal();
}

// --- Validação e Finalização ---
function highlightField(elementId) {
    const element = document.getElementById(elementId);
    if (!element) return;
    closeCartModal();
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    element.classList.add('highlight-error');
    setTimeout(() => element.classList.remove('highlight-error'), 2500);
}

function validateOrder() {
    if (cart.length === 0) { alert("Seu carrinho está vazio!"); return false; }
    if (!document.getElementById('customer-name')?.value.trim()) { highlightField('customer-name'); return false; }
    const isDelivery = document.getElementById('delivery-checkbox')?.checked;
    const isPickup = document.getElementById('pickup-checkbox')?.checked;
    if (!isDelivery && !isPickup) { highlightField('delivery-section'); return false; }
    if (isDelivery && !document.getElementById('delivery-address')?.value.trim()) { highlightField('delivery-address'); return false; }
    if (!document.querySelector('.payment-card.selected')) { highlightField('payment-section'); return false; }
    return true;
}

function confirmAllOrders() {
    if (!validateOrder()) return;
    const selectedMethod = document.querySelector('.payment-card.selected').dataset.method;
    if (selectedMethod === 'pix') {
        initiatePixPayment();
    } else {
        sendWhatsAppOrder();
    }
}

async function initiatePixPayment() {
    const confirmBtn = document.getElementById('confirm-all-btn');
    confirmBtn.disabled = true;
    confirmBtn.textContent = "Gerando QR Code...";

    try {
        const totalPriceSpan = document.getElementById('total-price');
        const precoTexto = totalPriceSpan.textContent;
        const valorNumerico = parseFloat(precoTexto.replace('R$ ', '').replace(',', '.'));

        if (isNaN(valorNumerico) || valorNumerico <= 0) throw new Error("Valor do carrinho inválido.");

        // Agora enviamos o nome do cliente e o carrinho inteiro para o servidor
        const dadosParaServidor = {
            customerName: document.getElementById('customer-name').value.trim(),
            cart: cart, // A variável global 'cart' que já tem tudo
            totalAmount: valorNumerico // O valor total já calculado no front-end
        };

        const response = await fetch('https://dzn.onrender.com/create_payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosParaServidor),
        });

        const payment = await response.json();
        if (!response.ok) throw new Error(payment.error || 'Erro ao processar pagamento.');

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

function sendWhatsAppOrder() {
    const nome = document.getElementById('customer-name').value.trim();
    let msg = `Olá! Pedido de *${nome}*:\n\n`;
    let total = 0;
    
    cart.forEach(item => {
        const prod = products[item.productId];
        let itemTotal = prod.price;
        const complementNames = item.complements.map(id => {
            const c = complements[id] || { name: id, price: parseFloat(document.getElementById(id)?.dataset.price || 0) };
            itemTotal += c.price;
            return c.name;
        }).join(", ");
        total += itemTotal;
        msg += `🍧 *${prod.name}* - R$ ${prod.price.toFixed(2)}\n`;
        if(complementNames) msg += `*Com:* ${complementNames}\n`;
    });

    if (document.getElementById('delivery-checkbox').checked) {
        total += 2;
        msg += `\n🏍️ *Entrega:* R$ 2,00\n📍 *Endereço:* ${document.getElementById('delivery-address').value.trim()}\n`;
    } else {
        msg += `\n🚶 *Retirada no local*\n`;
    }

    const method = document.querySelector('.payment-card.selected').dataset.method;
    if (method === 'cartao') {
        total += 1;
        msg += `\n💳 *Pagamento:* Cartão (+ R$ 1,00)\n`;
    } else if(method === 'especie'){
        const troco = document.getElementById('troco-value').value;
        msg += `\n💵 *Pagamento:* Dinheiro`;
        if (troco) msg += ` (troco para R$ ${parseFloat(troco).toFixed(2)})`;
        msg += '\n';
    }

    msg += `\n🧾 *Total Geral:* R$ ${total.toFixed(2)}`;
    const num = "558699127297";
    window.open(`https://wa.me/${num}?text=${encodeURIComponent(msg)}`, "_blank");
}

function clearCart() {
    cart.length = 0;
    const summarySection = document.querySelector('.summary-section');
    summarySection.innerHTML = `
        <div class="total-price">Total: <span id="total-price">R$ 0,00</span></div>
        <div style="display: flex; flex-direction: column; gap: 10px;">
            <button class="confirm-btn" id="confirm-all-btn" onclick="confirmAllOrders()" disabled>Enviar Pedido</button>
        </div>
    `;
    document.getElementById('customer-name').value = '';
    document.getElementById('delivery-checkbox').checked = false;
    document.getElementById('pickup-checkbox').checked = false;
    const addressSection = document.getElementById('delivery-address-section');
    if (addressSection) {
        addressSection.parentNode.removeChild(addressSection);
    }
    document.querySelectorAll('.payment-card.selected').forEach(c => c.classList.remove('selected'));
    document.getElementById('troco-section').style.display = 'none';
    document.getElementById('troco-value').value = '';
    updateCartAndTotal();
    closeCartModal();
}

// --- Inicialização da Página ---
document.addEventListener('DOMContentLoaded', () => {
    updateCartAndTotal();
});
