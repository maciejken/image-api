export default class AppThumbnail extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'open' });
    const template = document.createElement('template');
    template.innerHTML = `
      <figure class="thumb">
        <img loading="lazy">
      </figure>
      
      <style>
        @import url(styles/reset.css);
        
        .thumb {
          margin: .25em 0 0 .25em;
          width: 200px;
          height: 200px;
        }
      </style>
    `;
    shadowRoot.appendChild(template.content.cloneNode(true));

    this.image = shadowRoot.querySelector('img');
  }
  
  connectedCallback() {
    //
  }

  static get observedAttributes() {
    return ['source'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.image.setAttribute('src', newValue);
  }

  // instance methods

  disconnectedCallback() {
    //
  }
}
