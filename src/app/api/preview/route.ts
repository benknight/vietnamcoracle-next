import { cookies, draftMode } from 'next/headers';
import { redirect } from 'next/navigation';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const exit = searchParams.get('exit');
  const secret = searchParams.get('secret');
  const redirectUrl = searchParams.get('redirect');
  const draft = await draftMode();

  if (exit) {
    (await cookies()).delete('isAdminPreview');
    draft.disable();
  } else {
    if (secret && secret === process.env.WORDPRESS_SECRET) {
      (await cookies()).set('isAdminPreview', '1');
    }

    draft.enable();
  }

  redirect(redirectUrl || '/');
}
