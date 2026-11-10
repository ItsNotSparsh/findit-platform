import Link from "next/link";
import { and, count, desc, eq } from "drizzle-orm";
import { ArrowRight, ClipboardList, PackageCheck, Search } from "lucide-react";
import { db } from "@/db";
import { categories, reports } from "@/db/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReportCard } from "@/components/reports/ReportCard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let totalReports = 0;
  let resolvedReports = 0;
  let activeFoundItems = 0;
  let recentItems: Array<{
    id: string;
    type: string;
    title: string;
    description: string;
    status: string;
    createdAt: Date;
    imageUrl: string | null;
    category: { name: string; icon: string | null } | null;
  }> = [];

  try {
    const [total, resolved, activeFound, items] = await Promise.all([
      db.select({ value: count() }).from(reports),
      db.select({ value: count() }).from(reports).where(eq(reports.status, "RESOLVED")),
      db.select({ value: count() }).from(reports).where(
        and(eq(reports.type, "FOUND"), eq(reports.status, "ACTIVE"))
      ),
      db.select({
        id: reports.id,
        type: reports.type,
        title: reports.title,
        description: reports.description,
        status: reports.status,
        createdAt: reports.createdAt,
        imageUrl: reports.imageUrl,
        categoryName: categories.name,
        categoryIcon: categories.icon,
      })
        .from(reports)
        .leftJoin(categories, eq(reports.categoryId, categories.id))
        .where(and(eq(reports.type, "FOUND"), eq(reports.status, "ACTIVE")))
        .orderBy(desc(reports.createdAt))
        .limit(6),
    ]);

    totalReports = total[0]?.value ?? 0;
    resolvedReports = resolved[0]?.value ?? 0;
    activeFoundItems = activeFound[0]?.value ?? 0;
    recentItems = items.map((item) => ({
      id: item.id,
      type: item.type,
      title: item.title,
      description: item.description,
      status: item.status,
      createdAt: item.createdAt,
      imageUrl: item.imageUrl,
      category: item.categoryName ? { name: item.categoryName, icon: item.categoryIcon } : null,
    }));
  } catch {
    // The page can still explain the service while the database is being configured.
  }

  const stats = [
    { label: "Reports posted", value: totalReports, icon: ClipboardList },
    { label: "Resolved reports", value: resolvedReports, icon: PackageCheck },
    { label: "Open found reports", value: activeFoundItems, icon: Search },
  ];

  const steps = [
    {
      number: "01",
      title: "Post a report",
      description: "Describe the item and where it was lost or found.",
    },
    {
      number: "02",
      title: "Review possible matches",
      description: "FindIt compares lost and found reports and suggests potential matches.",
    },
    {
      number: "03",
      title: "Contact the report owner",
      description: "Submit a claim with identifying details and coordinate a return.",
    },
  ];

  return (
    <div>
      <section className="bg-slate-900 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 md:grid-cols-[1.3fr_0.7fr] md:items-center md:py-28 lg:px-8">
          <div className="max-w-3xl">
            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.14em] text-teal-300">
              Lost and found reports for your community
            </p>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
              Report an item. Find the person who has it.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Post a lost or found item with its details and location. FindIt compares reports for potential matches and helps you contact the other person.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/report/new?type=lost">
                <Button size="lg" className="h-12 w-full rounded-md bg-teal-600 px-6 text-white hover:bg-teal-700 sm:w-auto">
                  Report a lost item
                  <ArrowRight aria-hidden="true" className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/report/new?type=found">
                <Button size="lg" variant="outline" className="h-12 w-full rounded-md border-slate-500 bg-transparent px-6 text-white hover:bg-slate-800 hover:text-white sm:w-auto">
                  Report a found item
                </Button>
              </Link>
            </div>
            <Link href="/browse" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-slate-300 underline decoration-slate-500 underline-offset-4 hover:text-white">
              Browse found items
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>

          <div className="hidden border-l border-slate-700 pl-8 md:block">
            <p className="text-sm font-medium text-slate-300">How FindIt helps</p>
            <ol className="mt-5 space-y-5">
              {steps.map((step) => (
                <li key={step.number} className="flex gap-4">
                  <span className="font-mono text-sm text-teal-300">{step.number}</span>
                  <div>
                    <h2 className="font-semibold text-white">{step.title}</h2>
                    <p className="mt-1 text-sm leading-6 text-slate-400">{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section aria-label="Current report totals" className="border-b border-border bg-card">
        <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-border px-4 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-6 lg:px-8">
          {stats.map(({ label, value, icon: Icon }) => (
            <div key={label} className="flex items-center gap-4 py-6 sm:px-6 sm:py-7 first:sm:pl-0 last:sm:pr-0">
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-teal-50 text-teal-800 dark:bg-teal-950 dark:text-teal-200">
                <Icon aria-hidden="true" className="h-5 w-5" />
              </span>
              <div>
                <p className="text-2xl font-semibold tabular-nums">{value}</p>
                <p className="text-sm text-muted-foreground">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-primary">Process</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">From report to return</h2>
            <p className="mt-3 text-muted-foreground">Each step keeps item details and ownership claims tied to the people involved.</p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {steps.map((step) => (
              <Card key={step.number} className="rounded-lg border-border shadow-none">
                <CardHeader>
                  <p className="font-mono text-sm font-semibold text-primary">{step.number}</p>
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-6 text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {recentItems.length > 0 && (
        <section className="border-y border-border bg-muted/30 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-primary">Latest listings</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight">Recently found items</h2>
                <p className="mt-2 text-sm text-muted-foreground">These are active found-item reports from the database.</p>
              </div>
              <Link href="/browse" className="hidden items-center gap-2 text-sm font-medium text-primary underline underline-offset-4 hover:text-primary/80 sm:inline-flex">
                Browse all
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {recentItems.map((item) => (
                <ReportCard key={item.id} report={item} showClaimButton />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 border-y border-border px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight">Have an item to report?</h2>
            <p className="mt-2 text-muted-foreground">Sign in to post a lost or found item and manage responses.</p>
          </div>
          <Link href="/register">
            <Button className="h-11 rounded-md bg-primary px-5 text-primary-foreground hover:bg-primary/90">
              Create an account
              <ArrowRight aria-hidden="true" className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
