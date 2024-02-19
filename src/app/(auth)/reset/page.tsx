import { ResetForm } from '@/components/auth/reset-form';

const ResetPage = () => {
  return (
    <section className="w-full space-y-4 lg:px-32">
      <h1 className="text-center">Entrez un email</h1>
      <ResetForm />
    </section>
  );
};

export default ResetPage;
