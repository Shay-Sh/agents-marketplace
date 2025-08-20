import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Users, Bot } from "lucide-react";

export default function MarketplacePage() {
  return (
    <div className="container py-8">
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">AI Agent Marketplace</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover and subscribe to intelligent AI agents that transform your business operations.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              name: "Customer Support AI",
              description: "24/7 intelligent customer service automation with natural language understanding",
              category: "Customer Service",
              rating: 4.9,
              users: "10k+",
              pricing: "basic"
            },
            {
              name: "Content Generator",
              description: "AI-powered content creation and optimization for marketing and social media",
              category: "Marketing",
              rating: 4.8,
              users: "5k+",
              pricing: "premium"
            },
            {
              name: "Data Analyst",
              description: "Automated data analysis and insights generation with visualization capabilities",
              category: "Analytics",
              rating: 4.9,
              users: "3k+",
              pricing: "enterprise"
            }
          ].map((agent, index) => (
            <Card key={index} className="transition-all hover:shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="outline">{agent.category}</Badge>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{agent.rating}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-lg">{agent.name}</CardTitle>
                </div>
                <CardDescription>{agent.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    {agent.users} users
                  </div>
                  <Button size="sm">
                    Subscribe
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            More agents coming soon! Sign up to get notified when new agents are available.
          </p>
          <Button variant="outline">
            Get Notified
          </Button>
        </div>
      </div>
    </div>
  );
}