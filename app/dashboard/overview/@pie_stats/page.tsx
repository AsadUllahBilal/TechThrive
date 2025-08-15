import { delay } from '@/lib/getDBProducts';
import { PieGraph } from '@/features/overview/components/pie-graph';

export default async function Stats() {
  await delay(1000);
  return <PieGraph />;
}
