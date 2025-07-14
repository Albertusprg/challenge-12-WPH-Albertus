export interface BlogPostProps {
  id?: string;
  title?: string;
  content?: string;
  tags?: string[];
  imageUrl?: string;
  createdAt?: string;
  likes?: number;
  comment?: number;
  author?: {
    id?: number;
    name?: string;
    email?: string;
  };
}

export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  author: {
    id: number;
    name: string;
    headline: string;
    avatarUrl: string;
  };
}

export interface PostCardProps {
  post: BlogPostProps;
  index: number;
}

export interface User {
  id: 'number';
  name: 'string';
  email: 'string';
  headline: 'string';
  avatarUrl: 'string';
}
