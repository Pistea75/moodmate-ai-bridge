
import { TestSignup } from '@/components/auth/TestSignup';
import MainLayout from '@/layouts/MainLayout';

export default function TestPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 max-w-md">
        <h1 className="text-2xl font-bold mb-6">Test User Signup</h1>
        <TestSignup />
      </div>
    </MainLayout>
  );
}
