import Logger from "@/utility/logging.utility";

import type { NextRequest } from "next/server";

const logger = new Logger(import.meta.url);

export async function POST(request: NextRequest) {
  const data = { commands: [1] };

  return Response.json({ ...data });
}
