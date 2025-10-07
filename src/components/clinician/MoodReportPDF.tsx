
'use client';

import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { saveAs } from 'file-saver';
import { format } from 'date-fns';

interface MoodReportPDFProps {
  patientId: string;
  patientName: string;
}

export function MoodReportPDF({ patientId, patientName }: MoodReportPDFProps) {
  const fetchMoodAndTasks = async () => {
    const since = new Date();
    since.setDate(since.getDate() - 7);

    const { data: moodEntries } = await supabase
      .from('mood_entries')
      .select('created_at, mood_score, notes, triggers')
      .eq('patient_id', patientId)
      .gte('created_at', since.toISOString())
      .order('created_at');

    const { data: tasks } = await supabase
      .from('tasks')
      .select('title, due_date, completed')
      .eq('patient_id', patientId)
      .gte('due_date', since.toISOString());

    return { moodEntries: moodEntries || [], tasks: tasks || [] };
  };

  const generatePDF = async () => {
    const { moodEntries, tasks } = await fetchMoodAndTasks();
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const titleSize = 18;
    const textSize = 11;
    let y = height - 50;

    // Header
    page.drawText('MoodMate - Weekly Mood Report', {
      x: 50,
      y,
      size: titleSize,
      font,
      color: rgb(0.6, 0.5, 0.96),
    });

    y -= 30;
    page.drawText(`Patient: ${patientName}`, { x: 50, y, size: textSize, font });
    y -= 20;
    page.drawText(`Date Range: ${format(new Date(Date.now() - 6 * 864e5), 'MMM d')} – ${format(new Date(), 'MMM d, yyyy')}`, {
      x: 50,
      y,
      size: textSize,
      font,
    });

    // Mood Entries
    y -= 30;
    page.drawText('Mood Entries:', { x: 50, y, size: textSize + 1, font });
    y -= 15;

    if (moodEntries.length === 0) {
      page.drawText('No entries logged this week.', { x: 60, y, size: textSize, font });
      y -= 20;
    } else {
      for (const entry of moodEntries) {
        const mood = `Score: ${entry.mood_score}`;
        const date = format(new Date(entry.created_at), 'MMM d');
        const notes = entry.notes || '-';
        const triggers = (entry.triggers || []).join(', ') || '-';

        page.drawText(`• ${date} – ${mood} | Triggers: ${triggers} | Notes: ${notes}`, {
          x: 60,
          y,
          size: textSize,
          font,
        });
        y -= 15;
        if (y < 100) {
          y = height - 50;
          pdfDoc.addPage();
        }
      }
    }

    // Task Summary
    y -= 20;
    page.drawText('Tasks Summary:', { x: 50, y, size: textSize + 1, font });
    y -= 15;

    if (tasks.length === 0) {
      page.drawText('No tasks in the selected range.', { x: 60, y, size: textSize, font });
    } else {
      for (const task of tasks) {
        const due = format(new Date(task.due_date), 'MMM d');
        const status = task.completed ? '✅' : '⬜';
        page.drawText(`• ${status} ${task.title} (Due: ${due})`, {
          x: 60,
          y,
          size: textSize,
          font,
        });
        y -= 15;
        if (y < 100) {
          y = height - 50;
          pdfDoc.addPage();
        }
      }
    }

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([new Uint8Array(pdfBytes.buffer as ArrayBuffer)], { type: 'application/pdf' });
    saveAs(blob, `${patientName}_MoodMate_Report.pdf`);
  };

  return (
    <Button onClick={generatePDF} variant="default" className="mt-4">
      Export Weekly PDF
    </Button>
  );
}
