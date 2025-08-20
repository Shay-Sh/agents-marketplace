import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Book, Code, Zap, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function DocsPage() {
  const sections = [
    {
      title: "Getting Started",
      description: "Learn the basics of using Lab17 Agents",
      icon: <Zap className="h-6 w-6" />,
      articles: [
        "Quick Start Guide",
        "Creating Your First Agent",
        "Authentication Setup",
        "Basic API Usage"
      ]
    },
    {
      title: "API Reference",
      description: "Complete API documentation and examples",
      icon: <Code className="h-6 w-6" />,
      articles: [
        "REST API Endpoints",
        "WebSocket Connections",
        "Authentication",
        "Rate Limiting"
      ]
    },
    {
      title: "Guides & Tutorials",
      description: "In-depth guides for common use cases",
      icon: <Book className="h-6 w-6" />,
      articles: [
        "Building Custom Agents",
        "Knowledge Base Integration",
        "Advanced Configurations",
        "Best Practices"
      ]
    }
  ];

  return (
    <div className="container py-16">
      <div className="space-y-12">
        <div className="text-center space-y-4">
          <Badge variant="secondary" className="px-4 py-1.5">
            <Book className="mr-2 h-3 w-3" />
            Documentation
          </Badge>
          <h1 className="text-4xl font-bold">Lab17 Agents Documentation</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about building, deploying, and managing AI agents.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {sections.map((section, index) => (
            <Card key={index} className="transition-all hover:shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    {section.icon}
                  </div>
                  <div>
                    <CardTitle className="text-xl">{section.title}</CardTitle>
                    <CardDescription>{section.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {section.articles.map((article, articleIndex) => (
                    <li key={articleIndex}>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-between p-3 h-auto text-left"
                        asChild
                      >
                        <Link href="#" className="flex items-center justify-between">
                          <span className="text-sm">{article}</span>
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center space-y-6 p-8 bg-muted rounded-lg">
          <h3 className="text-2xl font-semibold">Need Help?</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Can&apos;t find what you&apos;re looking for? Our support team is here to help you succeed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link href="/contact">Contact Support</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="https://discord.gg/lab17" target="_blank">Join Discord</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}