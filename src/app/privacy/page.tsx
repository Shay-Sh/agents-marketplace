import { Badge } from "@/components/ui/badge";
import { Shield } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="container py-16 max-w-4xl">
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <Badge variant="secondary" className="px-4 py-1.5">
            <Shield className="mr-2 h-3 w-3" />
            Privacy Policy
          </Badge>
          <h1 className="text-4xl font-bold">Privacy Policy</h1>
          <p className="text-muted-foreground">
            Last updated: December 2024
          </p>
        </div>

        <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
            <p className="text-muted-foreground mb-4">
              We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Account information (name, email address, password)</li>
              <li>Usage data and analytics</li>
              <li>Communication preferences</li>
              <li>Payment information (processed securely through Stripe)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
            <p className="text-muted-foreground mb-4">
              We use the information we collect to provide, maintain, and improve our services.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Provide and maintain our AI agent marketplace</li>
              <li>Process transactions and manage subscriptions</li>
              <li>Send you technical notices and support messages</li>
              <li>Improve our services and develop new features</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
            <p className="text-muted-foreground mb-4">
              We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>End-to-end encryption for sensitive data</li>
              <li>SOC2 Type II compliance</li>
              <li>Regular security audits and penetration testing</li>
              <li>Secure data centers with 24/7 monitoring</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p className="text-muted-foreground">
              If you have any questions about this Privacy Policy, please contact us at{" "}
              <a href="mailto:privacy@lab17.ai" className="text-primary hover:underline">
                privacy@lab17.ai
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}