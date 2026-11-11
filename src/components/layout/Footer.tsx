import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-sm">
                F
              </div>
              <span className="text-lg font-bold text-foreground">FindIt</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Record lost and found items, review possible matches, and coordinate returns.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Quick Links</h3>
            <div className="flex flex-col gap-2">
              <Link href="/browse" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Browse Items
              </Link>
              <Link href="/report/new?type=lost" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Report Lost Item
              </Link>
              <Link href="/report/new?type=found" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Report Found Item
              </Link>
            </div>
          </div>

          {/* Account */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Account</h3>
            <div className="flex flex-col gap-2">
              <Link href="/login" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Log In
              </Link>
              <Link href="/register" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Sign Up
              </Link>
              <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Dashboard
              </Link>
            </div>
          </div>

          {/* Info */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Info</h3>
            <div className="flex flex-col gap-2">
              <Link href="/info/how-matching-works" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                How Matching Works
              </Link>
              <Link href="/info/dti-capstone-project" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                DTI Capstone Project
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            Copyright {new Date().getFullYear()} FindIt. Lost and found platform.
          </p>
        </div>
      </div>
    </footer>
  );
}
