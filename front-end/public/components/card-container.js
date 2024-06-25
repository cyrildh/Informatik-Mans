class CardContainer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes() {
        return ['cardTitle', 'cardDescription', 'imageUrl', 'mode', 'layout', 'imageSize', 'transformStyle', 'backgroundColor', 'textColor', 'hoverAnimation', 'linkUrl', 'active', 'buttonText', 'buttonAction', 'icon', 'borderRadius', 'boxShadow', 'imagePosition'];
    }

    get cardTitle() {
        return this.getAttribute('cardTitle');
    }

    get cardDescription() {
        return this.getAttribute('cardDescription');
    }

    get imageUrl() {
        return this.getAttribute('imageUrl');
    }

    get mode() {
        return this.getAttribute('mode');
    }

    get layout() {
        return this.getAttribute('layout') || 'top';
    }

    get imageSize() {
        return this.getAttribute('imageSize') || '100%';
    }

    get transformStyle() {
        return this.getAttribute('transformStyle') || 'none';
    }

    get backgroundColor() {
        return this.getAttribute('backgroundColor') || 'var(--secondary-color)';
    }

    get textColor() {
        return this.getAttribute('textColor') || 'var(--primary-color)';
    }

    get hoverAnimation() {
        return this.getAttribute('hoverAnimation') || 'none';
    }

    get linkUrl() {
        return this.getAttribute('linkUrl');
    }

    get active() {
        return this.hasAttribute('active');
    }

    get buttonText() {
        return this.getAttribute('buttonText');
    }

    get buttonAction() {
        return this.getAttribute('buttonAction');
    }

    get icon() {
        return this.getAttribute('icon');
    }

    get borderRadius() {
        return this.getAttribute('borderRadius') || '20px';
    }

    get boxShadow() {
        return this.getAttribute('boxShadow') || '0 4px 8px rgba(0, 0, 0, 0.1)';
    }

    get imagePosition() {
        return this.getAttribute('imagePosition') || 'top';
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this.render();
    }

    connectedCallback() {
        this.render();
    }

    handleButtonClick() {
        if (this.buttonAction) {
            eval(this.buttonAction);
        }
    }

    render() {
        const isHorizontal = this.layout === 'left' || this.layout === 'right';
        const transformStyle = this.transformStyle;
        const linkWrapperStart = this.linkUrl ? `<a href="${this.linkUrl}" class="card-link">` : '';
        const linkWrapperEnd = this.linkUrl ? '</a>' : '';
        const buttonHTML = this.buttonText ? `<button onclick="${this.buttonAction}">${this.buttonText}</button>` : '';
        const iconHTML = this.icon ? `<img src="${this.icon}" alt="Icon" class="card-icon">` : '';

        this.shadowRoot.innerHTML = `
        ${linkWrapperStart}
        <div class="card ${this.active ? 'active' : ''}" style="border-radius: ${this.borderRadius}; box-shadow: ${this.boxShadow};">
            <div class="card-content ${isHorizontal ? 'horizontal' : 'vertical'}">
                ${this.imagePosition === 'top' || this.imagePosition === 'left' ? `
                <div class="card-composant">
                    <h1>${this.cardTitle}</h1>
                    <img src="${this.imageUrl}" alt="Image descriptive" class="card-img" style="width: ${this.imageSize};">
                    ${iconHTML}
                </div>
                ` : ''}
                <div class="card-description">
                    <slot></slot>
                </div>
                ${this.imagePosition === 'bottom' || this.imagePosition === 'right' ? `
                <div class="card-composant">
                    <h1>${this.cardTitle}</h1>
                    <img src="${this.imageUrl}" alt="Image descriptive" class="card-img" style="width: ${this.imageSize};">
                    ${iconHTML}
                </div>
                ` : ''}
            </div>
            ${buttonHTML}
        </div>
        ${linkWrapperEnd}
        <style>
        @import '../public/variables.css';
        @import '../public/style.css';

        :host {
            display: block;
            position: relative;
            margin: 2rem auto;
            width: 90%;
            max-width: 1200px;
            padding: 1rem;
            box-sizing: border-box;
        }

        .card {
            display: flex;
            flex-direction: column;
            width: 100%;
            background: ${this.backgroundColor};
            color: ${this.textColor};
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            overflow: hidden;
            height: 100%;
            transform: ${transformStyle};
        }

        .card.active {
            border: 2px solid var(--color-button);
        }

        .card:hover {
            ${this.hoverAnimation};
        }

        .card-link {
            text-decoration: none;
            color: inherit;
        }

        .card-img {
            object-fit: cover;
            width: ${this.imageSize};
            height: auto;
            border-radius: ${this.borderRadius};
        }

        .card-icon {
            width: 40px;
            height: 40px;
            margin-top: 10px;
        }

        .card-content {
            padding: 1rem;
            display: flex;
            align-items: center;
            justify-content: space-evenly;
        }

        .card-content.horizontal {
            flex-direction: row;
        }

        .card-content.vertical {
            flex-direction: column;
        }

        .card-composant {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            gap: 1rem;
        }

        button {
            padding: 0.8em;
            margin-top: 1em;
            border: none;
            border-radius: 1rem;
            background-color: var(--color-button);
            color: white;
            font-size: 1rem;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }

        button:hover {
            background-color: var(--color-button-hover);
        }

        @media (max-width: 768px) {
            :host {
                margin: 1rem;
                width: auto;
                padding: 0.5rem;
            }

            .card-content.horizontal {
                flex-direction: column;
            }

            .card-img {
                width: 100%;
                height: auto;
            }

            .card {
                width: 100%;
                transform: translateY(0%);
            }
        }

        @media (max-width: 480px) {
            .card {
                transform: translateY(0%);
            }
        }
        </style>
        `;
    }
}

customElements.define('card-container', CardContainer);
