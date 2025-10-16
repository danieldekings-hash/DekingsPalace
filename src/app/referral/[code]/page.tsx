import { redirect } from 'next/navigation';

type Params = {
  params: { code: string };
  searchParams: Record<string, string | string[]>;
};

export default function ReferralRedirectPage({ params }: Params) {
  const code = encodeURIComponent(params.code || '');
  redirect(`/register?ref=${code}`);
}


