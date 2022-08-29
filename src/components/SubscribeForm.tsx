import { useState } from 'react';
import resolveConfig from 'tailwindcss/resolveConfig';
import { useSubscribeForm } from './Subscribe';
import tailwindConfig from '../../tailwind.config.js';

const {
  theme: { borderRadius, colors, height, padding, width },
} = resolveConfig(tailwindConfig) as any;

export default function SubscribeFormElement() {
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
          border: 1px solid ${colors.gray['200']};
          border-radius: ${borderRadius.DEFAULT};
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
          placeholder="Email"
          onChange={event => setEmail(event.target.value)}
          required
          type="email"
        />
        <button disabled={isLoading} type="submit">
          Subscribe
        </button>
      </form>
    </>
  );
}
