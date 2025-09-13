import React, { useMemo } from 'react';

interface Props {
  code: string; // código de invitación generado
  patientName?: string;
}

export default function InvitePatientCard({ code, patientName }: Props) {
  const inviteUrl = useMemo(() => `${window.location.origin}/invite/${code}`, [code]);
  const message = useMemo(() => `Hola 👋 ${patientName ?? ''} te invito a registrarte en MoodMate: ${inviteUrl} (expira en 72h)`, [inviteUrl, patientName]);
  const waHref = useMemo(() => `https://wa.me/?text=${encodeURIComponent(message)}`, [message]);

  const handleOpenWhatsApp = () => {
    // ✅ Abrir en nueva pestaña por gesto del usuario (evita bloqueos)
    window.open(waHref, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-3">
      <div className="text-sm">
        <div className="font-medium">Enlace de invitación</div>
        <input className="w-full input" value={inviteUrl} readOnly onFocus={(e) => e.currentTarget.select()} />
      </div>
      <div className="flex gap-2">
        <button className="btn btn-primary" onClick={handleOpenWhatsApp}>Abrir WhatsApp</button>
        <button className="btn" onClick={() => navigator.clipboard.writeText(inviteUrl)}>Copiar enlace</button>
      </div>
      <p className="text-xs text-muted-foreground">Si WhatsApp no abre, revisa extensiones/ad-blockers o prueba en otro navegador. El enlace directo también funciona.</p>
    </div>
  );
}