import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Zap } from "lucide-react";

export default function PricingPage() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      description: "Perfect for getting started",
      features: [
        "Access to basic agents",
        "Up to 100 API calls/month",
        "Community support",
        "Basic analytics"
      ],
      popular: false
    },
    {
      name: "Basic",
      price: "$29",
      description: "For small teams and startups",
      features: [
        "Access to all basic & premium agents",
        "Up to 10,000 API calls/month",
        "Email support",
        "Advanced analytics",
        "Custom integrations"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For large organizations",
      features: [
        "Access to all agents",
        "Unlimited API calls",
        "24/7 priority support",
        "Advanced analytics & reporting",
        "Custom agent development",
        "Dedicated account manager"
      ],
      popular: false
    }
  ];

  return (
    <div className="container py-16">
      <div className="space-y-12">
        <div className="text-center space-y-4">
          <Badge variant="secondary" className="px-4 py-1.5">
            <Zap className="mr-2 h-3 w-3" />
            Pricing Plans
          </Badge>
          <h1 className="text-4xl font-bold">Choose Your Plan</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Select the perfect plan for your AI agent needs. Start free and scale as you grow.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative ${plan.popular ? 'border-primary shadow-lg scale-105' : ''}`}>
              {plan.popular && (
                <Badge className="absolute -top-2 left-1/2 -translate-x-1/2">
                  Most Popular
                </Badge>
              )}
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.price !== "Custom" && <span className="text-muted-foreground">/month</span>}
                </div>
                <CardDescription className="text-base">{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className="w-full" 
                  variant={plan.popular ? "default" : "outline"}
                  size="lg"
                >
                  {plan.price === "Custom" ? "Contact Sales" : "Get Started"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center space-y-4 pt-8">
          <h3 className="text-2xl font-semibold">All plans include</h3>
          <div className="grid gap-4 md:grid-cols-3 text-sm text-muted-foreground">
            <div className="flex items-center justify-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <span>99.9% uptime SLA</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <span>SOC2 Type II compliance</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <span>End-to-end encryption</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}