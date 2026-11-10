import { NextRequest, NextResponse } from "next/server";
import { queryDb } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const customerId = searchParams.get("customerId");
    const workerId = searchParams.get("workerId");
    const trade = searchParams.get("trade");
    const available = searchParams.get("available");

    let query = `
      SELECT j.*, 
             c.display_name AS customer_name, c.email AS customer_email, c.phone AS customer_phone,
             w.display_name AS worker_name, w.rating AS worker_rating
      FROM jobs j
      LEFT JOIN users c ON j.customer_id = c.id
      LEFT JOIN users w ON j.worker_id = w.id
    `;
    const params: any[] = [];
    const conditions: string[] = [];

    if (customerId) {
      params.push(customerId);
      conditions.push(`j.customer_id = $${params.length}`);
    } else if (workerId) {
      params.push(workerId);
      conditions.push(`j.worker_id = $${params.length}`);
    } else if (available === "true") {
      conditions.push(`j.status = 'pending' AND j.worker_id IS NULL`);
      if (trade) {
        params.push(trade);
        conditions.push(`j.trade = $${params.length}`);
      }
    }

    if (conditions.length > 0) {
      query += ` WHERE ` + conditions.join(" AND ");
    }

    query += ` ORDER BY j.created_at DESC LIMIT 50`;

    const rows = await queryDb<any>(query, params);
    return NextResponse.json({ jobs: rows });
  } catch (err: any) {
    console.error("GET /api/jobs error:", err);
    return NextResponse.json({ error: err.message || "Failed to fetch jobs" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customerId, trade, title, description, sector, address, budget } = body;

    if (!customerId || !trade || !title) {
      return NextResponse.json({ error: "Missing required fields (customerId, trade, title)" }, { status: 400 });
    }

    const query = `
      INSERT INTO jobs (customer_id, trade, title, description, sector, address, budget, escrow_funded, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, true, 'pending')
      RETURNING *;
    `;

    const rows = await queryDb<any>(query, [
      customerId,
      trade,
      title,
      description || "",
      sector || "",
      address || "",
      budget ? Number(budget) : 0,
    ]);

    return NextResponse.json({ success: true, job: rows[0] });
  } catch (err: any) {
    console.error("POST /api/jobs error:", err);
    return NextResponse.json({ error: err.message || "Failed to create job" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { jobId, workerId, status } = body;

    if (!jobId) {
      return NextResponse.json({ error: "Missing jobId" }, { status: 400 });
    }

    let query = `UPDATE jobs SET updated_at = NOW()`;
    const params: any[] = [];

    if (workerId !== undefined) {
      params.push(workerId);
      query += `, worker_id = $${params.length}`;
    }
    if (status) {
      params.push(status);
      query += `, status = $${params.length}`;
    }

    params.push(jobId);
    query += ` WHERE id = $${params.length} RETURNING *;`;

    const rows = await queryDb<any>(query, params);

    // If job was completed, increment worker's jobs_completed count
    if (status === "completed" && rows[0]?.worker_id) {
      await queryDb(`UPDATE users SET jobs_completed = jobs_completed + 1 WHERE id = $1`, [rows[0].worker_id]);
    }

    return NextResponse.json({ success: true, job: rows[0] });
  } catch (err: any) {
    console.error("PATCH /api/jobs error:", err);
    return NextResponse.json({ error: err.message || "Failed to update job" }, { status: 500 });
  }
}
