const BASE_URL = "/api";
let calorieChart = null;

/* ---------------- NAVIGATION ---------------- */
function goPage(page) {
    window.location.href = page;
}

/* ---------------- ZIPCODE INPUT VALIDATION ---------------- */
const zip = document.getElementById("zipcode");

if (zip) {
    zip.addEventListener("input", () => {
        zip.value = zip.value.replace(/\D/g, "").slice(0, 5);
    });
}

/* =========================================================
   1. FETCH #1 → Kroger + Supabase (MAIN SEARCH FUNCTION)
   ========================================================= */

const searchBtn = document.getElementById("searchBtn");

if (searchBtn) {
    searchBtn.onclick = async () => {
        const zip = document.getElementById("zipcode").value;
        const item = document.getElementById("zitem").value;
        const category = document.getElementById("categoryFilter").value;

        if (!zip || !item) {
            document.getElementById("storeResults").innerHTML =
                "Please enter both zipcode and item.";
            return;
        }

        const res = await fetch(
            `${BASE_URL}/fetch-and-save?zipcode=${zip}&item=${encodeURIComponent(item)}&category=${encodeURIComponent(category)}`
        );

        const data = await res.json();
        let products = data.products || [];

        // FILTERS
        if (category === "Organic") {
            products = products.filter(p =>
                p.category?.toLowerCase().includes("organic")
            );
        }

        if (category === "nutritious") {
            products = [...products].sort(
                (a, b) => (b.nutritional_rating || 0) - (a.nutritional_rating || 0)
            );
        }

        document.getElementById("storeResults").innerHTML =
            products.map(p => `
                <div>
                    <h3>${p.item_name}</h3>
                    <p><b>Brand:</b> ${p.brand}</p>
                    <p><b>Category:</b> ${p.category}</p>
                    <p><b>Calories:</b> ${p.calories ?? "N/A"}</p>
                    <p><b>Nutrition Score:</b> ${p.nutritional_rating ?? "N/A"}</p>
                </div>
            `).join("");
    };
}

/* =========================================================
   2. FETCH #2 → Ratings (Supabase products)
   ========================================================= */

const rateBtn = document.getElementById("rateBtn");

if (rateBtn) {
    rateBtn.onclick = async () => {
        const item = document.getElementById("item").value.toLowerCase();

        const res = await fetch(`${BASE_URL}/products`);
        const data = await res.json();

        const safeData = Array.isArray(data) ? data : [];

        const filtered = safeData.filter(r =>
            r.item_name?.toLowerCase().includes(item)
        );

        document.getElementById("ratingResults").innerHTML =
            filtered.map(r => `
                <div>
                    <h3>${r.item_name || "Unknown Item"}</h3>
                    <p><b>Brand:</b> ${r.brand || "Unknown"}</p>
                    <p><b>Rating:</b> ⭐ ${r.rating ?? "No rating"}</p>
                </div>
            `).join("");
    };
}

/* =========================================================
   3. FETCH #3 → Nutrition (Supabase products)
   ========================================================= */

const nutritionBtn = document.getElementById("nutritionBtn");

if (nutritionBtn) {
    nutritionBtn.onclick = async () => {
        const item = document.getElementById("nitem").value.toLowerCase();

        const res = await fetch(`${BASE_URL}/products`);
        const data = await res.json();

        const safeData = Array.isArray(data) ? data : [];

        const filtered = safeData.filter(p =>
            p.item_name?.toLowerCase().includes(item)
        );

        document.getElementById("nutritionResults").innerHTML =
            filtered.map(p => `
                <div>
                    <h3>${p.item_name}</h3>
                    <p>Calories: ${p.calories ?? "N/A"}</p>
                    <p>Sugar: ${p.sugar ?? "N/A"}g</p>
                    <p>Saturated Fat: ${p.saturated_fat ?? "N/A"}g</p>
                </div>
            `).join("");
    };
}

/* =========================================================
   CHART (Chart.js Library #1)
   ========================================================= */

async function loadChart() {
    const res = await fetch(`${BASE_URL}/products`);
    const data = await res.json();

    const safeData = Array.isArray(data) ? data : [];

    const bread = safeData
        .filter(p => p.item_name?.toLowerCase().includes("bread"))
        .filter(p => (p.calories || 0) <= 200);

    const labels = bread.map(b => b.item_name);
    const calories = bread.map(b => b.calories || 0);

    const ctx = document.getElementById("calorieChart");

    if (!ctx) return;

    // 🔥 destroy old chart
    if (calorieChart) {
        calorieChart.destroy();
    }

    calorieChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels,
            datasets: [{
                label: "Calories in Bread",
                data: calories
            }]
        }
    });
}

/* =========================================================
   QUESTIONS (FETCH #4 technically optional extra)
   ========================================================= */

async function loadQuestions() {
    const box = document.getElementById("infoQuestions");
    if (!box) return;

    const res = await fetch(`${BASE_URL}/question`);
    const data = await res.json();

    if (!Array.isArray(data)) return;

    data.forEach(q => {
        const btn = document.createElement("button");
        btn.innerText = q.question;
        btn.className = "btn question-btn";

        btn.onclick = () => {
            const answerBox = document.getElementById("questionAnswer");
            answerBox.style.display = "block";
            answerBox.innerText = q.answer;
        };

        box.appendChild(btn);
    });
}

/* =========================================================
   IMAGE SLIDER (Library #2 - Swiper)
   ========================================================= */

function loadSlides() {

    const images1 = ["images/fixed.png", "images/org.png.png", "images/nut.png.png", "images/noneent.png"];
    const images2 = ["images/rating1.png.png", "images/rating2.png.png"];
    const images3 = ["images/last111.png.png", "images/last1.png.png"];
    const images4 = ["images/about.png", "images/about1.png", "images/about2.png", "images/about3.png", "images/about4.png"];

    document.getElementById("slides").innerHTML =
        images1.map(img => `<div class="swiper-slide"><img src="${img}" style="width:100%"></div>`).join("");

    document.getElementById("slides1").innerHTML =
        images2.map(img => `<div class="swiper-slide"><img src="${img}" style="width:100%"></div>`).join("");

    document.getElementById("slides2").innerHTML =
        images3.map(img => `<div class="swiper-slide"><img src="${img}" style="width:100%"></div>`).join("");

    document.getElementById("slides3").innerHTML =
        images4.map(img => `<div class="swiper-slide"><img src="${img}" style="width:100%"></div>`).join("");

    new Swiper(".swiper", {
        loop: true,
        pagination: {
            el: ".swiper-pagination",
            clickable: true
        },
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev"
        }
    });
}

/* =========================================================
   AUTO INIT
   ========================================================= */

if (document.getElementById("slides")) loadSlides();
if (document.getElementById("infoQuestions")) loadQuestions();
if (document.getElementById("calorieChart")) loadChart();
