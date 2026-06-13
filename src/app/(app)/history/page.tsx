import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { auth } from "@/lib/auth";
import { HISTORY_DEBT_QUERIES } from "@/lib/debts-query-keys";
import { prefetchDebtsForUser } from "@/lib/debts-server";
import { HistoryClient } from "./history-client";

export default async function HistoryPage() {
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
      HISTORY_DEBT_QUERIES,
    );
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HistoryClient />
    </HydrationBoundary>
  );
}
