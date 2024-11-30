import { BlogPost } from "@/app/types";

interface BlogJsonLdProps {
  post: BlogPost;
}

export function BlogJsonLd({ post }: BlogJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    author: {
      "@type": "Person",
      name: post.author,
    },
    datePublished: post.date,
    image: post.image,
    keywords: post.tags.join(", "),
    articleBody: post.content,
    publisher: {
      "@type": "Organization",
      name: "تجربت",
      logo: {
        "@type": "ImageObject",
        url: "https://tajrobat.github.io/logo.png",
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
