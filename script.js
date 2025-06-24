// Logout function
function logout() {
  localStorage.removeItem("loginUser");
  window.location.href = "login.html";
}

// Add item to cart
function addToCart(name, price, img) {
  if (!name || !price || !img) return;
  let cart = JSON.parse(localStorage.getItem("cart") || "[]");
  cart.push({ name, price, img });
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  renderCart();
}

// Update cart count on icon
function updateCartCount() {
  let cart = JSON.parse(localStorage.getItem("cart") || "[]");
  let countEl = document.getElementById("cartCount");
  if (countEl) countEl.innerText = cart.length > 0 ? cart.length : "";
}

// Render cart modal content
function renderCart() {
  let cart = JSON.parse(localStorage.getItem("cart") || "[]");
  let cartList = document.getElementById("cartList");
  let emptyMsg = document.getElementById("emptyCartMsg");
  if (!cartList || !emptyMsg) return;
  cartList.innerHTML = "";
  if (cart.length === 0) {
    emptyMsg.style.display = "block";
    return;
  } else {
    emptyMsg.style.display = "none";
  }
  cart.forEach((item, i) => {
    let li = document.createElement("li");
    li.innerHTML = `
      <img src="${item.img}" alt="${
      item.name
    }" style="width:38px;height:38px;object-fit:cover;border-radius:4px;margin-right:10px;">
      <span>${item.name} - Rp ${item.price.toLocaleString()}${
      item.qty ? " (x" + item.qty + ")" : ""
    }</span>
      <button onclick="removeFromCart(${i})" style="margin-left:12px;">Hapus</button>
    `;
    li.style.display = "flex";
    li.style.alignItems = "center";
    cartList.appendChild(li);
  });
}

// Remove item from cart
function removeFromCart(index) {
  let cart = JSON.parse(localStorage.getItem("cart") || "[]");
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  renderCart();
}

function checkoutCart() {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  if (cart.length === 0) {
    alert("Keranjang masih kosong!");
    return;
  }
  // Dummy data pembeli, bisa diganti sesuai data user login
  const buyer = JSON.parse(localStorage.getItem("profileData") || "{}");
  const order = {
    buyerName: buyer.username || "Anonim",
    buyerPhone: buyer.nohp || "-",
    buyerAddress: buyer.alamat || "-",
    items: cart,
    total: cart.reduce((sum, item) => sum + item.price * (item.qty || 1), 0),
    date: new Date().toLocaleString(),
  };

  // Simpan ke orders
  const orders = JSON.parse(localStorage.getItem("orders") || "[]");
  orders.push(order);
  localStorage.setItem("orders", JSON.stringify(orders));

  // Kosongkan keranjang
  localStorage.removeItem("cart");
  updateCartCount && updateCartCount();
  renderCart && renderCart();

  alert("Pesanan berhasil dikirim ke penjual!");
  window.location.href = "orders.html";
}
// Modal logic
document.addEventListener("DOMContentLoaded", function () {
  // ... kode lain ...
  const checkoutBtn = document.getElementById("checkoutBtn");
  if (checkoutBtn) {
    checkoutBtn.onclick = checkoutCart;
  }
});

const cartIcon = document.getElementById("cartIcon");
const cartModal = document.getElementById("cartModal");
const closeCart = document.getElementById("closeCart");

if (cartIcon && cartModal && closeCart) {
  cartIcon.onclick = function (e) {
    e.preventDefault();
    renderCart();
    cartModal.style.display = "block";
  };

  closeCart.onclick = function () {
    cartModal.style.display = "none";
  };

  window.addEventListener("click", function (event) {
    if (event.target === cartModal) {
      cartModal.style.display = "none";
    }
  });
}
