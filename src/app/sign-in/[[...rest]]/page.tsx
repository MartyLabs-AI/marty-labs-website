import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/30 font-mono">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Welcome Back
            </span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Sign in to access <strong>Marty Labs</strong> AI Creative Studio
          </p>
        </div>
        <SignIn 
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "bg-card/95 backdrop-blur-xl shadow-2xl border border-border rounded-2xl",
            }
          }}
        />
      </div>
    </div>
  )
}