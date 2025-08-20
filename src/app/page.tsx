import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Bot, Zap, Shield, Users, TrendingUp, Star } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="container px-4 py-16 md:py-24">
        <div className="flex flex-col items-center space-y-8 text-center">
          <Badge variant="secondary" className="px-4 py-1.5">
            <Zap className="mr-2 h-3 w-3" />
            Powered by AI
          </Badge>
          
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              The Future of
              <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                {" "}AI Agents
              </span>
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
              Discover, subscribe to, and deploy intelligent AI agents that transform your business operations. 
              Built by Lab17.ai for the modern enterprise.
            </p>
          </div>
          
          <div className="flex flex-col gap-4 min-[400px]:flex-row">
            <Button size="lg" asChild>
              <Link href="/marketplace">
                Browse Agents
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/auth/signup">Get Started Free</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container px-4 py-16 md:py-24">
        <div className="flex flex-col items-center space-y-8">
          <div className="space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Why Choose Lab17 Agents?
            </h2>
            <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
              Enterprise-grade AI agents designed for reliability, security, and scalability.
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <Bot className="h-10 w-10 text-blue-600" />
                <CardTitle>Smart Automation</CardTitle>
                <CardDescription>
                  Advanced AI agents that learn from your data and adapt to your workflows
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                  <li>• Custom knowledge base integration</li>
                  <li>• Real-time learning and adaptation</li>
                  <li>• Multi-modal capabilities</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <Shield className="h-10 w-10 text-green-600" />
                <CardTitle>Enterprise Security</CardTitle>
                <CardDescription>
                  Bank-grade security with SOC2 compliance and data encryption
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                  <li>• End-to-end encryption</li>
                  <li>• SOC2 Type II certified</li>
                  <li>• Private cloud deployment</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <TrendingUp className="h-10 w-10 text-purple-600" />
                <CardTitle>Scalable Performance</CardTitle>
                <CardDescription>
                  Scale from startup to enterprise with our flexible infrastructure
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                  <li>• 99.9% uptime guarantee</li>
                  <li>• Global CDN deployment</li>
                  <li>• Auto-scaling infrastructure</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Agents Section */}
      <section className="bg-gray-50 dark:bg-gray-900 px-4 py-16 md:py-24">
        <div className="container">
          <div className="flex flex-col items-center space-y-8">
            <div className="space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Featured Agents
              </h2>
              <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                Discover our most popular AI agents, ready to transform your business.
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  name: "Customer Support AI",
                  description: "24/7 intelligent customer service automation",
                  category: "Customer Service",
                  rating: 4.9,
                  users: "10k+"
                },
                {
                  name: "Content Generator",
                  description: "AI-powered content creation and optimization",
                  category: "Marketing",
                  rating: 4.8,
                  users: "5k+"
                },
                {
                  name: "Data Analyst",
                  description: "Automated data analysis and insights generation",
                  category: "Analytics",
                  rating: 4.9,
                  users: "3k+"
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
                    <CardTitle>{agent.name}</CardTitle>
                    <CardDescription>{agent.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Users className="h-4 w-4" />
                        {agent.users} users
                      </div>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <Button size="lg" variant="outline" asChild>
              <Link href="/marketplace">
                View All Agents
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container px-4 py-16 md:py-24">
        <div className="flex flex-col items-center space-y-8 text-center">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Ready to Get Started?
            </h2>
            <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
              Join thousands of businesses already using Lab17 Agents to automate and optimize their operations.
            </p>
          </div>
          
          <div className="flex flex-col gap-4 min-[400px]:flex-row">
            <Button size="lg" asChild>
              <Link href="/auth/signup">
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/contact">
                Contact Sales
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
