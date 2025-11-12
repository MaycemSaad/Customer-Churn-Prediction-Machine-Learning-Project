/// <reference types="vite/client" />

// Déclarations pour les modules CSS
declare module '*.css' {
  const cssContent: any;
  export default cssContent;
}

// Déclarations pour les SVG
declare module '*.svg' {
  const svgContent: any;
  export default svgContent;
}

// Déclarations pour les autres assets si nécessaire
declare module '*.png' {
  const pngContent: any;
  export default pngContent;
}

declare module '*.jpg' {
  const jpgContent: any;
  export default jpgContent;
}

declare module '*.jpeg' {
  const jpegContent: any;
  export default jpegContent;
}

declare module '*.gif' {
  const gifContent: any;
  export default gifContent;
}