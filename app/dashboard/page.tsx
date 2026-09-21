import { requireAuth } from '@/lib/auth';
import DashboardClient from './DashboardClient';

export default async function DashboardPage() {
  await requireAuth();
  return <DashboardClient />;
}
