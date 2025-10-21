/**
 * Commenting system stub for Lexical integration
 * In a real application, this would integrate with your backend commenting service
 */

export interface Comment {
  id: string;
  thread: string;
  content: string;
  author: string;
  timestamp: number;
  deleted: boolean;
}

export interface CommentThread {
  id: string;
  comments: Comment[];
  quote: string;
  type: 'thread';
}

// Alias names for compatibility
export type Thread = CommentThread;
export type Comments = Comment;

export type CommentOrThread = Comment | CommentThread;

// Export CommentStore as an alias for CommentsStore
export class CommentsStore {
  private comments: Map<string, CommentOrThread> = new Map();
  private listeners: Set<() => void> = new Set();

  addComment(comment: CommentOrThread): void {
    this.comments.set(comment.id, comment);
    this.notifyListeners();
  }

  getComment(id: string): CommentOrThread | undefined {
    return this.comments.get(id);
  }

  deleteComment(id: string): void {
    const comment = this.comments.get(id);
    if (comment && 'deleted' in comment) {
      comment.deleted = true;
      this.notifyListeners();
    }
  }

  deleteCommentOrThread(id: string): void {
    this.comments.delete(id);
    this.notifyListeners();
  }

  getAllComments(): CommentOrThread[] {
    return Array.from(this.comments.values());
  }

  registerCollaboration(provider: any): () => void {
    // Stub for collaboration registration
    return () => {
      // Cleanup function
    };
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener());
  }
}

// Create a singleton instance
export const commentsStore = new CommentsStore();
// Add CommentStore alias for backward compatibility
export const CommentStore = CommentsStore;

// React hook for using the comment store
export function useCommentStore() {
  return commentsStore;
}

// Export utility functions with flexible signatures
export function createComment(
  contentOrComment: string | Partial<Comment>,
  author?: string,
  thread?: string
): Comment {
  if (typeof contentOrComment === 'object') {
    return {
      id: contentOrComment.id || generateUID(),
      thread: contentOrComment.thread || generateUID(),
      content: contentOrComment.content || '',
      author: contentOrComment.author || 'Anonymous',
      timestamp: contentOrComment.timestamp || Date.now(),
      deleted: contentOrComment.deleted || false,
    };
  }

  return {
    id: generateUID(),
    thread: thread || generateUID(),
    content: contentOrComment,
    author: author || 'Anonymous',
    timestamp: Date.now(),
    deleted: false,
  };
}

export function createCommentThread(
  quoteOrThread: string | Partial<CommentThread>,
  comments: Comment[] = [],
  id?: string
): CommentThread {
  if (typeof quoteOrThread === 'object') {
    return {
      id: quoteOrThread.id || generateUID(),
      comments: quoteOrThread.comments || [],
      quote: quoteOrThread.quote || '',
      type: 'thread',
    };
  }

  return {
    id: id || generateUID(),
    comments,
    quote: quoteOrThread,
    type: 'thread',
  };
}

// Alias for createCommentThread with flexible signature
export const createThread = createCommentThread;

function generateUID(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}