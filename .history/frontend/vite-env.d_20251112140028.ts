/// <reference types="vite/client" />

// Déclarations pour les assets
declare module '*.css' {
  const cssStyles: { [className: string]: string }
  export default cssStyles
}

declare module '*.scss' {
  const scssStyles: { [className: string]: string }
  export default scssStyles
}

declare module '*.svg' {
  const svgUrl: string
  export default svgUrl
}

declare module '*.png' {
  const pngUrl: string
  export default pngUrl
}

declare module '*.jpg' {
  const jpgUrl: string
  export default jpgUrl
}

declare module '*.jpeg' {
  const jpegUrl: string
  export default jpegUrl
}

declare module '*.gif' {
  const gifUrl: string
  export default gifUrl
}