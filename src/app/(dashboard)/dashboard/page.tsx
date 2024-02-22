import { Metadata } from 'next';
// import { subDays } from "date-fns"

// import { db } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// import { Overview } from "./components/overview"
// import { AuditLog } from "./components/audit-log"
// import Search from "./components/search"
// import Title from "./components/title"

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Overview',
};

// export const revalidate = 0

export default async function DashboardPage() {
  return (
    <>
      <div className="h-full flex-1 flex-col space-y-4">
        <div className="flex flex-row flex-wrap items-center justify-between space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
          {/* <Search from={from} to={to} /> */}
        </div>
        {/* <Title totalMiles={data._sum.miles} totalTrips={data._count.id} /> */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              {/* <Overview data={overviewData} /> */}
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Audit Logs</CardTitle>
              {/* <CardDescription>You made 265 sales this month.</CardDescription> */}
            </CardHeader>
            <CardContent>{/* <AuditLog data={auditLogData} /> */}</CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
