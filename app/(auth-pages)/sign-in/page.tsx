'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabase } from '@/providers/supabase-provider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';

export default function SignInPage() {
  const supabase = useSupabase();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setErrorMsg(error.message);
    } else {
      router.push('/dashboard');
    }
  }

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-background">
      <Card className="w-full max-w-md p-8 space-y-6 border bg-card/50 backdrop-blur-sm shadow-lg">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-card-foreground">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to Cloudy Unicorn</p>
        </div>

        {errorMsg && (
          <Alert variant="destructive" className="text-destructive-foreground bg-destructive/90">
            {errorMsg}
          </Alert>
        )}

        <form onSubmit={handleSignIn} className="space-y-4">
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
            Sign In
          </Button>
        </form>

        <div className="text-center text-sm space-y-2">
          <p className="text-muted-foreground">
            Don't have an account?{' '}
            <Button
              variant="link"
              className="text-foreground hover:text-primary px-1 h-auto font-medium"
              asChild
            >
              <a href="/sign-up">Create account</a>
            </Button>
          </p>
          <Button
            variant="link"
            className="text-muted-foreground hover:text-foreground h-auto text-xs"
            asChild
          >
            <a href="/forgot-password">Forgot password?</a>
          </Button>
        </div>
      </Card>
    </div>
  );
}