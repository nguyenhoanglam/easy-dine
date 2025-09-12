import Layout from "@/app/[locale]/(public)/layout";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default function GuestLayout({ children, params }: Props) {
  return (
    <Layout modal={null} params={params}>
      {children}
    </Layout>
  );
}
