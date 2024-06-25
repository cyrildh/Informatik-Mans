class FooterComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
<footer>
    <div class="footer-content">
        <div class="footer-section contact-info">
            <h3>Contactez-nous</h3>
            <p>Téléphone : +33 1 23 45 67 89</p>
            <p>Email : contact@monsite.com</p>
        </div>
        <div class="footer-section footer-links">
            <h3>Liens utiles</h3>
            <a href="#privacy">Politique de confidentialité</a>
            <a href="#terms">Conditions d'utilisation</a>
            <a href="#faq">FAQ</a>
        </div>
        <div class="footer-section social-media-links">
            <h3>Suivez-nous</h3>
            <a href="https://facebook.com"><img src="img/facebook.png" alt="Facebook"/></a>
            <a href="https://twitter.com"><img src="img/twitter.png" alt="Twitter"/></a>
            <!-- <a href="https://instagram.com"><img src="img/insta.jpg" alt="Instagram"/></a> -->
        </div>
    </div>
</footer>
<style>
    @import 'variables.css';
    footer {
        background-color: var(--primary-color);
        color: var(--text-color);
        padding: 40px 0;
        font-family: var(--font-family), sans-serif;
        width: 100%;
        box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
    }
    .footer-content {
        display: flex;
        justify-content: space-around;
        flex-wrap: wrap;
        max-width: 1200px;
        margin: auto;
        padding: 0 20px;
    }
    .footer-section {
        flex: 1;
        margin: 20px;
        min-width: 250px;
    }
    .footer-section h3 {
        margin-bottom: 20px;
        font-size: 1.2rem;
        border-bottom: 2px solid var(--secondary-color);
        padding-bottom: 10px;
    }
    .footer-section p, .footer-section a {
        margin: 10px 0;
        font-size: 1rem;
    }
    .footer-links a {
        color: var(--text-color);
        text-decoration: none;
        transition: color 0.3s;
    }
    .footer-links a:hover {
        color: var(--highlight-color);
    }
    .social-media-links a {
        display: inline-block;
        margin: 0 10px;
        transition: transform 0.3s;
    }
    .social-media-links a:hover {
        transform: scale(1.1);
    }
    .social-media-links img {
        width: 2rem;
        height: 2rem;
        vertical-align: middle;
    }
    @media (max-width: 768px) {
        .footer-content {
            flex-direction: column;
            align-items: center;
        }
        .footer-section {
            margin: 10px 0;
            text-align: center;
        }
        .social-media-links a {
            margin: 0 5px;
        }
    }
</style>
`;
    }
}

customElements.define('footer-component', FooterComponent);
