import { NextRequest, NextResponse } from 'next/server';
// TODO: Re-enable when implementing convex backend
// import { Webhook } from 'svix';
// import { headers } from 'next/headers';
// import { api } from '@/../convex/_generated/api';
// import { ConvexHttpClient } from 'convex/browser';

// const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: NextRequest) {
  // TODO: Implement when convex backend is ready
  return NextResponse.json(
    { error: 'Clerk webhook API not yet implemented' },
    { status: 501 }
  );
  
  /* ORIGINAL IMPLEMENTATION - RESTORE WHEN CONVEX IS READY
  // Get the headers
  const headerPayload = await headers();
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: 'Error occured -- no svix headers' }, { status: 400 });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || '');

  let evt: unknown;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as {
      data: {
        id: string;
        email_addresses: Array<{ id: string; email_address: string }>;
        primary_email_address_id: string;
        first_name?: string;
        last_name?: string;
        image_url?: string;
      };
      type: string;
    };
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return NextResponse.json({ error: 'Error occured' }, { status: 400 });
  }

  const webhookEvent = evt as { data: { id: string; [key: string]: unknown }; type: string };
  const { id } = webhookEvent?.data || {};
  const eventType = webhookEvent?.type;

  console.log(`Webhook with and ID of ${id} and type of ${eventType}`);
  console.log('Webhook body:', body);

  // Handle the webhook
  switch (eventType) {
    case 'user.created':
      try {
        const { id: clerkId, email_addresses, first_name, last_name, image_url } = evt.data;
        
        const primaryEmail = email_addresses.find((email) => email.id === evt.data.primary_email_address_id);
        
        await convex.mutation(api.users.createOrUpdateUser, {
          clerkId,
          email: primaryEmail?.email_address || '',
          name: first_name && last_name ? `${first_name} ${last_name}` : first_name || last_name || '',
          avatar: image_url || undefined,
        });

        console.log(`User ${clerkId} created successfully in Convex`);
      } catch (error) {
        console.error('Error creating user in Convex:', error);
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
      }
      break;

    case 'user.updated':
      try {
        const { id: clerkId, email_addresses, first_name, last_name, image_url } = evt.data;
        
        const primaryEmail = email_addresses.find((email) => email.id === evt.data.primary_email_address_id);
        
        await convex.mutation(api.users.createOrUpdateUser, {
          clerkId,
          email: primaryEmail?.email_address || '',
          name: first_name && last_name ? `${first_name} ${last_name}` : first_name || last_name || '',
          avatar: image_url || undefined,
        });

        console.log(`User ${clerkId} updated successfully in Convex`);
      } catch (error) {
        console.error('Error updating user in Convex:', error);
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
      }
      break;

    case 'user.deleted':
      try {
        const { id: clerkId } = evt.data;
        
        // Note: We don't actually delete users from Convex to preserve data integrity
        // Instead, we could mark them as inactive or handle this case as needed
        console.log(`User ${clerkId} deleted from Clerk (not removing from Convex)`);
      } catch (error) {
        console.error('Error handling user deletion:', error);
        return NextResponse.json({ error: 'Failed to handle user deletion' }, { status: 500 });
      }
      break;

    default:
      console.log(`Unhandled webhook event type: ${eventType}`);
  }

  return NextResponse.json({ received: true });
  */
}