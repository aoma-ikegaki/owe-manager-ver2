import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  createDebt,
  getSummary,
  listDebts,
} from "@/lib/debt-service";
import { debtInputSchema, debtQuerySchema } from "@/lib/validation";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const parsed = debtQuerySchema.safeParse({
      type: searchParams.get("type") ?? undefined,
      status: searchParams.get("status") ?? undefined,
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const [items, summary] = await Promise.all([
      listDebts(session.user.id, parsed.data),
      getSummary(session.user.id),
    ]);

    return NextResponse.json({ items, summary });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const json = await req.json();
    const parsed = debtInputSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const created = await createDebt(session.user.id, parsed.data);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 },
    );
  }
}
