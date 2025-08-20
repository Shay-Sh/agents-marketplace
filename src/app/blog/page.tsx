import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, User, BookOpen, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function BlogPage() {
  const posts = [
    {
      title: "The Future of AI Agents in Enterprise",
      excerpt: "Exploring how AI agents are transforming business operations and driving innovation across industries.",
      author: "Lab17 Team",
      date: "Dec 15, 2024",
      category: "Industry Insights"
    },
    {
      title: "Building Your First AI Agent: A Complete Guide",
      excerpt: "Step-by-step tutorial on creating, training, and deploying your first AI agent using Lab17 platform.",
      author: "Sarah Chen",
      date: "Dec 10, 2024",
      category: "Tutorial"
    },
    {
      title: "Security Best Practices for AI Agents",
      excerpt: "Essential security considerations when implementing AI agents in production environments.",
      author: "Mike Johnson",
      date: "Dec 5, 2024",
      category: "Security"
    }
  ];

  return (
    <div className="container py-16">
      <div className="space-y-12">
        <div className="text-center space-y-4">
          <Badge variant="secondary" className="px-4 py-1.5">
            <BookOpen className="mr-2 h-3 w-3" />
            Blog
          </Badge>
          <h1 className="text-4xl font-bold">Latest from Lab17</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Stay up to date with the latest insights, tutorials, and news from the world of AI agents.
          </p>
        </div>

        <div className="grid gap-8">
          {posts.map((post, index) => (
            <Card key={index} className="transition-all hover:shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="outline">{post.category}</Badge>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {post.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {post.date}
                    </div>
                  </div>
                </div>
                <CardTitle className="text-2xl hover:text-primary transition-colors">
                  <Link href="#">{post.title}</Link>
                </CardTitle>
                <CardDescription className="text-base">{post.excerpt}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" className="p-0 h-auto" asChild>
                  <Link href="#" className="flex items-center gap-2">
                    Read more
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            Want to stay updated with our latest posts?
          </p>
          <Button asChild>
            <Link href="/auth/signup">Subscribe to Updates</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}