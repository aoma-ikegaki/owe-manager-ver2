import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { auth } from "@/lib/auth";
import { debtListKey } from "@/lib/debts-query-keys";
import { fetchDebtsData } from "@/lib/debts-server";
import { HomeClient } from "./home-client";

const homeDebtQueries = [
  { type: "borrowed", status: "unpaid" },
  { type: "lent", status: "unpaid" },
] as const;

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
    const userId = session.user.id;
    await Promise.all(
      homeDebtQueries.map((query) =>
        queryClient.prefetchQuery({
          queryKey: debtListKey(query),
          queryFn: () => fetchDebtsData(userId, query),
        }),
      ),
    );
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HomeClient />
    </HydrationBoundary>
  );
}
