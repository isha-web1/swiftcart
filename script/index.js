
        // On Load

        window.onload = () => {
            fetchCategories();
            loadProducts('all');
        };

        //  Load Categories Dynamically

        async function fetchCategories() {
            const container = document.getElementById('category-container');
            try {
                const res = await fetch('https://fakestoreapi.com/products/categories');
                const categories = await res.json();
                categories.forEach(cat => {
                    const btn = document.createElement('button');
                    btn.className = 'btn btn-sm md:btn-md btn-outline btn-primary rounded-full capitalize';
                    btn.innerText = cat;
                    btn.onclick = () => loadProducts(cat);
                    container.appendChild(btn);
                });
            } catch (e) { console.error("Error fetching categories", e); }
        }

        //  Load Products (All or Filtered)

        async function loadProducts(category) {
            const grid = document.getElementById('products-grid');
            const spinner = document.getElementById('loading-spinner');
            
            grid.innerHTML = '';
            spinner.classList.remove('hidden');

            const url = category === 'all' 
                ? 'https://fakestoreapi.com/products' 
                : `https://fakestoreapi.com/products/category/${category}`;

            try {
                const res = await fetch(url);
                const products = await res.json();
                spinner.classList.add('hidden');
                
                products.forEach(product => {
                    grid.innerHTML += createProductCard(product);
                });
            } catch (e) { console.error("Error fetching products", e); }
        }

        //  Create Product Card UI

        function createProductCard(p) {
            const stars = generateStars(p.rating.rate);
            return `
                <div class="card bg-base-100 shadow-xl border border-base-300 hover:shadow-2xl transition-all duration-300 group">
                    <figure class="p-6 bg-white h-52 relative">
                        <img src="${p.image}" alt="${p.title}" class="h-full object-contain group-hover:scale-105 transition-transform" />
                        <div class="absolute top-2 right-2">
                             <span class="badge badge-ghost font-semibold text-[10px] uppercase tracking-tighter">${p.category}</span>
                        </div>
                    </figure>
                    <div class="card-body p-5">
                        <h2 class="card-title text-sm font-bold line-clamp-1 h-6" title="${p.title}">${p.title}</h2>
                        <div class="flex items-center gap-2 mb-2">
                            <div class="flex text-orange-400 text-xs">${stars}</div>
                            <span class="text-[10px] opacity-60">(${p.rating.count})</span>
                        </div>
                        <p class="text-xl font-black text-primary">$${p.price.toFixed(2)}</p>
                        <div class="card-actions grid grid-cols-2 gap-2 mt-4">
                            <button onclick="showDetails(${p.id})" class="btn btn-outline btn-sm rounded-md">Details</button>
                            <button onclick="updateCart()" class="btn btn-primary btn-sm rounded-md">
                                <i class="fa-solid fa-cart-plus"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }

        //  Star Rating Visualizer

        function generateStars(rating) {
            let stars = '';
            for (let i = 1; i <= 5; i++) {
                stars += `<i class="fa-${i <= Math.round(rating) ? 'solid' : 'regular'} fa-star"></i>`;
            }
            return stars;
        }

        

        //  Cart Counter Logic

        let cartCount = 0;
        function updateCart() {
            cartCount++;
            document.getElementById('cart-count').innerText = cartCount;
        }