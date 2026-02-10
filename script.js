// Проверяем, загрузился ли файл
console.log("Script loaded and ready");

let cart = [];
let currentProduct = null;
let currentImgIdx = 0;

// 1. ОТКРЫТИЕ МОДАЛКИ
window.openModal = function(index) {
    currentProduct = products[index];
    if (!currentProduct) return;
    
    currentImgIdx = 0;
    
    const modal = document.getElementById('productModal');
    const content = modal.querySelector('div');
    
    // Заполняем данными
    document.getElementById('modalTitle').innerText = currentProduct.ref;
    document.getElementById('modalPrice').innerText = currentProduct.price;
    document.getElementById('modalDesc').innerText = currentProduct.desc;
    document.getElementById('modalSize').innerText = currentProduct.size;
    
    // --- ЛОГИКА ДЛЯ ПРОДАННОГО ТОВАРА ---
    const buyBtn = modal.querySelector('button[onclick="addToCart()"]');
    if (currentProduct.sold) {
        buyBtn.style.display = 'none'; // Полностью убираем кнопку покупки
    } else {
        buyBtn.style.display = 'block'; // Возвращаем, если товар в наличии
    }
    // ------------------------------------

    updateSlider();
    
    modal.style.display = 'flex';
    content.classList.remove('animate-modal');
    void content.offsetWidth; 
    content.classList.add('animate-modal');
};

// 2. ЗАКРЫТИЕ
window.closeModal = function() {
    document.getElementById('productModal').style.display = 'none';
};

// 3. СЛАЙДЕР
window.nextImg = function() {
    if (!currentProduct) return;
    currentImgIdx = (currentImgIdx + 1) % currentProduct.images.length;
    updateSlider();
};

function updateSlider() {
    document.getElementById('sliderImg').src = currentProduct.images[currentImgIdx];
    document.getElementById('imageCounter').innerText = `${currentImgIdx + 1} / ${currentProduct.images.length}`;
}

// 4. КОРЗИНА
window.toggleCart = function() {
    const s = document.getElementById('cartSidebar');
    const content = s.querySelector('div');
    
    if (s.style.display === 'none' || !s.style.display) {
        s.style.display = 'flex';
        content.classList.add('animate-slide');
    } else {
        s.style.display = 'none';
    }
};

window.addToCart = function() {
    if (!currentProduct || currentProduct.sold) return; // Защита от добавления проданного
    cart.push(currentProduct);
    updateCartUI();
    
    const count = document.getElementById('cart-count');
    count.style.transform = 'scale(1.5)';
    count.style.color = '#fff';
    
    setTimeout(() => {
        count.style.transform = 'scale(1)';
        closeModal();
        toggleCart();
    }, 200);
};

function updateCartUI() {
    document.getElementById('cart-count').innerText = cart.length;
    const container = document.getElementById('cartItems');
    container.innerHTML = cart.map(item => `
        <div class="flex justify-between mb-4 border-b border-zinc-900 pb-2">
            <div class="text-[10px] uppercase">${item.ref}</div>
            <div class="text-[10px]">${item.price}</div>
        </div>
    `).join('');
    
    let total = 0;
    cart.forEach(item => {
        let p = parseInt(item.price) || 0;
        total += p;
    });
    document.getElementById('cart-total').innerText = total + '€';
}

// 5. ОПЛАТА
window.openCheckout = function() {
    if (cart.length === 0) return;
    const m = document.getElementById('checkoutModal');
    m.style.display = 'flex';
    m.querySelector('div').classList.add('animate-modal');
    document.getElementById('finalPrice').innerText = document.getElementById('cart-total').innerText;
};

window.closeCheckout = () => { document.getElementById('checkoutModal').style.display = 'none'; };

window.nextStep = () => {
    if(document.getElementById('clientName').value) {
        document.getElementById('step1').style.display = 'none';
        document.getElementById('step2').style.display = 'block';
    }
};

window.processPayment = function() {
    const btn = document.getElementById('payBtn');
    btn.innerText = "ПРОВЕРКА...";
    setTimeout(() => {
        const msg = `ЗАКАЗ: ${cart.map(i => i.ref).join(', ')}`;
        document.getElementById('tgLink').href = `https://t.me/yamusulmaninsalam?text=${encodeURIComponent(msg)}`;
        btn.classList.add('hidden');
        document.getElementById('tgAction').classList.remove('hidden');
    }, 1500);
};
