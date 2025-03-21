import { createRoot } from 'react-dom/client';
import resolveConfig from 'tailwindcss/resolveConfig';
import { defineConfig } from '@twind/core';
import install from '@twind/with-web-components';
import presetAutoprefix from '@twind/preset-autoprefix';
import presetTailwind from '@twind/preset-tailwind';
import tailwindConfig from '../tailwind.config.js';
import ShareButtons from './components/ShareButtons';
import SubscribeForm from './components/SubscribeForm';
import MapOverlay from './components/MapOverlay';

const baseConfig = resolveConfig(tailwindConfig) as any;

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'map-overlay': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
      'share-buttons': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
      'subscribe-form': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}

if (typeof window !== 'undefined') {
  const config = defineConfig({
    /* @twind/with-web-components will use
     * hashed class names in production by default
     * If you don't want this, uncomment the next line
     */
    // hash: false,
    presets: [presetAutoprefix(), presetTailwind()],
    theme: baseConfig.theme,
    rules: [
      [
        'btn',
        'h-8 px-4 inline-flex items-center justify-center text-sm font-sans font-medium tracking-wider bg-gray-500 dark:hover:bg-primary-500 bg-opacity-10 hover:bg-opacity-25 dark:bg-opacity-25 dark:hover:bg-opacity-25 focus:outline-none rounded-lg subpixel-antialiased font-sans transition-colors duration-100 ease-in-out whitespace-nowrap',
      ],
    ],
  });

  const withTwind = install(config);

  class SubscribeFormCustomElement extends HTMLElement {
    connectedCallback() {
      const root = document.createElement('div');
      this.attachShadow({ mode: 'open' }).appendChild(root);
      // const name = this.getAttribute('name');
      const reactDomRoot = createRoot(root);
      reactDomRoot.render(<SubscribeForm />);
    }
  }

  customElements.define('subscribe-form', SubscribeFormCustomElement);

  class ShareButtonsCustomElement extends HTMLElement {
    connectedCallback() {
      const root = document.createElement('div');
      this.attachShadow({ mode: 'open' }).appendChild(root);
      const props = {
        image: this.getAttribute('data-image') || '',
        link: this.getAttribute('data-link') || '',
        title: this.getAttribute('data-name') || '',
      };
      if (!props.link) {
        return;
      }
      const reactDomRoot = createRoot(root);
      reactDomRoot.render(<ShareButtons {...props} />);
    }
  }

  customElements.define('share-buttons', ShareButtonsCustomElement);

  class MapOverlayCustomElement extends withTwind(HTMLElement) {
    constructor() {
      super();
      const root = document.createElement('div');
      this.attachShadow({ mode: 'open' }).appendChild(root);
      const props = {
        height: this.getAttribute('data-height') || '',
        src: this.getAttribute('data-src') || '',
        title: this.getAttribute('data-title') || '',
        width: this.getAttribute('data-width') || '',
      };
      const reactDomRoot = createRoot(root);
      reactDomRoot.render(<MapOverlay {...props} />);
    }
  }

  customElements.define('map-overlay', MapOverlayCustomElement);
}
