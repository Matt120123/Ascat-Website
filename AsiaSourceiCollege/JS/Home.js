
let fadeOutTimeout;

function toggleSearch() {
    const searchDropdown = document.getElementById('search-dropdown');
    if (searchDropdown.classList.contains('hidden')) {
        searchDropdown.classList.remove('hidden');
        resetFadeOutTimer();
    } else {
        clearTimeout(fadeOutTimeout);
        searchDropdown.classList.add('hidden');
    }
}

function resetFadeOutTimer() {
    clearTimeout(fadeOutTimeout);
    fadeOutTimeout = setTimeout(() => {
        document.getElementById('search-dropdown').classList.add('hidden');
    }, 5000); 
}

document.getElementById('search-button').addEventListener('click', () => {
    const searchInput = document.getElementById('search-input');
    const searchQuery = searchInput.value.trim().toLowerCase();

    // Redirect to school.html with search query
    window.location.href = `/AsiaSourceiCollege/school.html?search=${searchQuery}`;
});

function redirectToCategory(category) {
    window.location.href = `/AsiaSourceiCollege/school.html?category=${category}`;
}

function redirectToSearch(search) {
    window.location.href = `/AsiaSourceiCollege/school.html?search= `;
}



document.addEventListener('DOMContentLoaded', () => {
    const searchDropdown = document.getElementById('search-dropdown');
    
    // Reset fade out timer on hover
    searchDropdown.addEventListener('mouseover', () => {
        clearTimeout(fadeOutTimeout);
    });

    searchDropdown.addEventListener('mouseout', () => {
        resetFadeOutTimer();
    });
});

// Close search dropdown when clicking outside of it
document.addEventListener('mouseup', (event) => {
    const searchDropdown = document.getElementById('search-dropdown');
    if (!searchDropdown.contains(event.target) && !document.getElementById('search-logo').contains(event.target)) {
        searchDropdown.classList.add('hidden');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const searchIcon = document.getElementById('search-logo'); // Assuming you have an element with id 'search-icon'

    // Function to handle the search logic
    const handleSearch = () => {
        const query = searchInput.value.trim().toLowerCase();
        if (query !== '') {
            window.location.href = `/AsiaSourceiCollege/school.html?search=${query}`;
        } else {
            window.location.href = `/AsiaSourceiCollege/school.html`;
        }
    };

    // Autofocus the search input when the page loads
    if (searchInput) {
        searchInput.focus();
    }

    // Handle 'Enter' key press in the search input
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });

    // Handle search button click
    searchButton.addEventListener('click', () => {
        searchInput.focus(); // Focus the search input
        handleSearch();
    });

    // Handle search icon click
    searchIcon.addEventListener('click', () => {
        searchInput.focus(); // Focus the search input
    }); });



