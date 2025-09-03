import { RoleTestingSwitcher } from '@/components/RoleTestingSwitcher';

export default function TestMarketplace() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-foreground">
              Marketplace Testing
            </h1>
            <p className="text-muted-foreground">
              Test marketplace functionality across different user roles
            </p>
          </div>
          
          <RoleTestingSwitcher />
        </div>
      </div>
    </div>
  );
}