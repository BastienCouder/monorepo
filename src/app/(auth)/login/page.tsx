import LoginForm from '@/components/auth/form-login';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { env } from '@/lib/env';
import { Metadata } from 'next';
import Link from 'next/link';
import routes from '@/lib/routes.json';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `login - ${env.NAME_WEBSITE}`,
    description: `login`,
  };
}

export default async function Login() {
  return (
    <div className="lg:p-8">
      <Link
        href={routes.register}
        className={cn(buttonVariants(), 'absolute top-[1.5rem] hover:bg-muted')}
      >
        register
      </Link>
      <div className="relative mx-auto flex w-full flex-col justify-center space-y-4 sm:w-[450px]">
        <LoginForm />
      </div>
    </div>
  );
}
