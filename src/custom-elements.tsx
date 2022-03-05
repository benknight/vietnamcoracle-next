import { render } from 'react-dom';
import ShareButtons from './components/ShareButtons';
import SubscribeForm from './components/SubscribeForm';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'share-buttons': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}

if (typeof window !== 'undefined') {
  class SubscribeFormCustomElement extends HTMLElement {
    connectedCallback() {
      const root = document.createElement('div');
      this.attachShadow({ mode: 'open' }).appendChild(root);
      // const name = this.getAttribute('name');
      render(<SubscribeForm />, root);
    }
  }

  customElements.define('subscribe-form', SubscribeFormCustomElement);

  class ShareButtonsCustomElement extends HTMLElement {
    connectedCallback() {
      const root = document.createElement('div');
      this.attachShadow({ mode: 'open' }).appendChild(root);
      // const name = this.getAttribute('name');
      const props = {
        image: this.getAttribute('data-image'),
        link: this.getAttribute('data-link'),
        title: this.getAttribute('data-name'),
      };
      if (!props.link) {
        return;
      }
      render(<ShareButtons {...props} />, root);
    }
  }

  customElements.define('share-buttons', ShareButtonsCustomElement);
}
