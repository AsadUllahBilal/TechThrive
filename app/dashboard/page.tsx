import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '../(root)/api/auth/[...nextauth]/route';

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return redirect('/login');
  } else {
    redirect('/dashboard/overview');
  }
}