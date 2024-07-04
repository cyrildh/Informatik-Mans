class HeaderComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
@import '../public/variables.css';

:host {
    --header-height: 60px;
    --menu-max-height: 300px;
}

.header-container {
    display: flex;
    justify-content: space-around;
    align-items: center;
    background-color: var(--primary-color);
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 100;
    padding: 0.5rem 1rem;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.logo {
    width: 5rem;
    z-index: 100;
}

nav {
    display: flex;
    align-items: center;
    transition: max-height 0.3s ease;
    overflow: hidden;
    max-height: 2rem;
}

nav a {
    text-decoration: none;
    color: var(--text-color);
    margin: 0 10px;
    font-size: 1.2rem;
    transition: color 0.3s, transform 0.3s;
}

nav a:hover, nav a.active {
    color: var(--color-button);
    transform: scale(1.1);
}

.menu-toggle {
    display: none;
    flex-direction: column;
    cursor: pointer;
    transition: transform 0.3s;
    z-index: 101; /* Ensure it's above other elements */
    width: 30px; /* Ensure the toggle has a consistent width */
    height: 24px; /* Adjust the height for better alignment */
    justify-content: space-between; /* Space bars evenly */
}

.menu-toggle span {
    width: 100%;
    height: 3px;
    background-color: var(--text-color);
    transition: all 0.3s ease;
}

@media (max-width: 768px) {
    nav {
        flex-direction: column;
        position: absolute;
        top: 6rem; /* Adjust based on the header height */
        right: 0;
        background-color: var(--primary-color);
        width: 100%;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        max-height: 0;
    }

    nav a {
        margin: 10px 0;
        font-size: 1.5rem;
    }

    .menu-toggle {
        display: flex;
    }

    .menu-toggle.active span:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
        background-color: var(--color-button); /* Change color for better visibility */
    }

    .menu-toggle.active span:nth-child(2) {
        opacity: 0;
    }

    .menu-toggle.active span:nth-child(3) {
        transform: rotate(-45deg) translate(5px, -5px);
        background-color: var(--color-button); /* Change color for better visibility */
    }

    nav.active {
        max-height: var(--menu-max-height);
    }
}

            </style>
            <div class="header-container">
                <a href="index.html">
                    <img src="img/logo.png" alt="Logo de Mon Site Web" class="logo" />
                </a>
                <div class="menu-toggle" aria-label="Menu Toggle" aria-expanded="false" aria-controls="navigation-menu">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <nav id="navigation-menu" role="navigation">
                    <a href="index.html" aria-label="Accueil">Accueil</a>
                    <a href="about.html" aria-label="À propos">À propos</a>
                    <a href="services.html" aria-label="Services">Services</a>
                    <a href="blog.html" aria-label="Blog">Blog</a>
                    <a href="contact.html" aria-label="Contact">Contact</a>
                </nav>
            </div>
        `;

        // Adding event listeners after the DOM is loaded
        this.shadowRoot.querySelector('.menu-toggle').addEventListener('click', () => {
            this.toggleMenu();
        });

        this.updateActiveLink();
    }

    toggleMenu() {
        const menuToggle = this.shadowRoot.querySelector('.menu-toggle');
        const nav = this.shadowRoot.querySelector('nav');
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';

        menuToggle.classList.toggle('active');
        nav.classList.toggle('active');
        menuToggle.setAttribute('aria-expanded', !isExpanded);
    }

    updateActiveLink() {
        const currentPath = window.location.pathname;
        const navLinks = this.shadowRoot.querySelectorAll('nav a');

        navLinks.forEach(link => {
            if (link.getAttribute('href') === currentPath) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
}

customElements.define('header-component', HeaderComponent);

document.addEventListener('DOMContentLoaded', () => {
    const headerComponent = document.querySelector('header-component');
    if (headerComponent) {
        // Initialize the header component if needed
    }
});
