import { redirect } from 'next/navigation';

export default function AdminPage() {
  // Always redirect root /admin to /admin/users
  redirect('/admin/users');
}
