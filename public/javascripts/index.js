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
    </div>`).join('');
}

async function loadUserInformation() {
    const data = await api('GET', '/users');
    if (data.error) { msg(data.error, true); return; }
    const container = document.getElementById('basic-info')
    container.innerHTML = `
    <h3>Basic Information</h3>
    <input type="text" defaultValue=${data.bio} placeholder="" />
    <input type="text" defaultValue=${data.location} placeholder="" />
    <button onClick="updateProfile()">保存修改</button>
    `
    const itemList = await Promise.all(data.watchlist.map(async (item)=>{
    return (await api('GET',`api/listings/${item}`))
    }))
    const itemTable = itemList.map((item)=>{
        `
        <div key=${item._id} className="item-card">
        <span>${item.name} - ${item.price}</span>
        
        <div className="qty-controls">
            <button onClick={() => handleQtyChange(item._id, -1)}>-</button>
            <span>{quantities[item._id] || 1}</span>
            <button onClick={() => handleQtyChange(item._id, 1)}>+</button>
        </div>
        <button className="delete-btn" onClick={() => removeFromWatchlist(item._id)}>
            Delete
        </button>
        </div>`
    })
    const container1 = document.getElementById('watchlist')
    container1.innerHTML = `
    <h3>My Collection</h3>
    ${itemTable}
    <button className="buy-btn" onClick={() => buyItem(item._id, quantities[item._id] || 1)}>
    Buy
    </button>
    `      

}


// ── init ───────────────────────────────────────────────────────────────────
checkStatus();
loadListings();
//show('browse')