import cx from 'classnames';
import { gql } from 'graphql-request';
import { Formik, Field, Form } from 'formik';
import _unescape from 'lodash/unescape';
import getGQLClient from '../lib/getGQLClient';

const CREATE_COMMENT_MUTATION = gql`
  mutation CreateComment(
    $comment: String!
    $email: String!
    $name: String!
    $post: Int!
  ) {
    createComment(
      input: {
        author: $name
        authorEmail: $email
        commentOn: $post
        content: $comment
      }
    ) {
      success
      comment {
        id
        content
        author {
          node {
            name
          }
        }
      }
    }
  }
`;

type Props = {
  post: number;
};

export default function CommentForm({ post }: Props) {
  const onSubmit = async (values, actions) => {
    actions.setSubmitting(true);
    try {
      const api = getGQLClient();
      const response = await api.request(CREATE_COMMENT_MUTATION, {
        post,
        ...values,
      });
      if (response.createComment.success) {
        if (values.subscribe === true) {
          fetch('/api/subscribe', {
            method: 'post',
            body: JSON.stringify({ email: values.email }),
            headers: {
              'Content-Type': 'application/json',
            },
          });
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
  };
  return (
    <Formik
      initialValues={{
        comment: '',
        email: '',
        name: '',
        subscribe: false,
      }}
      onSubmit={onSubmit}>
      {({ isSubmitting }) => (
        <Form className="p-4 bg-gray-100 dark:bg-gray-900 uppercase text-xs leading-loose rounded-lg">
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
            Submit
          </button>
        </Form>
      )}
    </Formik>
  );
}
