import { NewPasswordForm } from '@/components/auth/new-password-form';

const NewPasswordPage = () => {
  return (
    <section className="w-full space-y-4 lg:px-32">
      <h1 className="text-center">Nouveau mot de passe</h1>
      <NewPasswordForm />
    </section>
  );
};

export default NewPasswordPage;
