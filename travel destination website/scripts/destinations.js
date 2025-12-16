// Destinations data
const destinations = [
    {
        id: 1,
        name: 'Maldives',
        location: 'Indian Ocean',
        continent: 'asia',
        image: 'images/destinations/tropical_beach_paradise_1765896169344.png',
        price: 1299,
        rating: 4.9,
        reviews: 2300,
        category: 'beach',
        description: 'Experience paradise on Earth with pristine white beaches, crystal-clear waters, and luxurious overwater bungalows.',
        badge: 'Popular'
    },
    {
        id: 2,
        name: 'Swiss Alps',
        location: 'Switzerland',
        continent: 'europe',
        image: 'images/destinations/mountain_landscape_scenic_1765896261587.png',
        price: 1899,
        rating: 4.8,
        reviews: 1800,
        category: 'mountain',
        description: 'Discover majestic mountain peaks, charming villages, and world-class skiing in the heart of Europe.',
        badge: 'Adventure'
    },
    {
        id: 3,
        name: 'Prague',
        location: 'Czech Republic',
        continent: 'europe',
        image: 'images/destinations/cultural_city_historic_1765896351914.png',
        price: 899,
        rating: 4.7,
        reviews: 2100,
        category: 'city',
        description: 'Step into a fairy tale with medieval architecture, romantic streets, and rich cultural heritage.',
        badge: 'Cultural'
    },
    {
        id: 4,
        name: 'Bali Waterfalls',
        location: 'Indonesia',
        continent: 'asia',
        image: 'images/destinations/adventure_waterfall_jungle_1765896450605.png',
        price: 1099,
        rating: 4.6,
        reviews: 1500,
        category: 'nature',
        description: 'Explore lush jungles, cascading waterfalls, and spiritual temples in this tropical paradise.',
        badge: 'Nature'
    },
    {
        id: 5,
        name: 'Dubai Desert',
        location: 'United Arab Emirates',
        continent: 'asia',
        image: 'images/destinations/desert_safari_sunset_1765896517954.png',
        price: 1499,
        rating: 4.7,
        reviews: 1900,
        category: 'desert',
        description: 'Experience the magic of the Arabian desert with thrilling safaris, luxury resorts, and stunning sunsets.',
        badge: 'Luxury'
    },
    {
        id: 6,
        name: 'Iceland',
        location: 'Nordic Region',
        continent: 'europe',
        image: 'images/destinations/northern_lights_winter_1765896601876.png',
        price: 1699,
        rating: 4.9,
        reviews: 2200,
        category: 'nature',
        description: 'Witness the mesmerizing northern lights, explore glaciers, and relax in geothermal hot springs.',
        badge: 'Unique'
    }
];

let filteredDestinations = [...destinations];
let currentFilter = 'all';
let currentSort = 'popular';

// DOM elements
const searchInput = document.getElementById('search-input');
const destinationsGrid = document.getElementById('destinations-grid');
const filterButtons = document.querySelectorAll('.filter-btn');
const sortSelect = document.getElementById('sort-select');
const resultsCount = document.getElementById('results-count');

// Initialize
document.addEventListener('DOMContentLoaded', function () {
    renderDestinations();
    setupEventListeners();
});

// Event listeners
function setupEventListeners() {
    // Search
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }

    // Filters
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.dataset.filter;
            applyFiltersAndSort();
        });
    });

    // Sort
    if (sortSelect) {
        sortSelect.addEventListener('change', function () {
            currentSort = this.value;
            applyFiltersAndSort();
        });
    }
}

// Search handler
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();

    filteredDestinations = destinations.filter(dest => {
        return dest.name.toLowerCase().includes(searchTerm) ||
            dest.location.toLowerCase().includes(searchTerm) ||
            dest.description.toLowerCase().includes(searchTerm);
    });

    applyFiltersAndSort();
}

// Apply filters and sorting
function applyFiltersAndSort() {
    let results = [...filteredDestinations];

    // Apply category filter
    if (currentFilter !== 'all') {
        results = results.filter(dest => dest.category === currentFilter);
    }

    // Apply sorting
    switch (currentSort) {
        case 'price-low':
            results.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            results.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            results.sort((a, b) => b.rating - a.rating);
            break;
        case 'popular':
        default:
            results.sort((a, b) => b.reviews - a.reviews);
            break;
    }

    renderDestinations(results);
    updateResultsCount(results.length);
}

// Render destinations
function renderDestinations(destinationsToRender = destinations) {
    if (!destinationsGrid) return;

    if (destinationsToRender.length === 0) {
        destinationsGrid.innerHTML = `
      <div class="no-results">
        <div class="no-results-icon">🔍</div>
        <h3>No destinations found</h3>
        <p>Try adjusting your search or filters</p>
      </div>
    `;
        return;
    }

    destinationsGrid.innerHTML = destinationsToRender.map(dest => `
    <div class="destination-card fade-in">
      <img src="${dest.image}" alt="${dest.name}" class="card-image" loading="lazy">
      <div class="card-badge">${dest.badge}</div>
      <div class="card-content">
        <h3 class="card-title">${dest.name}</h3>
        <div class="card-location">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          ${dest.location}
        </div>
        <p class="card-description">${dest.description}</p>
        <div class="card-footer">
          <span class="card-price">From $${dest.price.toLocaleString()}</span>
          <div class="card-rating">
            ⭐ ${dest.rating} (${(dest.reviews / 1000).toFixed(1)}k)
          </div>
        </div>
        <a href="destination-detail.html?id=${dest.id}" class="btn btn-primary mt-md" style="width: 100%;">
          Explore Destination
        </a>
      </div>
    </div>
  `).join('');

    // Re-observe for animations
    document.querySelectorAll('.fade-in').forEach(el => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });
        observer.observe(el);
    });
}

// Update results count
function updateResultsCount(count) {
    if (resultsCount) {
        resultsCount.textContent = `Showing ${count} destination${count !== 1 ? 's' : ''}`;
    }
}
