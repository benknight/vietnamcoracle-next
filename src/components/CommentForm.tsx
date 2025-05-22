'use client';
import cx from 'classnames';
import { Formik, Field, Form } from 'formik';
import _unescape from 'lodash/unescape';
import { useState } from 'react';
import GraphQLClient from '../lib/WPGraphQLClient';
import useWaitCursor from '../lib/useWaitCursor';
import CreateCommentQuery from '../queries/CreateComment.gql';

interface Props {
  post: number;
  parent?: any;
}

export default function CommentForm({ parent, post }: Props) {
  const [busy, setBusy] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useWaitCursor(busy);

  const onSubmit = async values => {
    setBusy(true);
    try {
      const api = new GraphQLClient();
      const response = await api.request(CreateCommentQuery, {
        parent: parent?.id ?? null,
        post,
        ...values,
      });
      if (response.createComment.success) {
        if (values.subscribe === true) {
          try {
            fetch('/api/subscribe/', {
              method: 'post',
              body: JSON.stringify({ email: values.email }),
              headers: {
                'Content-Type': 'application/json',
              },
            });
          } catch (error) {
            console.error(
              `CommentForm: failed to subscribe ${values.email}`,
              error,
            );
          }
        }
        window.alert('Thank you! Your comment is awaiting moderation.');
      }
    } catch (error) {
      window.alert(
        _unescape(
          error.response?.errors?.[0]?.message || 'Failed to post comment',
        ),
      );
    }
    setBusy(false);
  };

  const form = (
    <Formik
      initialValues={{
        comment: '',
        email: '',
        name: '',
        subscribe: false,
      }}
      onSubmit={onSubmit}>
      {({ isSubmitting }) => (
        <Form className="uppercase text-xs leading-loose rounded-lg">
          <label className="block py-1">
            Name
            <Field
              className="form-field w-full h-8 px-3 rounded text-sm"
              name="name"
              required
              type="text"
            />
          </label>
          <label className="block py-1">
            Email
            <Field
              className="form-field w-full h-8 px-3 rounded text-sm"
              name="email"
              required
              type="email"
            />
          </label>
          <label className="block py-2">
            Comment
            <Field
              as="textarea"
              className="w-full p-3 form-field rounded h-32 text-sm"
              name="comment"
              required
            />
          </label>
          <label className="flex items-center select-none cursor-pointer">
            <Field
              className="mr-2 cursor-pointer"
              name="subscribe"
              type="checkbox"
            />{' '}
            Subscribe to the latest posts!
          </label>
          <button
            disabled={isSubmitting}
            className={cx('btn mt-4', { 'opacity-50': isSubmitting })}
            type="submit">
            {isSubmitting ? 'Please wait…' : 'Submit'}
          </button>
        </Form>
      )}
    </Formik>
  );

  if (!parent) {
    return form;
  }

  return (
    <>
      <button className="link text-xs" onClick={() => setShowForm(x => !x)}>
        {showForm ? 'Cancel Reply' : 'Reply'}
      </button>
      <div
        className="mt-4 mb-8 border-t border-gray-200 dark:border-gray-700 pt-4"
        hidden={!showForm}>
        <div className="font-display text-sm mb-4">
          Reply to <b>{parent.author.node.name}</b>:
        </div>
        {form}
      </div>
    </>
  );
}
