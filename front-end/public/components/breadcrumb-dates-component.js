class BreadcrumbDates extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const dates = this.getAttribute('dates').split(',');
        const wrapper = document.createElement('div');
        wrapper.setAttribute('class', 'breadcrumb');

        dates.forEach(date => {
            const dateElement = document.createElement('div');
            dateElement.setAttribute('class', 'date-item');
            dateElement.textContent = new Date(date).toLocaleDateString('fr-FR', {
                day: 'numeric', month: 'long', year: 'numeric'
            });

            const card = document.createElement('div');
            card.setAttribute('class', 'date-card');
            card.textContent = `Détails de l'événement du ${dateElement.textContent}`;

            dateElement.appendChild(card);
            wrapper.appendChild(dateElement);
        });

        this.shadowRoot.appendChild(wrapper);
    }
}

window.customElements.define('breadcrumb-dates', BreadcrumbDates);
