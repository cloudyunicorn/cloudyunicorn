'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabase } from '@/providers/supabase-provider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';

export default function SignUpPage() {
  const supabase = useSupabase();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [message, setMessage] = useState('');

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setErrorMsg(error.message);
    } else {
      setMessage('Sign up successful! Check your email for a confirmation link.');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md p-8 space-y-6 border bg-card/50 backdrop-blur-sm shadow-lg">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-card-foreground">Create Account</h1>
          <p className="text-muted-foreground">Join Cloudy Unicorn</p>
        </div>

        {errorMsg && (
          <Alert variant="destructive" className="text-destructive-foreground bg-destructive/90">
            {errorMsg}
          </Alert>
        )}

        {message && (
          <Alert className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
            {message}
          </Alert>
        )}

        <form onSubmit={handleSignUp} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-card-foreground" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-background border-input focus:ring-ring"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-card-foreground" htmlFor="password">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-background border-input focus:ring-ring"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Create Account
          </Button>
        </form>

        <div className="text-center text-sm space-y-2">
          <p className="text-muted-foreground">
            Already have an account?{' '}
            <Button
              variant="link"
              className="text-foreground hover:text-primary px-1 h-auto font-medium"
              asChild
            >
              <a href="/sign-in">Sign in here</a>
            </Button>
          </p>
        </div>
      </Card>
    </div>
  );
}