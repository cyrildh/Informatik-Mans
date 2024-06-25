class CardComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes() {
        return ['cardTitle', 'cardDescription', 'imageUrl', 'backgroundColor', 'transformStyle', 'borderColor', 'borderWidth', 'textColor', 'isClickable', 'zoomEffect'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this.render();
        }
    }

    getAttributeOrDefault(attributeName, defaultValue) {
        return this.getAttribute(attributeName) || defaultValue;
    }

    get isClickable() {
        return this.getAttribute('isClickable') === 'true';
    }

    set isClickable(value) {
        this.setAttribute('isClickable', String(!!value));
    }

    get zoomEffect() {
        return this.getAttribute('zoomEffect') === 'true';
    }

    set zoomEffect(value) {
        this.setAttribute('zoomEffect', String(!!value));
    }

    connectedCallback() {
        this.render();
    }

    render() {
        const href = this.isClickable ? `href="${this.getAttribute('href')}"` : '';

        const transformStyle = this.getAttribute('transformStyle') || 'translateY(-50%)';
        const backgroundColor = this.getAttribute('backgroundColor') || 'white';
        const borderColor = this.getAttribute('borderColor') || '#000';
        const borderWidth = this.getAttribute('borderWidth') || '0px';
        const textColor = this.getAttribute('textColor') || 'white';
        const cursor = this.isClickable ? 'pointer' : 'default';

        const hoverStyle = this.isClickable ? `
            .card:hover {
                transform: ${transformStyle} scale(1.05);
                box-shadow: 0 10px 20px rgba(0, 0, 0, 0.25);
                transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out, background-color 0.3s ease-in-out; /* Smooth transitions */
            }
            .card:hover .card-arrow {
                opacity: 1;
                transform: translateY(-5px); /* Move the arrow slightly for better effect */
                transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out; /* Smooth transitions */
            }
        ` : '';

        this.shadowRoot.innerHTML = `
            <a ${href}>
                <div class="card">
                    <img src="${this.getAttribute('imageUrl')}" alt="${this.getAttribute('cardTitle')}" class="card-img">
                    <div class="card-content">
                      <h3>${this.getAttribute('cardTitle')}</h3>
                      <p>${this.getAttribute('cardDescription')}</p>
                    </div>
                    ${this.isClickable ? '<span class="card-arrow">En savoir plus -></span>' : ''}
                </div>
            </a>
            <style>
                @import '../variables.css';
                .card {
                    border-radius: 1rem;
                    display: inline-block;
                    position: relative;
                    width: 300px;
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                    padding: 20px;
                    text-align: center;
                    height: 350px;
                    margin: 1rem;
                    background-color: ${backgroundColor};
                    border: ${borderWidth} solid ${borderColor};
                    color: ${textColor};
                    cursor: ${cursor};
                    transform: ${transformStyle};
                }
                .card-img {
                    width: 5rem;
                    height: auto;
                    border-radius: var(--border-radius);
                }
                .card-content {
                    padding: 1rem;
                    text-align: center;
                }
                .card-arrow {
                    position: absolute;
                    bottom: 10px;
                    right: 10px;
                    font-size: 1rem;
                    color: ${textColor};
                    opacity: 0;
                    transition: opacity 0.3s ease, transform 0.3s ease;
                }
                ${hoverStyle}
                @media (max-width: 768px) {
                    .card {
                        width: 80%;
                        height: auto;
                        padding: 10px;
                        margin: 0.5rem;
                        transform: translateY(-15%);
                    }
                    .card-img {
                        width: 4rem;
                    }
                    .card-arrow {
                        font-size: 0.8rem;
                    }
                }
                @media (max-width: 480px) {
                    .card {
                        width: 80%;
                        height: auto;
                        padding: 5px;
                        margin: 0.25rem;
                        transform: translateY(0%);
                    }
                    .card-img {
                        width: 3rem;
                    }
                    .card-arrow {
                        font-size: 0.7rem;
                    }
                }
            </style>
        `;
    }
}

customElements.define('card-component', CardComponent);
