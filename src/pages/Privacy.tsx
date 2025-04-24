
import { PublicNav } from '../components/PublicNav';

export default function Privacy() {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicNav />
      <div className="flex-1">
        <div className="bg-gradient-to-b from-mood-purple/10 to-transparent py-12 md:py-20">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-6">Privacy Policy</h1>
            <p className="text-lg text-muted-foreground text-center max-w-3xl mx-auto">
              How we protect your data and respect your privacy
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto space-y-10">
            <div className="prose prose-lg max-w-none">
              <section>
                <h2 className="text-2xl font-semibold text-mood-purple">Data Collection</h2>
                <p className="text-muted-foreground">
                  We collect only the information necessary to provide our services,
                  including personal information you provide and data generated through
                  your use of the platform. This includes:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-4">
                  <li>Account information (name, email, password)</li>
                  <li>Health information you choose to share</li>
                  <li>Interaction data with our platform</li>
                  <li>Device and usage information</li>
                </ul>
              </section>
              
              <section className="mt-8">
                <h2 className="text-2xl font-semibold text-mood-purple">Data Protection</h2>
                <p className="text-muted-foreground">
                  All data is encrypted and stored securely. We follow HIPAA guidelines
                  and implement industry-standard security measures to protect your information.
                  Our security measures include:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-4">
                  <li>End-to-end encryption for sensitive data</li>
                  <li>Regular security audits and penetration testing</li>
                  <li>Access controls and authentication protocols</li>
                  <li>Continuous monitoring for unauthorized access</li>
                </ul>
              </section>
              
              <section className="mt-8">
                <h2 className="text-2xl font-semibold text-mood-purple">Your Rights</h2>
                <p className="text-muted-foreground">
                  You have the right to access, modify, or delete your personal information
                  at any time through your account settings. Additionally, you can:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-4">
                  <li>Request a copy of all your data</li>
                  <li>Opt out of certain data collection practices</li>
                  <li>Request complete deletion of your account and associated data</li>
                  <li>Lodge a complaint with relevant data protection authorities</li>
                </ul>
              </section>
              
              <section className="mt-8">
                <h2 className="text-2xl font-semibold text-mood-purple">Cookies and Tracking</h2>
                <p className="text-muted-foreground">
                  We use cookies and similar technologies to enhance your experience,
                  analyze usage patterns, and personalize content. You can manage cookie
                  preferences through your browser settings at any time.
                </p>
              </section>
              
              <section className="mt-8">
                <h2 className="text-2xl font-semibold text-mood-purple">Updates to This Policy</h2>
                <p className="text-muted-foreground">
                  We may update this privacy policy periodically to reflect changes in our
                  practices or for legal, operational, or regulatory reasons. We will notify
                  you of significant changes through the platform or via email.
                </p>
                <p className="text-muted-foreground mt-4">
                  Last updated: April 24, 2025
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
      
      <footer className="border-t py-8 bg-muted/30">
        <div className="container mx-auto px-4 text-sm text-center text-muted-foreground">
          &copy; {new Date().getFullYear()} MoodMate. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
