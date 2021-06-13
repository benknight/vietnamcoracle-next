import { useState } from 'react';
import { render } from 'react-dom';
import resolveConfig from 'tailwindcss/resolveConfig';
import { useSubscribeForm } from '../components/Subscribe';
import tailwindConfig from '../../tailwind.config.js';

const {
  theme: { borderRadius, colors, height, padding, width },
} = resolveConfig(tailwindConfig);

const InlineSubscribeForm = () => {
  const [email, setEmail] = useState('');
  const { isLoading, onSubmit } = useSubscribeForm();
  return (
    <>
      <style>{`
        form {
          display: flex;
          height: ${height[8]};
        }
        input {
          font-size: 1rem;
          margin-right: 0.5rem;
          width: ${width[48]};
        }
        button {
          border: 0;
          color: white;
          cursor: pointer;
          background-color: ${colors.blue['500']};
          border-radius: ${borderRadius.DEFAULT};
          padding-left: ${padding[4]};
          padding-right: ${padding[4]};
        }
      `}</style>
      <form
        onSubmit={event => {
          event.preventDefault();
          onSubmit(email);
        }}>
        <input
          onChange={event => setEmail(event.target.value)}
          required
          type="text"
        />
        <button type="submit">Subscribe</button>
      </form>
    </>
  );
};

class MailChimpShortcode extends HTMLElement {
  connectedCallback() {
    const root = document.createElement('div');
    this.attachShadow({ mode: 'open' }).appendChild(root);
    // const name = this.getAttribute('name');
    // const url = 'https://www.google.com/search?q=' + encodeURIComponent(name);
    render(<InlineSubscribeForm />, root);
  }
}

customElements.define('shortcode-mc4wp_form', MailChimpShortcode);
