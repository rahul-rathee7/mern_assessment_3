const API_URL = "http://localhost:3000/products";

async function loadProducts(searchText = "") {
  let url = API_URL;
  if (searchText) {
    url += "/search?query=" + searchText;
  }

  const response = await fetch(url);
  const products = await response.json();
  showProducts(products);
}

function showProducts(products) {
  const box = document.getElementById("productsContainer");
  box.innerHTML = "";

  products.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <h3>${product.name}</h3>
      <p>Price: ₹${product.price}</p>
      <p>Category: ${product.category}</p>
      <p>${product.description || "No description"}</p>
      <div class="actions">
        <button onclick="editProduct('${product._id}', '${product.name}', ${product.price}, '${product.category}', \`${product.description}\`)">Edit</button>
        <button onclick="deleteProduct('${product._id}')">Delete</button>
      </div>
    `;

    box.appendChild(card);
  });
}

document.getElementById("productForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const form = e.target;
  const isEditing = form.dataset.editing;
  const method = isEditing ? "PUT" : "POST";
  const url = isEditing ? `${API_URL}/${isEditing}` : API_URL;

  const productData = {
    name: document.getElementById("name").value,
    price: document.getElementById("price").value,
    category: document.getElementById("category").value,
    description: document.getElementById("description").value,
  };

  await fetch(url, {
    method: method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(productData)
  });

  form.reset();
  delete form.dataset.editing;
  loadProducts();
});

function editProduct(id, name, price, category, description) {
  document.getElementById("name").value = name;
  document.getElementById("price").value = price;
  document.getElementById("category").value = category;
  document.getElementById("description").value = description;

  document.getElementById("productForm").dataset.editing = id;
  window.scrollTo(0, 0);
}

async function deleteProduct(id) {
  const confirmDelete = confirm("Are you sure you want to delete this product?");
  if (confirmDelete) {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    loadProducts();
  }
}

document.getElementById("search").addEventListener("input", function (e) {
  loadProducts(e.target.value);
});

loadProducts();