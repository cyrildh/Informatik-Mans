class HeaderComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                @import '../public/variables.css';

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
                }

                nav a {
                    text-decoration: none;
                    color: var(--text-color);
                    margin: 0 10px;
                    font-size: 1.2rem;
                    transition: color 0.3s, transform 0.3s;
                }

                nav a:hover {
                    color: var(--color-button);
                    transform: scale(1.1);
                }

                .menu-toggle {
                    display: none;
                    flex-direction: column;
                    cursor: pointer;
                    transition: transform 0.3s;
                }

                .menu-toggle span {
                    width: 25px;
                    height: 3px;
                    background-color: var(--text-color);
                    margin: 4px 0;
                    transition: all 0.3s ease;
                }

                @media (max-width: 768px) {
                    nav {
                        display: none;
                        flex-direction: column;
                        position: absolute;
                        top: 60px;
                        right: 0;
                        background-color: var(--primary-color);
                        width: 100%;
                        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                        transition: display 0.3s ease, opacity 0.3s ease;
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
                        
                    }
                    
                    .menu-toggle.active span:nth-child(2) {
                        opacity: 0;
                    }
                    
                    .menu-toggle.active span:nth-child(3) {
                        transform: rotate(-45deg) translate(5px, -5px);
                    }
                    
                    nav.active {
                        display: flex;
                        opacity: 1;
                    }
                }
            </style>
            <div class="header-container">
                <a href="index.html">
                    <img src="img/logo.png" alt="Logo de Mon Site Web" class="logo" />
                </a>
                <div class="menu-toggle" aria-label="Menu Toggle">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <nav role="navigation">
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
    }

    toggleMenu() {
        const menuToggle = this.shadowRoot.querySelector('.menu-toggle');
        const nav = this.shadowRoot.querySelector('nav');

        menuToggle.classList.toggle('active');
        nav.classList.toggle('active');
    }
}

customElements.define('header-component', HeaderComponent);

document.addEventListener('DOMContentLoaded', () => {
    const headerComponent = document.querySelector('header-component');
    if (headerComponent) {
        // Initialize the header component if needed
    }
});
