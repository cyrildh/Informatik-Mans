class FooterComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
<footer>
    <div class="footer-content">
        <div class="footer-section contact-info">
            <h3>Contactez-nous</h3>
            <p>Email : caty.barberini@informatikmans.org</p>
        </div>
        <div class="footer-section footer-links">
            <h3>Liens utiles</h3>
            <div><a href="../pages/politique.html">Politique de confidentialité</a></div>
            <div><a href="../pages/condition.html">Conditions d'utilisation</a></div>
        </div>
        <div class="footer-section social-media-links">
            <h3>Suivez-nous</h3>
            <a href="https://www.facebook.com/InformatikMans?locale=fr_FR"><img src="assets/img/facebook.png" alt="Facebook"/></a>
            <a href="https://x.com/InformatikMans?t=fthZt9gbCk01BTT4Aa_QAA&s=07"><img src="assets/img/x.webp" alt="X"/></a>
            <a href="https://www.instagram.com/informatikmans/"><img src="assets/img/Instagram_icon.png" alt="Instagram"/></a>
            <a href="https://www.linkedin.com/company/informatik-mans/about/"><img src="assets/img/LinkedIn.png" alt="LinkedIn"/></a>
        </div>
    </div>
</footer>
<style>
    @import 'variables.css';
    footer {
        background-color: var(--primary-color);
        color: var(--text-color);
        padding: 15px 0;
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
        padding: 0 10px;
    }
    .footer-section {
        flex: 1;
        margin: 10px;
        min-width: 150px;
    }
    .footer-section h3 {
        margin-bottom: 10px;
        border-bottom: 2px solid var(--secondary-color);
        padding-bottom: 5px;
    }
    .footer-section p, .footer-section a, .footer-section div {
        margin: 5px 0;
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
        margin: 0 5px;
        transition: transform 0.3s;
    }
    .social-media-links a:hover {
        transform: scale(1.1);
    }
    .social-media-links img {
        width: 1.5rem;
        height: 1.5rem;
        vertical-align: middle;
    }

    /* Mobile styles */
    @media (max-width: 480px) {
        .footer-content {
            flex-direction: column;
            align-items: center;
        }
        .footer-content-mobile-row {
            display: flex;
            justify-content: space-between;
            width: 100%;
        }
        .footer-section {
            margin: 5px 0;
            text-align: center;
        }
        .footer-section h3 {
            font-size: 0.9rem;
        }
        .footer-section p, .footer-section a {
            font-size: 0.8rem;
        }
        .social-media-links img {
            width: 1.7rem;
            height: 1.7rem;
        }
    }
</style>
`;
    }
}

customElements.define('footer-component', FooterComponent);
