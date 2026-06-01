import './globals.css'

export const metadata = {
  title: 'Kannada Exam Pro - KAS | PSI | PDO | FDA | SDA',
  description: 'Prepare for Karnataka government exams with interactive quizzes',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
