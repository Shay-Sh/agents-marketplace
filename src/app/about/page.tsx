import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, Users, Target, Award } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="container py-16">
      <div className="space-y-16">
        <div className="text-center space-y-4">
          <Badge variant="secondary" className="px-4 py-1.5">
            <Zap className="mr-2 h-3 w-3" />
            About Lab17
          </Badge>
          <h1 className="text-4xl font-bold">Building the Future of AI Agents</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Lab17.ai is at the forefront of AI innovation, creating intelligent agents that transform how businesses operate and grow.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <Card className="p-6">
            <CardContent className="space-y-4 p-0">
              <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/20 w-fit">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold">Our Mission</h3>
              <p className="text-muted-foreground">
                To democratize AI technology by making intelligent agents accessible to businesses of all sizes.
              </p>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardContent className="space-y-4 p-0">
              <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/20 w-fit">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold">Our Team</h3>
              <p className="text-muted-foreground">
                A diverse team of AI researchers, engineers, and product experts passionate about innovation.
              </p>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardContent className="space-y-4 p-0">
              <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/20 w-fit">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold">Our Values</h3>
              <p className="text-muted-foreground">
                Innovation, transparency, security, and putting our customers&apos; success at the center of everything we do.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center space-y-6">
          <h2 className="text-3xl font-bold">Ready to Get Started?</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Join thousands of businesses already using Lab17 Agents to automate and optimize their operations.
          </p>
          <Button asChild size="lg">
            <Link href="/auth/signup">Start Building Today</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}