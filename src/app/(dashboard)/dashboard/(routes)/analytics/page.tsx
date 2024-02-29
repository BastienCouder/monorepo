import { DataCard } from './_components/data-card';
import { Chart } from './_components/chart';
import { getAnalytics } from '@/lib/db/get-analytics';
import { currentUser } from '@/lib/authCheck';

export default async function AnalyticsPage() {
  const session = await currentUser();
  const userId = session?.id;
  if (userId) {
    const { data, totalRevenue, totalSales } = await getAnalytics(userId);

    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <DataCard label="Total Revenue" value={totalRevenue} shouldFormat />
          <DataCard label="Total Sales" value={totalSales} />
        </div>
        <Chart data={data} />
      </div>
    );
  }
}
