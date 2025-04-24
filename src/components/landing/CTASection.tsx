
import { Link } from 'react-router-dom';

export function CTASection() {
  return (
    <section className="w-full bg-mood-purple/10 py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Transform Mental Healthcare?</h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Join thousands of healthcare professionals and patients who are already experiencing
          the benefits of AI-enhanced mental health support.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/signup/patient" 
            className="px-8 py-3 bg-mood-purple hover:bg-mood-purple/90 text-white font-medium rounded-full"
          >
            Get Started Now
          </Link>
          <Link 
            to="/contact" 
            className="px-8 py-3 bg-white border border-mood-purple text-mood-purple hover:bg-mood-purple/10 font-medium rounded-full"
          >
            Contact Sales
          </Link>
        </div>
      </div>
    </section>
  );
}
