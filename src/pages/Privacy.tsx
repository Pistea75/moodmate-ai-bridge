
import MainLayout from '../layouts/MainLayout';

export default function Privacy() {
  return (
    <MainLayout>
      <div className="container mx-auto py-12">
        <h1 className="text-4xl font-bold text-center mb-8">Privacy Policy</h1>
        <div className="max-w-3xl mx-auto space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Data Collection</h2>
            <p className="text-muted-foreground">
              We collect only the information necessary to provide our services,
              including personal information you provide and data generated through
              your use of the platform.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-4">Data Protection</h2>
            <p className="text-muted-foreground">
              All data is encrypted and stored securely. We follow HIPAA guidelines
              and implement industry-standard security measures to protect your information.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
            <p className="text-muted-foreground">
              You have the right to access, modify, or delete your personal information
              at any time through your account settings.
            </p>
          </section>
        </div>
      </div>
    </MainLayout>
  );
}
