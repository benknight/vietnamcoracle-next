import format from 'date-fns/format';
import parseJSON from 'date-fns/parseJSON';
import { useState } from 'react';
import CommentForm from './CommentForm';

function formatDate(value: string): string {
  const date = parseJSON(value);
  return format(date, "MMMM d, yyyy 'at' p");
}

const CommentHeader = ({ comment, isReply = false }) => (
  <div className="flex items-center mb-4 font-display text-sm">
    {comment.author.node?.id === 'dXNlcjoy' && (
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
      <div className="mt-1 text-xs opacity-75">
        {formatDate(comment.dateGmt)}
      </div>
    </div>
  </div>
);

const CommentBody = ({ comment, post }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  return (
    <>
      <div
        className="comment break-words"
        dangerouslySetInnerHTML={{
          __html: comment.content,
        }}
      />
      <button
        className="link text-xs"
        onClick={() => setShowReplyForm(x => !x)}>
        {showReplyForm ? 'Cancel Reply' : 'Reply'}
      </button>
      <div
        className="mt-4 mb-8 border-t border-gray-200 dark:border-gray-700 pt-4"
        hidden={!showReplyForm}>
        <div className="font-display text-sm mb-4">
          Reply to <b>{comment.author.node.name}</b>:
        </div>
        <CommentForm parent={comment.id} post={post} />
      </div>
    </>
  );
};

export default function CommentThread({ comments, post }) {
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
            <CommentBody comment={comment} post={post} />
            <CommentReplies all={comments} comment={comment} post={post} />
          </li>
        ))}
    </ol>
  );
}

const CommentReplies = ({ all, comment, post }) => {
  const replies = all
    .filter(reply => reply.parentId === comment.id)
    .sort((a, b) => a.databaseId - b.databaseId);
  if (replies.length === 0) {
    return null;
  }
  return (
    <ol>
      {replies.map(reply => (
        <li className="mt-12 md:pl-8" key={reply.id}>
          <CommentHeader comment={reply} isReply />
          <CommentBody comment={reply} post={post} />
          <CommentReplies all={all} comment={reply} post={post} />
        </li>
      ))}
    </ol>
  );
};
