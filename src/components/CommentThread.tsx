import format from 'date-fns/format';
import parseJSON from 'date-fns/parseJSON';
import { gql } from 'graphql-request';

function formatDate(value: string): string {
  const date = parseJSON(value);
  return format(date, "MMMM d, yyyy 'at' p");
}

const CommentHeader = ({ comment, isReply = false }) => (
  <div className="flex items-center mb-4 font-display text-sm">
    {comment.author.node?.avatar?.url && (
      <img
        className="w-11 h-11 mr-2 rounded-full"
        src={comment.author.node.avatar.url}
      />
    )}
    <div className="flex-auto">
      {isReply && <span className="opacity-50">➥ </span>}
      <strong
        className="text-black dark:text-white"
        dangerouslySetInnerHTML={{
          __html: comment.author.node.name,
        }}
      />{' '}
      <span className="italic">says:</span>
      <div className="mt-2 text-xs opacity-75">
        {formatDate(comment.dateGmt)}
      </div>
    </div>
  </div>
);

const CommentReplies = ({ all, comment }) => {
  const replies = all
    .filter(reply => reply.parentId === comment.id)
    .sort((a, b) => a.commentId - b.commentId);
  if (replies.length === 0) {
    return null;
  }
  return (
    <ol>
      {replies.map(reply => (
        <li className="mt-12 md:pl-8" key={reply.id}>
          <CommentHeader comment={reply} isReply />
          <div
            className="comment"
            dangerouslySetInnerHTML={{
              __html: reply.content,
            }}
          />
          <CommentReplies all={all} comment={reply} />
        </li>
      ))}
    </ol>
  );
};

export default function CommentThread({ comments }) {
  return (
    <ol>
      {comments
        .filter(c => c.parentId === null)
        .sort()
        .map(comment => (
          <li
            className="
              my-8 px-4 md:px-7 py-6 font-sans
              bg-gray-100 dark:bg-gray-900 dark:text-gray-300 rounded-lg"
            key={comment.id}>
            <CommentHeader comment={comment} />
            <div
              className="comment"
              dangerouslySetInnerHTML={{
                __html: comment.content,
              }}
            />
            <CommentReplies comment={comment} all={comments} />
          </li>
        ))}
    </ol>
  );
}

CommentThread.fragments = gql`
  fragment CommentThreadCommentData on Comment {
    content
    commentId
    dateGmt
    parentId
    id
    author {
      node {
        email
        name
        ... on User {
          avatar {
            url
          }
        }
      }
    }
  }
`;
