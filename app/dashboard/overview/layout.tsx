// app/(dashboard)/overview/page.tsx
import PageContainer from "@/components/layout/page-container";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardFooter,
} from "@/components/ui/card";
import {
  IconTrendingDown,
  IconTrendingUp,
  IconUsers,
  IconShoppingBag,
  IconBox,
  IconCurrencyDollar,
} from "@tabler/icons-react";
import { getOverviewStats } from "@/lib/stats";

export const revalidate = 0;
// or: export const dynamic = "force-dynamic";

export default async function OverViewLayout({
  sales,
  pie_stats,
  bar_stats,
  area_stats
}: {
  sales: React.ReactNode;
  pie_stats: React.ReactNode;
  bar_stats: React.ReactNode;
  area_stats: React.ReactNode;
}) {
  const { kpi, charts } = await getOverviewStats();

  const pctBadge = (pct: number) => (
    <Badge variant="outline">
      {pct >= 0 ? <IconTrendingUp className="size-4 mr-1" /> : <IconTrendingDown className="size-4 mr-1" />}
      {pct >= 0 ? `+${pct}%` : `${pct}%`}
    </Badge>
  );

  return (
    <PageContainer>
      <div className="flex flex-1 flex-col space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">
            TechThrive Overview
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardDescription>Total Users</CardDescription>
              <CardTitle className="text-2xl tabular-nums">{kpi.totalUsers.toLocaleString()}</CardTitle>
              <CardAction>{pctBadge(kpi.usersDeltaPct)}</CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="flex gap-2 font-medium">
                Growing user base <IconUsers className="size-4" />
              </div>
              <div className="text-muted-foreground">Last 30 days vs previous</div>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>Total Orders</CardDescription>
              <CardTitle className="text-2xl tabular-nums">{kpi.totalOrders.toLocaleString()}</CardTitle>
              <CardAction>{pctBadge(kpi.ordersDeltaPct)}</CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="flex gap-2 font-medium">
                Order volume <IconShoppingBag className="size-4" />
              </div>
              <div className="text-muted-foreground">Last 30 days vs previous</div>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>Total Products</CardDescription>
              <CardTitle className="text-2xl tabular-nums">{kpi.totalProducts.toLocaleString()}</CardTitle>
              <CardAction>
                <Badge variant="outline">
                  <IconTrendingUp className="size-4 mr-1" /> +inventory
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="flex gap-2 font-medium">
                Catalog size <IconBox className="size-4" />
              </div>
              <div className="text-muted-foreground">Active listings</div>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>Total Revenue</CardDescription>
              <CardTitle className="text-2xl tabular-nums">
                ${kpi.totalRevenue.toLocaleString()}
              </CardTitle>
              <CardAction>{pctBadge(kpi.revenueDeltaPct)}</CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="flex gap-2 font-medium">
                Net revenue <IconCurrencyDollar className="size-4" />
              </div>
              <div className="text-muted-foreground">Paid & completed orders</div>
            </CardFooter>
          </Card>
        </div>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7'>
          <div className='col-span-4'>{bar_stats}</div>
          <div className='col-span-4 md:col-span-3'>
            {/* sales arallel routes */}
            {sales}
          </div>
          <div className='col-span-4'>{area_stats}</div>
          <div className='col-span-4 md:col-span-3'>{pie_stats}</div>
        </div>

      </div>
    </PageContainer>
  );
}