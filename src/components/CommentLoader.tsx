'use client';
import { useState } from 'react';
import GraphQLClient from '@/lib/WPGraphQLClient';
import AdditionalCommentsQuery from '@/queries/AdditionalComments.gql';
import CommentThread from './CommentThread';

interface Props {
  postId: number;
  hasNextPage: boolean;
  endCursor: string;
}

export default function CommentLoader({
  postId,
  hasNextPage,
  endCursor,
}: Props) {
  const [loadedComments, setLoadedComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentEndCursor, setCurrentEndCursor] = useState(endCursor);
  const [hasMore, setHasMore] = useState(hasNextPage);

  const loadMoreComments = async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    try {
      const api = new GraphQLClient();

      const data = await api.request(AdditionalCommentsQuery, {
        id: postId,
        after: currentEndCursor,
      });

      const newComments = data.contentNode.comments.nodes;

      setLoadedComments(prev => [...prev, ...newComments]);
      setCurrentEndCursor(data.contentNode.comments.pageInfo.endCursor);
      setHasMore(data.contentNode.comments.pageInfo.hasNextPage);
    } catch (error) {
      console.error('Error loading more comments:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loadedComments.length > 0 && (
        <CommentThread comments={loadedComments} postId={postId} />
      )}
      {hasMore && (
        <div className="mt-6 text-center">
          <button
            onClick={loadMoreComments}
            disabled={loading}
            className="btn h-16 lg:mb-12 xl:mb-20 w-full disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? 'Loading...' : 'Load More Comments'}
          </button>
        </div>
      )}
    </>
  );
}
