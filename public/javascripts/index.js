let products = [
            { id: 1, title: "二手单反相机", price: 1500, img: "https://picsum.photos/200/200?random=1", count: 0 },
            { id: 2, title: "手冲咖啡壶", price: 88, img: "https://picsum.photos/200/200?random=2", count: 0 },
            { id: 3, title: "游戏键盘", price: 299, img: "https://picsum.photos/200/200?random=3", count: 0 }
        ];


let isLoggedIn = false;

function renderProducts() {
    const list = document.getElementById('product-list');
    list.innerHTML = products.map((item,idx) => `
        <div class="product-card">
            <img src="${item.img || 'https://via.placeholder.com/200'}" class="product-img">
            <div class="product-info">
                <div class="price">¥${item.price}</div>
                <div class="title">${item.title}</div>
                <div class="stepper">
                    <button onclick="changeQty(${idx}, -1)">-</button>
                    <span>${item.count}</span>
                    <button onclick="changeQty(${idx}, 1)">+</button>
                </div>
            </div>
        </div>
    `).join('');
}

function changeQty(idx, delta) {
    products[idx].count = Math.max(0, products[idx].count + delta);
    render();
}

function openCart() {
    if(!isLoggedIn) {
        alert("Please log in first");
        return;
    }
    const selected = products.filter(p => p.count > 0);
    if (selected.length === 0) return alert("There is nothing in your cart");

    const cartList = document.getElementById('cart-list');
    let total = 0;
    
    cartList.innerHTML = selected.map(p => {
        total += p.price * p.count;
        return `
            <div class="cart-item">
                <span>${p.title} x${p.count}</span>
                <span>¥${p.price * p.count}</span>
            </div>
        `;
    }).join('');

    document.getElementById('cart-total').innerText = '$' + total;
    document.getElementById('cartModal').style.display = 'flex';
}

function toggleLogin() {
    isLoggedIn = !isLoggedIn;
    const btn = document.getElementById('login-btn');
    btn.innerText = isLoggedIn ? "exit" : "Log in";
    btn.style.background = isLoggedIn ? "#ddd" : "#ffda44";
    if(isLoggedIn)
    {
        renderProducts()
    }
    else
    {
        const list = document.getElementById('product-list');
        list.innerHTML = null
    }
}

function openModal() {
    if(!isLoggedIn) {
        alert("Please log in first");
        return;
    }
    document.getElementById('postModal').style.display = 'flex';
}

function closeModal() {
    //document.getElementById('modal').style.display = 'none';
    document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
}

function addProduct() {
    const title = document.getElementById('p-title').value;
    const price = document.getElementById('p-price').value;
    const img = document.getElementById('p-img').value;

    if(!title || !price) {
        alert("Title and price cannot be empty.");
        return;
    }

    const newProduct = {
        title: title,
        price: price,
        img: img || `https://picsum.photos/200/200?random=${Math.random()}`
    };

    products.unshift(newProduct);
    renderProducts(); 
    closeModal();
    
    document.getElementById('p-title').value = '';
    document.getElementById('p-price').value = '';
}

renderProducts();
