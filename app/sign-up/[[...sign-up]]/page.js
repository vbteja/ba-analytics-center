import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#060606',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <SignUp />
    </div>
  )
}