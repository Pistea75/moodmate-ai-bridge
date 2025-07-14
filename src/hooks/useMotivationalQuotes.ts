
import { useState, useEffect } from 'react';

const motivationalQuotes = [
  "Every small step forward is progress worth celebrating.",
  "Your mental health journey is unique and valid.",
  "Healing is not linear, and that's perfectly okay.",
  "You have the strength to overcome challenges.",
  "Self-care isn't selfish—it's necessary.",
  "Growth happens outside your comfort zone.",
  "Today is a new opportunity to care for yourself.",
  "You are more resilient than you realize.",
  "Progress, not perfection, is the goal.",
  "Your feelings are valid and deserve attention.",
];

export function useMotivationalQuotes() {
  const [quote, setQuote] = useState('');

  useEffect(() => {
    // Get a different quote each day
    const today = new Date().toDateString();
    const savedDate = localStorage.getItem('quote-date');
    const savedQuote = localStorage.getItem('daily-quote');

    if (savedDate === today && savedQuote) {
      setQuote(savedQuote);
    } else {
      const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
      const newQuote = motivationalQuotes[randomIndex];
      setQuote(newQuote);
      localStorage.setItem('quote-date', today);
      localStorage.setItem('daily-quote', newQuote);
    }
  }, []);

  return { quote };
}
