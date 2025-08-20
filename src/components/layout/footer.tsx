import Link from 'next/link'
import { Zap } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link className="flex items-center space-x-2" href="/">
              <Zap className="h-6 w-6" />
              <span className="font-bold">Lab17 Agents</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              The premier marketplace for AI agents. Build, discover, and deploy intelligent agents for your business.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold">Product</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  href="/marketplace"
                >
                  Marketplace
                </Link>
              </li>
              <li>
                <Link 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  href="/pricing"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  href="/docs"
                >
                  Documentation
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold">Company</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  href="/about"
                >
                  About
                </Link>
              </li>
              <li>
                <Link 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  href="/blog"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  href="/contact"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold">Legal</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  href="/privacy"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  href="/terms"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 border-t pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Lab17.ai. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}