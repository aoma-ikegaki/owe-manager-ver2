import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { auth } from "@/lib/auth";
import { HOME_DEBT_QUERIES } from "@/lib/debts-query-keys";
import { prefetchDebtsForUser } from "@/lib/debts-server";
import { HomeClient } from "./home-client";

export default async function HomePage() {
  const session = await auth();
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60,
      },
    },
  });

  if (session?.user?.id) {
    await prefetchDebtsForUser(
      queryClient,
      session.user.id,
      HOME_DEBT_QUERIES,
    );
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HomeClient />
    </HydrationBoundary>
  );
}
