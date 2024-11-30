export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  content: string;
  author: string;
  date: string;
  readingTime: string;
  tags: string[];
  image?: string;
}
