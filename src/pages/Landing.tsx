// Simplified version for debugging deployment
export default function Landing() {
  console.log('Landing component loaded successfully');
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center p-8">
        <h1 className="text-4xl font-bold mb-4">MoodMate</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Tu compañero de salud mental
        </p>
        <p className="text-sm text-muted-foreground">
          La aplicación se está cargando correctamente
        </p>
      </div>
    </div>
  );
}
