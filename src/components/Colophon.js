import { graphql } from 'gatsby';
import React from 'react';

export default function Colophon({ data }) {
  return (
    <>
      <section className="mb-12 text-center font-display">
        <a className="block w-48 h-48 mx-auto my-8" href={data.about.link.url}>
          <img
            alt=""
            className="h-full rounded-full object-cover"
            srcSet={data.about.image.srcSet}
          />
        </a>
        <h3 className="text-xl sm:text-2xl mb-3">{data.about.title}</h3>
        <p className="mx-auto px-12 sm:px-16 text-sm sm:text-base max-w-lg font-sans">
          {data.about.description}{' '}
          <a className="link" href={data.about.link.url}>
            Read more ›
          </a>
        </p>
      </section>
      <section className="mb-20 text-center font-display">
        <h3 className="text-xl sm:text-2xl mb-3">{data.support.title}</h3>
        <p className="mx-auto mb-8 px-12 sm:px-16 text-sm sm:text-base max-w-lg font-sans">
          {data.support.description}{' '}
          <a className="link" href={data.support.link.url}>
            Read more ›
          </a>
        </p>
        <a href={data.support.link.url}>
          <img
            alt=""
            className="w-48 mx-auto"
            srcSet={data.support.button.srcSet}
            title={data.support.link.title}
          />
        </a>
      </section>
      <section className="mb-12 text-center font-display">
        <div
          className="block w-24 h-24 mx-auto mb-4"
          href={data.about.link.url}>
          <img
            alt=""
            className="h-full rounded-full object-cover"
            srcSet={data.subscribe.image.srcSet}
          />
        </div>
        <h3 className="text-xl sm:text-2xl mb-3">{data.subscribe.title}</h3>
        <p className="mx-auto mb-8 px-12 sm:px-16 text-sm sm:text-base max-w-lg font-sans">
          {data.subscribe.description}{' '}
        </p>
      </section>
    </>
  );
}

export const query = graphql`
  fragment ColophonComponentData on WpComponent_Colophon {
    about {
      description
      title
      image {
        srcSet
      }
      link {
        title
        url
      }
    }
    support {
      description
      title
      button {
        srcSet
      }
      link {
        title
        url
      }
    }
    subscribe {
      button
      description
      title
      image {
        srcSet
      }
    }
  }
`;
