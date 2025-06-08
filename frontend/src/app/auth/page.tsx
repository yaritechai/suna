'use client';

import Link from 'next/link';
import { SubmitButton } from '@/components/ui/submit-button';
import { Input } from '@/components/ui/input';
import GoogleSignIn from '@/components/GoogleSignIn';
import { FlickeringGrid } from '@/components/home/ui/flickering-grid';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useState, useEffect, useRef, Suspense } from 'react';
import { useScroll } from 'motion/react';
import { signIn, signUp, forgotPassword } from './actions';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  X,
  CheckCircle,
  AlertCircle,
  MailCheck,
  Loader2,
} from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading } = useAuth();
  const mode = searchParams.get('mode');
  const returnUrl = searchParams.get('returnUrl');
  const message = searchParams.get('message');

  const isSignUp = mode === 'signup';
  const tablet = useMediaQuery('(max-width: 1024px)');
  const [mounted, setMounted] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
  const { scrollY } = useScroll();

  // Redirect if user is already logged in, checking isLoading state
  useEffect(() => {
    if (!isLoading && user) {
      router.push(returnUrl || '/dashboard');
    }
  }, [user, isLoading, router, returnUrl]);

  // Determine if message is a success message
  const isSuccessMessage =
    message &&
    (message.includes('Check your email') ||
      message.includes('Account created') ||
      message.includes('success'));

  // Registration success state
  const [registrationSuccess, setRegistrationSuccess] =
    useState(!!isSuccessMessage);
  const [registrationEmail, setRegistrationEmail] = useState('');

  // Forgot password state
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordStatus, setForgotPasswordStatus] = useState<{
    success?: boolean;
    message?: string;
  }>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  // Set registration success state from URL params
  useEffect(() => {
    if (isSuccessMessage) {
      setRegistrationSuccess(true);
    }
  }, [isSuccessMessage]);

  // Detect when scrolling is active to reduce animation complexity
  useEffect(() => {
    const unsubscribe = scrollY.on('change', () => {
      setIsScrolling(true);

      // Clear any existing timeout
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }

      // Set a new timeout
      scrollTimeout.current = setTimeout(() => {
        setIsScrolling(false);
      }, 300); // Wait 300ms after scroll stops
    });

    return () => {
      unsubscribe();
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, [scrollY]);

  const handleSignIn = async (prevState: any, formData: FormData) => {
    if (returnUrl) {
      formData.append('returnUrl', returnUrl);
    } else {
      formData.append('returnUrl', '/dashboard');
    }
    const result = await signIn(prevState, formData);

    // Check for success and redirectTo properties
    if (
      result &&
      typeof result === 'object' &&
      'success' in result &&
      result.success &&
      'redirectTo' in result
    ) {
      // Use window.location for hard navigation to avoid stale state
      window.location.href = result.redirectTo as string;
      return null; // Return null to prevent normal form action completion
    }

    return result;
  };

  const handleSignUp = async (prevState: any, formData: FormData) => {
    // Store email for success state
    const email = formData.get('email') as string;
    setRegistrationEmail(email);

    if (returnUrl) {
      formData.append('returnUrl', returnUrl);
    }

    // Add origin for email redirects
    formData.append('origin', window.location.origin);

    const result = await signUp(prevState, formData);

    // Check for success and redirectTo properties (direct login case)
    if (
      result &&
      typeof result === 'object' &&
      'success' in result &&
      result.success &&
      'redirectTo' in result
    ) {
      // Use window.location for hard navigation to avoid stale state
      window.location.href = result.redirectTo as string;
      return null; // Return null to prevent normal form action completion
    }

    // Check if registration was successful but needs email verification
    if (result && typeof result === 'object' && 'message' in result) {
      const resultMessage = result.message as string;
      if (resultMessage.includes('Check your email')) {
        setRegistrationSuccess(true);

        // Update URL without causing a refresh
        const params = new URLSearchParams(window.location.search);
        params.set('message', resultMessage);

        const newUrl =
          window.location.pathname +
          (params.toString() ? '?' + params.toString() : '');

        window.history.pushState({ path: newUrl }, '', newUrl);

        return result;
      }
    }

    return result;
  };

  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setForgotPasswordStatus({});

    if (!forgotPasswordEmail || !forgotPasswordEmail.includes('@')) {
      setForgotPasswordStatus({
        success: false,
        message: 'Please enter a valid email address',
      });
      return;
    }

    const formData = new FormData();
    formData.append('email', forgotPasswordEmail);
    formData.append('origin', window.location.origin);

    const result = await forgotPassword(null, formData);

    setForgotPasswordStatus(result);
  };

  const resetRegistrationSuccess = () => {
    setRegistrationSuccess(false);
    // Remove message from URL and set mode to signin
    const params = new URLSearchParams(window.location.search);
    params.delete('message');
    params.set('mode', 'signin');

    const newUrl =
      window.location.pathname +
      (params.toString() ? '?' + params.toString() : '');

    window.history.pushState({ path: newUrl }, '', newUrl);

    router.refresh();
  };

  // Show loading spinner while checking auth state
  if (isLoading) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen w-full bg-zinc-950">
        <Loader2 className="h-12 w-12 animate-spin text-yellow-400" />
      </main>
    );
  }

  // Registration success view
  if (registrationSuccess) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen w-full bg-zinc-950">
        <div className="w-full">
          <section className="w-full relative overflow-hidden">
            <div className="relative flex flex-col items-center w-full px-6">
              {/* Background elements from the original view */}
              <div className="absolute left-0 top-0 h-[600px] md:h-[800px] w-1/3 -z-10 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-zinc-950 z-10" />
                <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-zinc-950 via-zinc-950/90 to-transparent z-10" />
                <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-zinc-950 via-zinc-950/90 to-transparent z-10" />
              </div>

              <div className="absolute right-0 top-0 h-[600px] md:h-[800px] w-1/3 -z-10 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-zinc-950 z-10" />
                <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-zinc-950 via-zinc-950/90 to-transparent z-10" />
                <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-zinc-950 via-zinc-950/90 to-transparent z-10" />
              </div>

              <div className="absolute inset-x-1/4 top-0 h-[600px] md:h-[800px] -z-20 bg-zinc-950 rounded-b-xl"></div>

              {/* Success content */}
              <div className="relative z-10 pt-24 pb-8 max-w-xl mx-auto h-full w-full flex flex-col gap-2 items-center justify-center">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-green-50 dark:bg-green-950/20 rounded-full p-4 mb-6">
                    <MailCheck className="h-12 w-12 text-green-500 dark:text-green-400" />
                  </div>

                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tighter text-center text-balance text-white mb-4">
                    Check your email
                  </h1>

                  <p className="text-base md:text-lg text-center text-white/70 font-medium text-balance leading-relaxed tracking-tight max-w-md mb-2">
                    We've sent a confirmation link to:
                  </p>

                  <p className="text-lg font-medium mb-6 text-white">
                    {registrationEmail || 'your email address'}
                  </p>

                  <div className="bg-green-950/20 border border-green-900/50 rounded-lg p-6 mb-8 max-w-md w-full backdrop-blur-sm">
                    <p className="text-sm text-green-400 leading-relaxed">
                      Click the link in the email to activate your account. If
                      you don't see the email, check your spam folder.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
                    <Link
                      href="/"
                      className="flex h-12 items-center justify-center w-full text-center rounded-full border border-white/20 bg-white/10 hover:bg-white/20 transition-all text-white backdrop-blur-sm"
                    >
                      Return to home
                    </Link>
                    <button
                      onClick={resetRegistrationSuccess}
                      className="flex h-12 items-center justify-center w-full text-center rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:from-yellow-300 hover:to-orange-400 transition-all shadow-md font-medium"
                    >
                      Back to sign in
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen w-full bg-zinc-950">
      <div className="w-full">
        {/* Hero-like header with flickering grid */}
        <section className="w-full relative overflow-hidden">
          <div className="relative flex flex-col items-center w-full px-6">
            {/* Left side flickering grid with gradient fades */}
            <div className="absolute left-0 top-0 h-[600px] md:h-[800px] w-1/3 -z-10 overflow-hidden">
              {/* Horizontal fade from left to right */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-zinc-950 z-10" />

              {/* Vertical fade from top */}
              <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-zinc-950 via-zinc-950/90 to-transparent z-10" />

              {/* Vertical fade to bottom */}
              <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-zinc-950 via-zinc-950/90 to-transparent z-10" />

              <div className="h-full w-full">
                <FlickeringGrid
                  className="h-full w-full"
                  squareSize={mounted && tablet ? 2 : 2.5}
                  gridGap={mounted && tablet ? 2 : 2.5}
                  color="#fbbf24"
                  maxOpacity={0.4}
                  flickerChance={isScrolling ? 0.01 : 0.03}
                />
              </div>
            </div>

            {/* Right side flickering grid with gradient fades */}
            <div className="absolute right-0 top-0 h-[600px] md:h-[800px] w-1/3 -z-10 overflow-hidden">
              {/* Horizontal fade from right to left */}
              <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-zinc-950 z-10" />

              {/* Vertical fade from top */}
              <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-zinc-950 via-zinc-950/90 to-transparent z-10" />

              {/* Vertical fade to bottom */}
              <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-zinc-950 via-zinc-950/90 to-transparent z-10" />

              <div className="h-full w-full">
                <FlickeringGrid
                  className="h-full w-full"
                  squareSize={mounted && tablet ? 2 : 2.5}
                  gridGap={mounted && tablet ? 2 : 2.5}
                  color="#fbbf24"
                  maxOpacity={0.4}
                  flickerChance={isScrolling ? 0.01 : 0.03}
                />
              </div>
            </div>

            {/* Center content background with rounded bottom */}
            <div className="absolute inset-x-1/4 top-0 h-[600px] md:h-[800px] -z-20 bg-zinc-950 rounded-b-xl"></div>

            {/* Header content */}
            <div className="relative z-10 pt-24 pb-8 max-w-md mx-auto h-full w-full flex flex-col gap-2 items-center justify-center">
              <Link
                href="/"
                className="group border border-white/20 bg-white/10 hover:bg-white/20 rounded-full text-sm h-8 px-3 flex items-center gap-2 transition-all duration-200 shadow-sm mb-6 backdrop-blur-sm"
              >
                <ArrowLeft className="h-4 w-4 text-white/70" />
                <span className="font-medium text-white/70 text-xs tracking-wide">
                  Back to home
                </span>
              </Link>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tighter text-center text-balance text-white">
                {isSignUp ? 'Join Suna' : 'Welcome back'}
              </h1>
              <p className="text-base md:text-lg text-center text-white/70 font-medium text-balance leading-relaxed tracking-tight mt-2 mb-6">
                {isSignUp
                  ? 'Create your account and start building with AI'
                  : 'Sign in to your account to continue'}
              </p>
            </div>
          </div>

          {/* Auth form card */}
          <div className="relative z-10 flex justify-center px-6 pb-24">
            <div className="w-full max-w-md rounded-xl bg-black/40 backdrop-blur-xl border border-white/10 p-8 shadow-2xl">
              {/* Non-registration related messages */}
              {message && !isSuccessMessage && (
                <div className="mb-6 p-4 rounded-lg flex items-center gap-3 bg-red-950/20 border border-red-900/50 text-red-400 backdrop-blur-sm">
                  <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-400" />
                  <span className="text-sm font-medium">{message}</span>
                </div>
              )}

              {/* Google Sign In */}
              <div className="w-full">
                <GoogleSignIn returnUrl={returnUrl || undefined} />
              </div>

              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-black/40 text-white/70">
                    or continue with email
                  </span>
                </div>
              </div>

              {/* Form */}
              <form className="space-y-4">
                <div>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Email address"
                    className="h-12 rounded-full bg-white/10 border-white/20 text-white placeholder:text-white/50 backdrop-blur-sm"
                    required
                  />
                </div>

                <div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Password"
                    className="h-12 rounded-full bg-white/10 border-white/20 text-white placeholder:text-white/50 backdrop-blur-sm"
                    required
                  />
                </div>

                {isSignUp && (
                  <div>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirm password"
                      className="h-12 rounded-full bg-white/10 border-white/20 text-white placeholder:text-white/50 backdrop-blur-sm"
                      required
                    />
                  </div>
                )}

                <div className="space-y-4 pt-4">
                  {!isSignUp ? (
                    <>
                      <SubmitButton
                        formAction={handleSignIn}
                        className="w-full h-12 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:from-yellow-300 hover:to-orange-400 transition-all shadow-md font-medium"
                        pendingText="Signing in..."
                      >
                        Sign in
                      </SubmitButton>

                      <Link
                        href={`/auth?mode=signup${returnUrl ? `&returnUrl=${returnUrl}` : ''}`}
                        className="flex h-12 items-center justify-center w-full text-center rounded-full border border-white/20 bg-white/10 hover:bg-white/20 transition-all text-white backdrop-blur-sm"
                      >
                        Create new account
                      </Link>
                    </>
                  ) : (
                    <>
                      <SubmitButton
                        formAction={handleSignUp}
                        className="w-full h-12 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:from-yellow-300 hover:to-orange-400 transition-all shadow-md font-medium"
                        pendingText="Creating account..."
                      >
                        Sign up
                      </SubmitButton>

                      <Link
                        href={`/auth${returnUrl ? `?returnUrl=${returnUrl}` : ''}`}
                        className="flex h-12 items-center justify-center w-full text-center rounded-full border border-white/20 bg-white/10 hover:bg-white/20 transition-all text-white backdrop-blur-sm"
                      >
                        Back to sign in
                      </Link>
                    </>
                  )}
                </div>

                {!isSignUp && (
                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => setForgotPasswordOpen(true)}
                      className="text-sm text-yellow-400 hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}
              </form>

              <div className="mt-8 text-center text-xs text-white/50">
                By continuing, you agree to our{' '}
                <Link href="/terms" className="text-yellow-400 hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-yellow-400 hover:underline">
                  Privacy Policy
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Forgot Password Dialog */}
      <Dialog open={forgotPasswordOpen} onOpenChange={setForgotPasswordOpen}>
        <DialogContent className="sm:max-w-md rounded-xl bg-black/80 backdrop-blur-xl border border-white/10 [&>button]:hidden">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-medium text-white">
                Reset Password
              </DialogTitle>
              <button
                onClick={() => setForgotPasswordOpen(false)}
                className="rounded-full p-1 hover:bg-white/10 transition-colors"
              >
                <X className="h-4 w-4 text-white/70" />
              </button>
            </div>
            <DialogDescription className="text-white/70">
              Enter your email address and we'll send you a link to reset your
              password.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleForgotPassword} className="space-y-4 py-4">
            <Input
              id="forgot-password-email"
              type="email"
              placeholder="Email address"
              value={forgotPasswordEmail}
              onChange={(e) => setForgotPasswordEmail(e.target.value)}
              className="h-12 rounded-full bg-white/10 border-white/20 text-white placeholder:text-white/50 backdrop-blur-sm"
              required
            />

            {forgotPasswordStatus.message && (
              <div
                className={`p-4 rounded-lg flex items-center gap-3 backdrop-blur-sm ${
                  forgotPasswordStatus.success
                    ? 'bg-green-950/30 border border-green-900/50 text-green-400'
                    : 'bg-red-950/20 border border-red-900/50 text-red-400'
                }`}
              >
                {forgotPasswordStatus.success ? (
                  <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-400" />
                ) : (
                  <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-400" />
                )}
                <span className="text-sm font-medium">
                  {forgotPasswordStatus.message}
                </span>
              </div>
            )}

            <DialogFooter className="flex sm:justify-start gap-3 pt-2">
              <button
                type="submit"
                className="h-12 px-6 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:from-yellow-300 hover:to-orange-400 transition-all shadow-md font-medium"
              >
                Send Reset Link
              </button>
              <button
                type="button"
                onClick={() => setForgotPasswordOpen(false)}
                className="h-12 px-6 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 transition-all text-white backdrop-blur-sm"
              >
                Cancel
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  );
}

export default function Login() {
  return (
    <Suspense
      fallback={
        <main className="flex flex-col items-center justify-center min-h-screen w-full bg-zinc-950">
          <div className="w-12 h-12 rounded-full border-4 border-yellow-400 border-t-transparent animate-spin"></div>
        </main>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
