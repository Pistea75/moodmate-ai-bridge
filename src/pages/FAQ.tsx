
import MainLayout from '../layouts/MainLayout';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQ() {
  const faqs = [
    {
      question: "How does the AI companion work?",
      answer: "Our AI companion uses advanced natural language processing to provide 24/7 support, complementing your therapy sessions with personalized assistance."
    },
    {
      question: "Is my data secure?",
      answer: "Yes, we use end-to-end encryption and follow strict HIPAA guidelines to ensure your data remains private and secure."
    },
    {
      question: "Can I switch therapists?",
      answer: "Yes, you can request to change therapists at any time through your account settings."
    },
    {
      question: "How do I schedule sessions?",
      answer: "You can schedule sessions directly through the platform using our booking system, which syncs with your therapist's availability."
    }
  ];

  return (
    <MainLayout>
      <div className="container mx-auto py-12">
        <h1 className="text-4xl font-bold text-center mb-8">Frequently Asked Questions</h1>
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </MainLayout>
  );
}
