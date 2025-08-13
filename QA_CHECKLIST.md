# 📋 Checklist de verificación post-cambios

## 1. index.html
- [ ] El `<script src="https://cdn.gpteng.co/gptengineer.js">` ya no está
- [ ] `<title>` muestra "MoodMate — Plataforma de Salud Mental"
- [ ] `<meta name="description">` tiene el texto actualizado de MoodMate
- [ ] Metas OG (`og:title`, `og:description`, `og:image`) y Twitter están presentes y correctas
- [ ] Existe `/public/og-image.png` con tu branding
- [ ] `<link rel="canonical">` y `<meta name="robots">` están presentes

## 2. Supabase
- [ ] En `src/integrations/supabase/client.ts` se usan variables de entorno (`import.meta.env.VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`)
- [ ] `.env` (o variables en Lovable) contiene:
  ```ini
  VITE_SUPABASE_URL=...
  VITE_SUPABASE_ANON_KEY=...
  VITE_APP_ENV=development
  ```
- [ ] App se conecta correctamente a Supabase en modo dev y prod

## 3. Code splitting y LoadingFallback
- [ ] En `src/App.tsx` las páginas usan `React.lazy(...)` y están envueltas en `<Suspense fallback={<LoadingFallback />}>`
- [ ] Existe `src/components/common/LoadingFallback.tsx` con el loader animado
- [ ] Navegar a una ruta carga el fallback si el bundle de esa página está pendiente

## 4. TypeScript y ESLint
- [ ] `tsconfig.json` tiene `"noImplicitAny": true`, `"strictNullChecks": true`, `"noUnusedParameters": true`, `"noUnusedLocals": true`
- [ ] `eslint.config.js` contiene:
  ```js
  "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_", "ignoreRestSiblings": true }]
  ```
- [ ] Correr `pnpm lint` muestra advertencias si hay variables sin usar

## 5. Robots.txt
- [ ] En staging:
  ```
  User-agent: *
  Disallow: /
  ```
- [ ] En producción:
  ```
  User-agent: *
  Allow: /
  ```

## 6. Seguridad
- [ ] En el hosting (Vercel/Netlify) están configurados headers HTTP con CSP, X-Content-Type-Options y Referrer-Policy
- [ ] Probar en navegador: abrir DevTools → pestaña Network → response headers → confirmar presencia de estas cabeceras

## 7. Assets e imágenes
- [ ] `public/lovable-uploads/` ya no contiene imágenes de ejemplo de Lovable
- [ ] Todas las imágenes propias están optimizadas (WebP si posible) y con atributos `width`/`height`

## 8. SEO extra
- [ ] `index.html` tiene `<link rel="canonical">` y `<meta name="robots">`
- [ ] Favicon y manifest (`/public/favicon.ico` y `site.webmanifest`) están personalizados

## 9. Accesibilidad
- [ ] Todos los `<button>` dentro de `<form>` tienen `type="button"` (o `type="submit"` si es envío real)
- [ ] Botones solo con icono tienen `aria-label`
- [ ] Contrastes de color correctos y focus visibles

## 10. i18n
- [ ] Todas las cadenas tienen traducción en EN y ES
- [ ] Selector de idioma visible si el público es bilingüe
- [ ] MoodMate (marca) no se traduce

## 11. Tests y scripts
- [ ] `pnpm typecheck` corre sin errores
- [ ] `pnpm format` formatea el código correctamente
- [ ] Si añadiste tests, `pnpm test` pasa sin fallos

## 12. Variables de entorno
- [ ] `.env` configurado con todas las variables necesarias
- [ ] Variables de producción configuradas en el hosting

## 13. Performance
- [ ] Code splitting implementado con React.lazy
- [ ] Loading states implementados
- [ ] Imágenes optimizadas

## Configuración recomendada para hosting

### Vercel (`vercel.json`)
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "Content-Security-Policy", "value": "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self' https://*.supabase.co;" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
      ]
    }
  ]
}
```

### Netlify (`_headers`)
```
/*
  Content-Security-Policy: default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self' https://*.supabase.co;
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
```

### Scripts recomendados para `package.json`
```json
{
  "scripts": {
    "typecheck": "tsc --noEmit",
    "format": "prettier --write ."
  }
}
```