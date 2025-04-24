
import MainLayout from '../layouts/MainLayout';

export default function Terms() {
  return (
    <MainLayout>
      <div className="container mx-auto py-12">
        <h1 className="text-4xl font-bold text-center mb-8">Terms of Service</h1>
        <div className="max-w-3xl mx-auto space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Service Agreement</h2>
            <p className="text-muted-foreground">
              By using MoodMate, you agree to these terms and conditions. Our platform
              provides mental health support services through licensed professionals
              and AI technology.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-4">User Responsibilities</h2>
            <p className="text-muted-foreground">
              Users must provide accurate information and use the platform responsibly.
              Any misuse or violation of these terms may result in account suspension.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-4">Liability</h2>
            <p className="text-muted-foreground">
              While we strive to provide reliable services, we are not liable for any
              indirect damages or losses resulting from platform use.
            </p>
          </section>
        </div>
      </div>
    </MainLayout>
  );
}
