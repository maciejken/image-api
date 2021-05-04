export default class AppFooter extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'open' });
    const template = document.createElement('template');
    template.innerHTML = `
      <footer>
        <div class="nav-item">
          <slot name="view-count"></slot>
        </div>
        <a href="/logout" class="link nav-item">
          Wyloguj się
          <i class="icon icon-sign-out"></i>
        </a>
      </footer>
      
      <style>
        @import url(styles/reset.css);
        @import url(fonts/opensans/opensans.css);
        @import url(icons/icons.css);

        footer {
          background-color: #f1f1ef8c;
          box-sizing: border-box;
          display: flex;
          justify-content: space-between;
          font-family: 'Open Sans', sans-serif;
          font-weight: 400;
        }
        .link {
          text-decoration: none;
        }
        .link:hover {
          text-decoration: underline;
          color: #000;
        }
        .nav-left, .nav-right {
          display: flex;
        }
        .nav-item {
          display: flex;
          align-items: center;
          padding: 1rem;
        }
        .link {
          text-decoration: none;
        }
        .nav-item.link {
          color: #000;
          display: flex;
          justify-content: space-between;
        }
        .nav-item.link:hover, .nav-item.button:hover {
          background-color: #efefef;
          text-decoration: underline;
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
