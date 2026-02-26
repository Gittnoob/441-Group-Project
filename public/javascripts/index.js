// ── helpers ────────────────────────────────────────────────────────────────
async function api(method, path, body) {
    const opts = { method, headers: { 'Content-Type': 'application/json' }, credentials: 'include' };
    if (body) opts.body = JSON.stringify(body);
    const res = await fetch(path, opts);
    return res.json();
}
function msg(text, err = false) {
    document.getElementById(err ? 'error-msg' : 'message').textContent = text;
    document.getElementById(err ? 'message' : 'error-msg').textContent = '';
}
function show(id) {
    document.querySelectorAll('section').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    if (id === 'browse') loadListings();
    else if (id === 'user') loadUserInformation();
    else if(id === 'sell')
    {
        document.getElementById('listing-form').addEventListener('submit', async e => {
            e.preventDefault();
            const fd = new FormData(e.target);
            const body = Object.fromEntries(fd.entries());
            const data = await api('POST', '/api/listings', body);
            if (data.error) { msg(data.error, true); return; }
            msg('Listing posted!');
            e.target.reset();
        });
    }
    else if(id === 'login')
    {
        document.getElementById('login-form').addEventListener('submit', async e => {
            e.preventDefault();
            const fd = new FormData(e.target);
            const data = await api('POST', '/auth/login', Object.fromEntries(fd.entries()));
            if (data.error) { msg(data.error, true); return; }
            msg(`Welcome back, ${data.user.username}!`);
            checkStatus();
            show('browse');
        });
    }
    else if(id === 'register')
    {
        document.getElementById('register-form').addEventListener('submit', async e => {
            e.preventDefault();
            const fd = new FormData(e.target);
            const data = await api('POST', '/auth/register', Object.fromEntries(fd.entries()));
            if (data.error) { msg(data.error, true); return; }
            msg(`Account created! Welcome, ${data.user.username}.`);
            checkStatus();
            show('browse');
        });
    }
}

// ── auth status ────────────────────────────────────────────────────────────
async function checkStatus() {
    const data = await api('GET', '/auth/status');
    const bar = document.getElementById('status-bar');
    bar.textContent = data.user ? `Logged in as ${data.user.username}` : 'Not logged in';
}

async function logout() {
    await api('POST', '/auth/logout');
    msg('Logged out.');
    checkStatus();
}

// ── listings ───────────────────────────────────────────────────────────────
async function loadListings() {
    //const q = document.getElementById('search-input').value.trim();
    const cat = document.getElementById('cat-filter').value;
    const params = new URLSearchParams();
    //if (q) params.set('q', q);
    if (cat) params.set('category', cat);
    // const endpoint = q ? `/api/listings/search?${params}` : `/api/listings?${params}`;
    const endpoint = `/api/listings?${params}`;
    const data = await api('GET', endpoint);
    const items = data.items || [];
    const container = document.getElementById('listings-container');
    if (!items.length) { container.innerHTML = '<p>No listings found.</p>'; return; }
    container.innerHTML = items.map(item => `
    <div class="card">
        <h3>${item.name} — $${item.price.toFixed(2)}</h3>
        <p><strong>Category:</strong> ${item.category} &nbsp;|&nbsp; <strong>Qty:</strong> ${item.quantity}</p>
        <p>${item.description || ''}</p>
        <p><em>Seller: ${item.seller_id?.username || 'Unknown'}</em></p>
        <button class="add-to-cart-btn" onclick="addToCart('${item._id}')">
            ➕ Add to Cart
        </button>
    </div>`).join('');
}

async function addToCart(itemId) {
    const data=await fetch(`/users/addToWatchList?itemId=${itemId}`,{method:'PUT'})
    if(data.error)
    {
        msg(data.error,true)
        return 
    }
    else
    {
        msg("add to your shopping cart auccessfully")
    }
}

async function loadUserInformation() {
    const data = await api('GET', '/users');
    if (data.error) { msg(data.error, true); return; }
    const container = document.getElementById('basic-info')
    container.innerHTML = `
    <h3>Basic Information</h3>
    <h4>username </h4><span>${data.username}</span>
    <h4>email </h4><span>${data.email}</span>
    <h4>biography</h4><input type="text" value="${data.bio}" placeholder="" />
    <h4>your location</h4><input type="text" value="${data.location}" placeholder="" />
    <h4>your balance</h4><input type="number" value=${data.balance} placeholder="" />
    <button onClick="updateProfile()" disabled>save</button>
    `
    const itemList = await Promise.all(data.watchlist.map(async (item)=>{
    return (await api('GET',`api/listings/${item}`)).item
    }))

    let tableHtml = `
    <table class="cart-table">
        <thead>
            <tr>
                <th>Item Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Seller</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
    `;

    itemList.forEach(item => {
        tableHtml += `
        <tr id="row-${item._id}">
            <td>${item.name}</td>
            <td>${item.category}</td>
            <td>$${item.price}</td>
            <td>${item.seller_id.username}</td>
            <td>
                <button class="del-btn" onclick="removeFromCart('${item._id}')" disabled>Remove</button>
            </td>
        </tr>
        `;
    });

    tableHtml += `</tbody></table>`;

    const container1 = document.getElementById('watchlist')
    container1.innerHTML = `
    <h3>Shopping Cart</h3>
    ${tableHtml}
    <button className="buy-btn"} disabled>Buy</button>
    `      

    const container2 = document.getElementById('orders')
    container2.innerHTML='<h3>Your Orders</h3>Todo add get order api'
    // const orderList = await Promise.all(data.orders.map(async (item)=>{
    // return (await api('GET',`api/listings/${item}`)).item
    // }))

}


// ── init ───────────────────────────────────────────────────────────────────
checkStatus();
loadListings();
//show('browse')