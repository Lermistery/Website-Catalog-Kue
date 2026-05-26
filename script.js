const products = [
  {
    name: "Kue Putri Salju",
    price: 120000,
    img: "images/putri-salju.jpg",
    description: "Kue kering berbentuk bulan sabit yang diselimuti gula halus seperti salju, memberikan sensasi manis lembut dan sedikit dingin di lidah. Teksturnya rapuh dan langsung lumer saat digigit, menjadikannya salah satu camilan paling ikonik saat hari raya",
  },
  {
    name: "Kue Kastengel",
    price: 140000,
    img: "images/kue-kastengel.jpg",
    description: "Kue kering gurih berbentuk stik yang kaya akan rasa keju premium. Memiliki tekstur renyah di luar namun tetap lembut saat digigit, dengan aroma khas keju panggang yang menggoda. Cocok untuk pecinta camilan asin yang ringan namun tetap mewah.",
  },
  {
    name: "Kue Nastar",
    price: 120000,
    img: "images/kue-nastar.jpg",
    description: "Kue kering klasik berbentuk bulat dengan isian selai nanas yang manis dan sedikit asam. Dibalut adonan lembut berbasis mentega, nastar menghadirkan sensasi lumer di mulut yang khas dan selalu menjadi favorit saat momen Lebaran.",
  },
  {
    name: "Bolu Lapis Surabaya",
    price: 150000,
    img: "images/LAPIS-SURABAYA.jpg",
    description: "Kue klasik premium dengan lapisan lembut yang tersusun rapi, menghadirkan perpaduan rasa manis dan aroma butter yang khas. Teksturnya empuk, sedikit padat, dan lumer di mulut, menjadikannya pilihan sempurna untuk sajian spesial saat Lebaran.",
  },
  {
    name: "Kue Sagu",
    price: 95000,
    img: "images/kue-sagu.jpeg",
    description: "Kue kering dengan tekstur renyah di luar namun langsung lumer saat digigit. Perpaduan tepung sagu dan keju menghasilkan rasa gurih yang khas serta aroma harum yang menggoda. Cocok untuk camilan ringan yang bikin nagih",
  },
  {
    name: "Lidah Kucing",
    price: 100000,
    img: "images/lidah-kucing.jpg",
    description: "Kue tipis berbentuk panjang dengan tekstur renyah dan ringan. Memiliki cita rasa buttery yang lembut dengan aroma mentega yang dominan, menjadikannya favorit untuk dinikmati bersama teh atau kopi.",
  },
];

const bestSellers = products.slice(0, 3);
const recommendedProducts = products.slice(3);
let cart = [];

function formatRupiah(value) {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function renderProducts(items, startIndex = 0) {
  let html = "";
  items.forEach((product, index) => {
    html += `
      <article class="card">
        <img src="${product.img}" alt="${product.name}" />
        <div class="card-body">
          <h3>${product.name}</h3>
          <p class="product-desc">${product.description}</p>
          <div class="card-footer">
            <span class="product-price">Rp ${formatRupiah(product.price)}</span>
            <button class="btn btn-primary" onclick="addToCart(${startIndex + index})">Tambah</button>
          </div>
        </div>
      </article>
    `;
  });
  return html;
}

function displayProducts() {
  document.getElementById("product-list").innerHTML = renderProducts(bestSellers, 0);
  document.getElementById("recommended-list").innerHTML = renderProducts(recommendedProducts, 3);
}

function addToCart(index) {
  const product = products[index];
  const existing = cart.find(item => item.name === product.name);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  updateCart();
  document.getElementById("cart").classList.add("active");
}

function removeFromCart(name) {
  cart = cart.filter(item => item.name !== name);
  updateCart();
}

function updateCart() {
  const cartItems = document.getElementById("cart-items");
  let itemsHtml = "";
  let total = 0;

  if (cart.length === 0) {
    itemsHtml = `<p class="empty-cart">Keranjang kosong, ayo pilih menu favoritmu!</p>`;
  } else {
    cart.forEach((item, index) => {
      const itemTotal = item.price * item.qty;
      total += itemTotal;
      itemsHtml += `
        <div class="cart-item">
          <h4>${item.name}</h4>
          <p>Rp ${formatRupiah(item.price)} x ${item.qty} = Rp ${formatRupiah(itemTotal)}</p>
          <div class="item-meta">
            <div class="qty-controls">
              <button class="qty-btn" onclick="decreaseQuantity(${index})">−</button>
              <span class="qty-display">${item.qty}</span>
              <button class="qty-btn" onclick="increaseQuantity(${index})">+</button>
            </div>
            <button class="remove-btn" onclick="removeFromCart('${item.name}')">Hapus Semua</button>
          </div>
        </div>
      `;
    });
  }

  cartItems.innerHTML = itemsHtml;
  document.getElementById("total").innerText = formatRupiah(total);
  document.getElementById("cart-count").innerText = cart.reduce((sum, item) => sum + item.qty, 0);
}

function increaseQuantity(index) {
  if (index >= 0 && index < cart.length) {
    cart[index].qty += 1;
    updateCart();
  }
}

function decreaseQuantity(index) {
  if (index >= 0 && index < cart.length) {
    if (cart[index].qty > 1) {
      cart[index].qty -= 1;
    } else {
      cart.splice(index, 1);
    }
    updateCart();
  }
}

function toggleCart() {
  document.getElementById("cart").classList.toggle("active");
}

function checkout() {
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  if (total === 0) {
    alert("Keranjang masih kosong. Tambahkan produk terlebih dahulu.");
    return;
  }
  document.getElementById("customer-modal").style.display = "flex";
}

function closeCustomerModal() {
  document.getElementById("customer-modal").style.display = "none";
}

function proceedToPayment(event) {
  event.preventDefault();
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  document.getElementById("final-total").innerText = formatRupiah(total);
  document.getElementById("customer-modal").style.display = "none";
  document.getElementById("modal").style.display = "flex";
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}

function pay() {
  if (cart.length === 0) {
    alert("Keranjang kosong, tidak ada pembayaran yang dilakukan.");
    closeModal();
    return;
  }

  const name = document.getElementById("customer-name").value;
  const phone = document.getElementById("customer-phone").value;
  const email = document.getElementById("customer-email").value;
  const address = document.getElementById("customer-address").value;
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  
  alert(`Pesanan berhasil dibuat! 🎉\n\n` +
    `Nama: ${name}\n` +
    `HP: ${phone}\n` +
    `Total: Rp ${formatRupiah(total)}\n\n` +
    `Pesanan akan dikirim ke alamat Anda. Terima kasih telah berbelanja di Sus Cookies!`);
  
  cart = [];
  document.getElementById("customer-form").reset();
  updateCart();
  closeModal();
}

window.addEventListener("click", event => {
  const paymentModal = document.getElementById("modal");
  const customerModal = document.getElementById("customer-modal");
  if (event.target === paymentModal) {
    closeModal();
  }
  if (event.target === customerModal) {
    closeCustomerModal();
  }
});

displayProducts();

