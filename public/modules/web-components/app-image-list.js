export default class AppImageList extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'open' });
    const template = document.createElement('template');
    template.innerHTML = `
      <ul></ul>
      
      <style>
        @import url(styles/reset.css);
        
        ul {
          display: flex;
          flex-wrap: wrap;
        }
      </style>
    `;
    shadowRoot.appendChild(template.content.cloneNode(true));

    this.imageList = shadowRoot.querySelector('ul');
    const images = new Array(20).fill('uploads/thumbnails/liczniki.jpg');
    images.forEach(src => {
      const thumbnail = document.createElement('app-thumbnail');
      thumbnail.setAttribute('source', src);
      this.imageList.appendChild(thumbnail);
    });
  }
  
  connectedCallback() {
    //
  }

  // instance methods

  disconnectedCallback() {
    //
  }
}
