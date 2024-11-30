/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Calendar, Clock, ArrowUpRight } from "lucide-react";
import { getAllBlogPosts } from "@/lib/blog";
import Image from "next/image";

export default async function BlogPage() {
  const posts = await getAllBlogPosts();

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-12">وبلاگ تجربت</h1>

      <div className="grid gap-6">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`}>
            <Card className="group hover:shadow-lg transition-all duration-200">
              {post.image && (
                <div className="relative h-96 overflow-hidden rounded-t-xl">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-200"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={false}
                  />
                </div>
              )}
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-2xl group-hover:text-primary transition-colors">
                    {post.title}
                  </CardTitle>
                  <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <p className="text-muted-foreground mt-2">{post.description}</p>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4 items-center text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <time dateTime={post.date}>{post.date}</time>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{post.readingTime}</span>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  {post.tags.map((tag: any) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
