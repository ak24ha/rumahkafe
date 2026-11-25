// =====================================================
// RUHE COFFEE – script.js
// =====================================================

// Nomor WhatsApp tujuan
const WA_PHONE_NUMBER = "6285168659770";

// Data Daftar Menu Pre-Order sesuai img/menu.png
const menuData = [
  // ESPRESSO BASED
  {
    id: 1,
    category: "Espresso Based",
    name: "Cranberry Americano",
    desc: "Espresso, Cranberry Juice",
    price: 10000,
    badge: "Recommended"
  },
  {
    id: 2,
    category: "Espresso Based",
    name: "Americano",
    desc: "Espresso, Ice",
    price: 8000,
    badge: ""
  },
  {
    id: 3,
    category: "Espresso Based",
    name: "Espresso",
    desc: "30ml espresso",
    price: 7000,
    badge: ""
  },

  // MILK BASED
  {
    id: 4,
    category: "Milk Based",
    name: "Ruhe Creamy Latte",
    desc: "Espresso, Creamy Milk, Condensed Milk",
    price: 15000,
    badge: "Best Seller"
  },
  {
    id: 5,
    category: "Milk Based",
    name: "Ruhe Aren Latte",
    desc: "Espresso, Milk, Aren Sugar",
    price: 14000,
    badge: "Favorite"
  },
  {
    id: 6,
    category: "Milk Based",
    name: "Butterscotch Latte",
    desc: "Espresso, Milk, Butterscotch Syrup",
    price: 14000,
    badge: ""
  },
  {
    id: 7,
    category: "Milk Based",
    name: "Caramel Latte",
    desc: "Espresso, Milk, Caramel Syrup",
    price: 14000,
    badge: ""
  },
  {
    id: 8,
    category: "Milk Based",
    name: "Caffe Latte",
    desc: "Espresso, Milk, Sugar",
    price: 13000,
    badge: ""
  }
];

// State Keranjang
let cart = [];

// Helper Format Rupiah
function formatRupiah(amount) {
  return "Rp " + amount.toLocaleString("id-ID");
}

// Inisialisasi Tampilan Menu (Tanpa Gambar pada Card)
function renderMenu() {
  const menuGrid = document.getElementById("menuGrid");
  if (!menuGrid) return;

  // Kelompokkan menu berdasarkan kategori
  const categories = ["Espresso Based", "Milk Based"];

  let htmlContent = "";

  categories.forEach((category) => {
    const items = menuData.filter((item) => item.category === category);
    if (items.length === 0) return;

    htmlContent += `
      <div class="menu-category-block">
        <h3 class="category-title">
          <i class="fa-solid fa-mug-hot"></i> ${category.toUpperCase()}
        </h3>
        <div class="category-grid">
          ${items
            .map(
              (item) => `
            <div class="menu-card">
              <div class="menu-card-top">
                <span class="category-tag">${item.category}</span>
                ${item.badge ? `<span class="menu-badge"><i class="fa-solid fa-thumbs-up"></i> ${item.badge}</span>` : ""}
              </div>
              <div class="menu-card-body">
                <h4 class="menu-card-name">${item.name}</h4>
                <p class="menu-card-desc">${item.desc}</p>
                <div class="menu-card-bottom">
                  <span class="menu-card-price">${formatRupiah(item.price)}</span>
                  <button class="btn-add" onclick="addToCart(${item.id})">
                    <i class="fa-solid fa-plus"></i> Tambah
                  </button>
                </div>
              </div>
            </div>
          `
            )
            .join("")}
        </div>
      </div>
    `;
  });

  menuGrid.innerHTML = htmlContent;
}

// Buka & Tutup Drawer Keranjang
function toggleCart(open) {
  const drawer = document.getElementById("cartDrawer");
  const backdrop = document.getElementById("cartBackdrop");
  if (!drawer || !backdrop) return;

  if (open) {
    drawer.classList.add("active");
    backdrop.classList.add("active");
    document.body.style.overflow = "hidden";
  } else {
    drawer.classList.remove("active");
    backdrop.classList.remove("active");
    document.body.style.overflow = "";
  }
}

// Tambah Item ke Keranjang
function addToCart(productId) {
  const product = menuData.find((p) => p.id === productId);
  if (!product) return;

  const existingItem = cart.find((item) => item.id === productId);
  if (existingItem) {
    existingItem.qty += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category,
      qty: 1
    });
  }

  updateCartView();

  // Animasi feedback tombol keranjang
  const cartBtn = document.getElementById("cartBtn");
  if (cartBtn) {
    cartBtn.style.transform = "scale(1.2)";
    setTimeout(() => {
      cartBtn.style.transform = "";
    }, 200);
  }
}

// Kurangi Jumlah Item
function decreaseQty(productId) {
  const index = cart.findIndex((item) => item.id === productId);
  if (index === -1) return;

  if (cart[index].qty > 1) {
    cart[index].qty -= 1;
  } else {
    cart.splice(index, 1);
  }
  updateCartView();
}

// Tambah Jumlah Item dari Keranjang
function increaseQty(productId) {
  const item = cart.find((item) => item.id === productId);
  if (item) {
    item.qty += 1;
    updateCartView();
  }
}

// Kosongkan Keranjang
function clearCart() {
  if (cart.length === 0) return;
  if (confirm("Apakah kamu yakin ingin mengosongkan keranjang?")) {
    cart = [];
    updateCartView();
  }
}

// Render Ulang Isi Keranjang & Badge
function updateCartView() {
  const cartBody = document.getElementById("cartBody");
  const cartBadge = document.getElementById("cartBadge");
  const cartTotal = document.getElementById("cartTotal");

  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  // Update Badge
  if (cartBadge) {
    cartBadge.textContent = totalQty;
    if (totalQty === 0) {
      cartBadge.classList.add("hidden");
    } else {
      cartBadge.classList.remove("hidden");
    }
  }

  // Update Total Harga
  if (cartTotal) {
    cartTotal.textContent = formatRupiah(totalPrice);
  }

  // Render Daftar Item di Keranjang (Tanpa gambar)
  if (!cartBody) return;

  if (cart.length === 0) {
    cartBody.innerHTML = '<p class="cart-empty">Keranjang masih kosong 🛒</p>';
    return;
  }

  cartBody.innerHTML = cart
    .map(
      (item) => `
      <div class="cart-item">
        <div class="cart-item-icon">
          <i class="fa-solid fa-mug-hot"></i>
        </div>
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">${formatRupiah(item.price)}</div>
          <div class="qty-controls">
            <button class="qty-btn" onclick="decreaseQty(${item.id})" aria-label="Kurangi">-</button>
            <span class="qty-value">${item.qty}</span>
            <button class="qty-btn" onclick="increaseQty(${item.id})" aria-label="Tambah">+</button>
          </div>
        </div>
        <div class="cart-item-subtotal">
          ${formatRupiah(item.price * item.qty)}
        </div>
      </div>
    `
    )
    .join("");
}

// Checkout ke WhatsApp
function checkoutWhatsApp() {
  if (cart.length === 0) {
    alert("Keranjang belanja masih kosong! Silakan pilih menu terlebih dahulu.");
    return;
  }

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  let message = "Halo Ruhe Coffee, saya mau pre-order:\n\n";

  cart.forEach((item, index) => {
    message += `${index + 1}. ${item.name} (${item.qty}x) = ${formatRupiah(item.price * item.qty)}\n`;
  });

  message += `\n*Total Pesanan: ${formatRupiah(totalPrice)}*\n\n`;
  message += "Catatan: Pre-order only · Pickup by confirmation\n";
  message += "Mohon konfirmasi pesanan saya. Terima kasih!";

  const encodedMessage = encodeURIComponent(message);
  const waUrl = `https://wa.me/${WA_PHONE_NUMBER}?text=${encodedMessage}`;

  window.open(waUrl, "_blank");
}

// Event Listeners saat DOM selesai dimuat
document.addEventListener("DOMContentLoaded", () => {
  renderMenu();
  updateCartView();

  // Tombol Buka Keranjang
  const cartBtn = document.getElementById("cartBtn");
  if (cartBtn) {
    cartBtn.addEventListener("click", () => toggleCart(true));
  }

  // Tombol Tutup Keranjang
  const cartClose = document.getElementById("cartClose");
  if (cartClose) {
    cartClose.addEventListener("click", () => toggleCart(false));
  }

  // Backdrop Klik untuk Tutup
  const backdrop = document.getElementById("cartBackdrop");
  if (backdrop) {
    backdrop.addEventListener("click", () => toggleCart(false));
  }

  // Tombol Kosongkan Keranjang
  const btnClear = document.getElementById("btnClear");
  if (btnClear) {
    btnClear.addEventListener("click", clearCart);
  }

  // Tombol Checkout WhatsApp
  const btnCheckout = document.getElementById("btnCheckout");
  if (btnCheckout) {
    btnCheckout.addEventListener("click", checkoutWhatsApp);
  }
});
