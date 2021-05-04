export default class AppHeader extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'open' });
    const template = document.createElement('template');
    template.innerHTML = `
      <header class="header">
        <div class="nav-left">
          <div class="nav-item">
            <slot name="header-greeting">Witaj!</slot>
          </div>
          <div class="nav-item group-list" title="Twoje grupy">
            <slot name="header-groups"></slot>
          </div>
        </div>
        <div class="nav-right">
          <span class="nav-item button header-dropdown-menu-toggle" id="header-menu-toggle">
            <i class="icon icon-bars"></i>
          </span>
          <ul class="header-dropdown-menu" id="header-dropdown-menu">
            <li class="dropdown-menu-item">
              <a href="/upload-images" class="link nav-item">
                Dodaj obraz
                <i class="icon icon-image"></i>
              </a>
            </li>
            <li class="dropdown-menu-item">
              <a href="/logout" class="link nav-item">
                Wyloguj się
                <i class="icon icon-sign-out"></i>
              </a>        
            </li>
            <li></li>
          </ul>
        </div>
      </header>
      
      <style>
        @import url(styles/reset.css);
        @import url(fonts/opensans/opensans.css);
        @import url(icons/icons.css);
    
        header {
          background-color: #f1f1ef8c;
          box-sizing: border-box;
          display: flex;
          justify-content: space-between;
          font-family: 'Open Sans', sans-serif;
          font-weight: 400;
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
        .group-list {
          cursor: help;
        }
        .header-dropdown-menu-toggle {
          cursor: pointer;
          position: relative;
        }
        .header-dropdown-menu {
          display: none;
          width: 10em;
          position: absolute;
          flex-direction: column;
          list-style: none;
          right: 0;
          top: 3rem;
          background-color: #fff;
        }
        .header-dropdown-menu.open {
          display: flex;
        }
        .dropdown-menu-item {
          border-top: 1px solid #efefef;
        }
      </style>
    `;
    shadowRoot.appendChild(template.content.cloneNode(true));

    this.dropdownMenu = shadowRoot.getElementById('header-dropdown-menu');
    this.menuToggle = shadowRoot.getElementById('header-menu-toggle');
  }
  
  connectedCallback() {
    this.menuToggle.addEventListener('click', this.toggleMenuOpen);
  }

  toggleMenuOpen() {
    const iconClassList = this.querySelector('.icon').classList;
    const menuClassList = this.parentNode.querySelector('.header-dropdown-menu');
    if (iconClassList.contains('icon-bars')) {
      iconClassList.remove('icon-bars');
      iconClassList.add('icon-times');
      menuClassList.classList.add('open');
    } else {
      iconClassList.remove('icon-times');
      iconClassList.add('icon-bars');
      menuClassList.classList.remove('open');
    }
  }

  disconnectedCallback() {
    this.menuToggle.removeEventListener('click', this.toggleMenuOpen);
  }
}
