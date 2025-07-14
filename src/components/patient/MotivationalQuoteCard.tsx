
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Quote } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useMotivationalQuotes } from "@/hooks/useMotivationalQuotes";

export function MotivationalQuoteCard() {
  const { t } = useLanguage();
  const { quote } = useMotivationalQuotes();

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <Quote className="h-5 w-5" />
          {t('dailyInspiration')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <blockquote className="text-blue-700 italic text-center">
          "{quote}"
        </blockquote>
      </CardContent>
    </Card>
  );
}
