import localFont from 'next/font/local';
import "./globals.css";

// 1. Initialize your downloaded Poppins font file
const poppins = localFont({
  src: '../public/fonts/Poppins-Regular.ttf', // Path to your downloaded file
  variable: '--font-poppins', 
});

const orbitron = localFont({
  src: "../public/fonts/Orbitron-VariableFont_wght.ttf",
  variable: "--font-orbitron"
}
)
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      // 2. Inject the CSS variable name here
      className={`h-full antialiased ${poppins.variable} ${orbitron.variable}`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
