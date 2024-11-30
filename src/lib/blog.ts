import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { BlogPost } from "@/app/types";

const POSTS_PATH = path.join(process.cwd(), "content/blog");

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const files = await fs.readdir(POSTS_PATH);
  const posts = await Promise.all(
    files
      .filter((file) => /\.mdx?$/.test(file))
      .map(async (file) => {
        const filePath = path.join(POSTS_PATH, file);
        const content = await fs.readFile(filePath, "utf8");
        const { data, content: markdownContent } = matter(content);

        return {
          slug: file.replace(/\.mdx?$/, ""),
          title: data.title,
          description: data.description,
          date: data.date,
          author: data.author,
          readingTime: calculateReadingTime(markdownContent),
          tags: data.tags || [],
          image: data.image,
          content: markdownContent,
        };
      })
  );

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export async function getBlogPostBySlug(
  slug: string
): Promise<BlogPost | null> {
  try {
    const filePath = path.join(POSTS_PATH, `${slug}.mdx`);
    const content = await fs.readFile(filePath, "utf8");
    const { data, content: markdownContent } = matter(content);

    return {
      slug,
      title: data.title,
      description: data.description,
      date: data.date,
      author: data.author,
      readingTime: calculateReadingTime(markdownContent),
      tags: data.tags || [],
      image: data.image,
      content: markdownContent,
    };
  } catch {
    return null;
  }
}

function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} دقیقه مطالعه`;
}
