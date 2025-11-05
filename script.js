// -----------------------------
// RentItAll Data
// -----------------------------
const allItems = [
  { title: "Honda City Car", category: "Cars", price: 2000, image: "Honda_City.jpg" },
  { title: "Maruti Swift", category: "Cars", price: 1700, image: "maruti.jpg" },
  { title: "Power Drill", category: "Tools", price: 300, image: "powerdrill.webp" },
  { title: "DSLR Camera", category: "Electronics", price: 900, image: "dslr.jpg" },
  { title: "Designer Dress", category: "Clothes", price: 400, image: "dress.webp" },
  { title: "Office Chair", category: "Furniture", price: 250, image: "chair.webp" }
];

// -----------------------------
// Home Page – Featured Items
// -----------------------------
const featuredContainer = document.getElementById('featuredItems');
if (featuredContainer) {
  featuredContainer.innerHTML = allItems.slice(0, 6).map((i, index) => `
    <div class="card item-card" data-index="${index}">
      <img src="${i.image}" alt="${i.title}">
      <h4>${i.title}</h4>
      <p>${i.category} — ₹${i.price}/day</p>
      <button class="view-btn">View Details</button>
    </div>
  `).join('');

  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const card = e.target.closest(".item-card");
      const index = card.getAttribute('data-index');
      localStorage.setItem('selectedItem', JSON.stringify(allItems[index]));
      window.location.href = 'items.html';
    });
  });
}

// -----------------------------
// Category Clicks
// -----------------------------
document.querySelectorAll('.category').forEach(cat => {
  cat.addEventListener('click', () => {
    localStorage.setItem('selectedCategory', cat.dataset.category);
    window.location.href = 'items.html';
  });
});

// -----------------------------
// Search Functionality
// -----------------------------
const searchBox = document.getElementById("searchBox");
if (searchBox) {
  searchBox.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      const query = searchBox.value.trim().toLowerCase();
      if (!query) return;

      const userItems = JSON.parse(localStorage.getItem("userItems") || "[]");
      const itemsToSearch = [...allItems, ...userItems];

      const searchResults = itemsToSearch.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
      );

      if (searchResults.length > 0) {
        localStorage.setItem("searchResults", JSON.stringify(searchResults));
        window.location.href = "items.html";
      } else {
        alert(`❌ No items found for "${query}"`);
      }
    }
  });
}

// -----------------------------
// Items Page – Display logic
// -----------------------------
const itemList = document.getElementById('itemList');
if (itemList) {
  const selectedCategory = localStorage.getItem('selectedCategory');
  const selectedItem = JSON.parse(localStorage.getItem('selectedItem') || 'null');
  const searchResults = JSON.parse(localStorage.getItem('searchResults') || 'null');
  const titleElement = document.getElementById('pageTitle');

  const userItems = JSON.parse(localStorage.getItem("userItems") || "[]");
  let itemsToShow = [...allItems, ...userItems];

  if (searchResults) {
    itemsToShow = searchResults;
    titleElement.textContent = "Search Results";
    localStorage.removeItem("searchResults");
  } else if (selectedCategory) {
    itemsToShow = itemsToShow.filter(i => i.category === selectedCategory);
    titleElement.textContent = `${selectedCategory} for Rent`;
  } else if (selectedItem) {
    itemsToShow = [selectedItem];
    titleElement.textContent = selectedItem.title;
    document.querySelector('.grid').classList.add('single-item');
  }

  if (itemsToShow.length === 0) {
    itemList.innerHTML = `<p style="text-align:center;margin:2rem;">❌ No items found.</p>`;
  } else {
    itemList.innerHTML = itemsToShow.map((i, index) => {
      const isUserItem = userItems.some(u => u.title === i.title && u.price === i.price);
      return `
        <div class="card item-card" data-index="${index}">
          <img src="${i.image}" alt="${i.title}">
          <h4>${i.title}</h4>
          <p>${i.category} — ₹${i.price}/day</p>
          ${isUserItem
            ? `<button class="delete-btn">🗑️ Remove</button>`
            : `<button class="rent-btn">Rent Now</button>`
          }
        </div>
      `;
    }).join('');
  }

  localStorage.removeItem('selectedCategory');
  localStorage.removeItem('selectedItem');

  // Delete user listing
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const title = e.target.closest('.item-card').querySelector('h4').textContent.trim();
      let userItems = JSON.parse(localStorage.getItem("userItems") || "[]");
      userItems = userItems.filter(item => item.title !== title);
      localStorage.setItem("userItems", JSON.stringify(userItems));
      alert(`🗑️ Your listing "${title}" has been removed.`);
      location.reload();
    });
  });
}

// -----------------------------
// Add Listing Form (with Image Upload)
// -----------------------------
const form = document.getElementById('addForm');
if (form) {
  const imageFileInput = document.getElementById('imageFile');
  const preview = document.getElementById('preview');
  let imageBase64 = "";

  imageFileInput.addEventListener('change', function () {
    const file = this.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      imageBase64 = e.target.result;
      preview.src = imageBase64;
      preview.style.display = "block";
    };
    reader.readAsDataURL(file);
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const title = document.getElementById('title').value.trim();
    const category = document.getElementById('category').value.trim();
    const price = parseInt(document.getElementById('price').value.trim());

    if (!title || !category || !price || !imageBase64) {
      alert("⚠️ Please fill all fields and upload an image.");
      return;
    }

    const newItem = { title, category, price, image: imageBase64 };
    const userItems = JSON.parse(localStorage.getItem("userItems") || "[]");
    userItems.push(newItem);
    localStorage.setItem("userItems", JSON.stringify(userItems));

    alert(`✅ Your listing "${title}" has been added successfully!`);
    form.reset();
    preview.style.display = "none";
    window.location.href = "items.html";
  });
}

// -----------------------------
// Contact Form
// -----------------------------
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    alert('📧 Thank you for contacting us!');
    contactForm.reset();
  });
}

// -----------------------------
// Custom In-App Payment Simulation
// -----------------------------
document.addEventListener("click", function(e) {
  if (e.target.classList.contains("rent-btn")) {
    const itemCard = e.target.closest(".item-card");
    const itemTitle = itemCard.querySelector("h4").textContent;
    const priceText = itemCard.querySelector("p").textContent;
    const priceValue = parseInt(priceText.replace(/[^0-9]/g, ""));

    // Create the modal
    const modal = document.createElement("div");
    modal.classList.add("payment-modal");
    modal.innerHTML = `
      <div class="payment-box">
        <h2>💳 Rent & Pay</h2>
        <p><strong>${itemTitle}</strong> — ₹${priceValue}/day</p>
        <form id="fakePaymentForm">
          <input type="text" id="payName" placeholder="Full Name" required>
          <input type="email" id="payEmail" placeholder="Email" required>
          <input type="text" id="payCard" placeholder="Card Number" maxlength="16" required>
          <div class="row">
            <input type="text" id="payExpiry" placeholder="MM/YY" maxlength="5" required>
            <input type="text" id="payCVV" placeholder="CVV" maxlength="3" required>
          </div>
          <button type="submit" class="pay-confirm">Confirm Payment</button>
          <button type="button" class="pay-cancel">Cancel</button>
        </form>
      </div>
    `;
    document.body.appendChild(modal);

    // Close modal
    modal.querySelector(".pay-cancel").addEventListener("click", () => modal.remove());

    // Handle payment
    modal.querySelector("#fakePaymentForm").addEventListener("submit", e => {
      e.preventDefault();
      modal.querySelector(".pay-confirm").textContent = "Processing...";
      modal.querySelector(".pay-confirm").disabled = true;

      setTimeout(() => {
        // Simulate success
        localStorage.setItem("rentedItem", JSON.stringify({
          title: itemTitle,
          price: priceValue,
          image: itemCard.querySelector("img").src
        }));
        alert("✅ Payment Successful! Your item is booked.");
        modal.remove();
        window.location.href = "success.html";
      }, 1500);
    });
  }
});

// -----------------------------
// Login / Signup / Logout Logic
// -----------------------------
const signupForm = document.getElementById("signupForm");
const loginForm = document.getElementById("loginForm");
const loginLink = document.getElementById("loginLink");
const logoutLink = document.getElementById("logoutLink");

const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
if (loginLink && logoutLink) {
  loginLink.style.display = currentUser ? "none" : "inline-block";
  logoutLink.style.display = currentUser ? "inline-block" : "none";
}

// Signup
if (signupForm) {
  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("signupName").value.trim();
    const email = document.getElementById("signupEmail").value.trim();
    const password = document.getElementById("signupPassword").value.trim();

    if (!name || !email || !password) {
      alert("⚠️ Please fill in all fields.");
      return;
    }

    let users = JSON.parse(localStorage.getItem("users") || "[]");
    if (users.find(u => u.email === email)) {
      alert("⚠️ Email already registered. Please login.");
      window.location.href = "login.html";
      return;
    }

    users.push({ name, email, password });
    localStorage.setItem("users", JSON.stringify(users));
    alert("✅ Signup successful! Please log in.");
    window.location.href = "login.html";
  });
}

// Login
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user));
      alert(`👋 Welcome back, ${user.name}!`);
      window.location.href = "index.html";
    } else {
      alert("❌ Invalid email or password.");
    }
  });
}

// Logout
if (logoutLink) {
  logoutLink.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("currentUser");
    alert("👋 Logged out successfully.");
    window.location.href = "index.html";
  });
}
