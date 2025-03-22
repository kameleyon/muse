import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { signInWithMagicLink } from '@/services/supabase';
import { addToast } from '@/store/slices/uiSlice';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/Card';
import {
  Form,
  FormGroup,
  FormLabel,
  FormError,
  FormActions,
} from '@/components/ui/Form';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

const magicLinkSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type MagicLinkFormData = z.infer<typeof magicLinkSchema>;

const MagicLink: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<MagicLinkFormData>({
    resolver: zodResolver(magicLinkSchema),
  });

  const watchedEmail = watch('email', '');

  const onSubmit = async (data: MagicLinkFormData) => {
    try {
      setIsLoading(true);
      
      const { error } = await signInWithMagicLink(data.email);

      if (error) throw error;

      // Show success message
      setIsSubmitted(true);
      
      dispatch(
        addToast({
          type: 'success',
          message: 'Magic link sent to your email',
        })
      );
    } catch (error: any) {
      dispatch(
        addToast({
          type: 'error',
          message: error.message || 'Failed to send magic link',
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Check your email</CardTitle>
          <CardDescription className="text-center">
            We've sent a magic link to {watchedEmail}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-success mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          <p className="text-center text-neutral-medium mb-4">
            Click the link in the email to sign in. If you don't see the email, check your spam folder.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center gap-4">
          <Button variant="outline" onClick={() => setIsSubmitted(false)}>
            Try Again
          </Button>
          <Button variant="outline" asChild>
            <Link to="/auth/login">Other Sign-In Options</Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Passwordless Sign In</CardTitle>
        <CardDescription className="text-center">
          Enter your email address and we'll send you a magic link to sign in.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormGroup>
            <FormLabel htmlFor="email" required>
              Email
            </FormLabel>
            <Input
              id="email"
              type="email"
              placeholder="example@email.com"
              {...register('email')}
              error={errors.email?.message}
              disabled={isLoading}
            />
          </FormGroup>

          <Button type="submit" fullWidth isLoading={isLoading} className="mt-6">
            Send Magic Link
          </Button>

          <div className="mt-6 text-center">
            <p className="text-sm text-neutral-medium">
              Prefer to use a password?{' '}
              <Link to="/auth/login" className="text-accent-teal hover:underline">
                Sign in with password
              </Link>
            </p>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
};

export default MagicLink;
