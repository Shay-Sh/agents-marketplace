import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="container py-16 max-w-4xl">
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <Badge variant="secondary" className="px-4 py-1.5">
            <FileText className="mr-2 h-3 w-3" />
            Terms of Service
          </Badge>
          <h1 className="text-4xl font-bold">Terms of Service</h1>
          <p className="text-muted-foreground">
            Last updated: December 2024
          </p>
        </div>

        <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Acceptance of Terms</h2>
            <p className="text-muted-foreground">
              By accessing and using the Lab17 Agents platform, you accept and agree to be bound by the terms and provision of this agreement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Use of Service</h2>
            <p className="text-muted-foreground mb-4">
              You may use our service for lawful purposes only. You agree not to use the service:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>In any way that violates applicable laws or regulations</li>
              <li>To transmit any malicious code or harmful content</li>
              <li>To interfere with or disrupt our services</li>
              <li>To attempt unauthorized access to our systems</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Account Responsibilities</h2>
            <p className="text-muted-foreground mb-4">
              You are responsible for maintaining the confidentiality of your account and password.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your account</li>
              <li>Notify us of any unauthorized access</li>
              <li>Be responsible for all activities under your account</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Payment Terms</h2>
            <p className="text-muted-foreground mb-4">
              Payment terms vary by subscription plan:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Free plan: No payment required</li>
              <li>Paid plans: Billed monthly or annually in advance</li>
              <li>Enterprise: Custom pricing and billing terms</li>
              <li>All payments processed securely through Stripe</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Limitation of Liability</h2>
            <p className="text-muted-foreground">
              Lab17.ai shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
            <p className="text-muted-foreground">
              For questions about these Terms of Service, contact us at{" "}
              <a href="mailto:legal@lab17.ai" className="text-primary hover:underline">
                legal@lab17.ai
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}