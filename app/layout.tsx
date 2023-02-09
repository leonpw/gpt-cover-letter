import './globals.css'
import Image from 'next/image'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body>
        <div className="wrapper">
          {children}
          
        </div>
        <footer className="footer">
           <a target="_blank" rel="no-opener" href="https://github.com/leonpw/gpt-cover-letter">
           <Image style={{ marginTop: '2px'}} alt="code available on github" width="18" height="18" src="/github.svg" />
           </a>
            <p>
             Built with 🫶 by <a target="_blank" rel="no-opener" href="https://wieisleon.nl/">Leon de Pruyssenaere de la Woestijne</a> <a className="sponsor" target="_blank" rel="no-opener" href="https://github.com/leonpw/gpt-cover-letter"> 💸 Sponsor this project </a>
            </p>
        </footer>
      </body>
    </html>
  )
}
