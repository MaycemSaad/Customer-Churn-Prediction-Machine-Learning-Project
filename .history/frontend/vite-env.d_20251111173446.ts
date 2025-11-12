/// <reference types="vite/client" />

// Si l'erreur persiste, utilisez cette approche alternative :
interface ImportMetaEnv {
  readonly VITE_API_URL: string
  // ajoutez d'autres variables d'environnement ici si nécessaire
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Déclarations pour les modules CSS
declare module '*.css' {
  const cssContent: { [className: string]: string }
  export default cssContent
}

// Déclarations pour les SVG
declare module '*.svg' {
  const svgContent: string
  export default svgContent
}

// Déclarations pour les autres assets
declare module '*.png' {
  const pngContent: string
  export default pngContent
}

declare module '*.jpg' {
  const jpgContent: string
  export default jpgContent
}

declare module '*.jpeg' {
  const jpegContent: string
  export default jpegContent
}

declare module '*.gif' {
  const gifContent: string
  export default gifContent
}