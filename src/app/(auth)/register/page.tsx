import RegisterForm from '@/components/auth/form-register';
import { Metadata } from 'next';
import { env } from '@/lib/env';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import routes from '@/lib/routes.json';
import Link from 'next/link';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Register - ${env.NAME_WEBSITE}`,
    description: `Register`,
  };
}

export default async function Register() {
  return (
    <>
      <div className="lg:p-8">
        <Link
          href={routes.login}
          className={cn(
            buttonVariants(),
            'absolute top-[1.5rem] hover:bg-muted'
          )}
        >
          login
        </Link>
        <div className="relative mx-auto flex w-full flex-col justify-center space-y-4 sm:w-[450px]">
          <RegisterForm />
        </div>
      </div>
    </>
  );
}
