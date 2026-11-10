import { NextRequest, NextResponse } from "next/server";
import { queryDb } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { jobId, reviewerId, rating, comment } = body;

    if (!jobId || !reviewerId || !rating) {
      return NextResponse.json({ error: "Missing required fields (jobId, reviewerId, rating)" }, { status: 400 });
    }

    // 1. Fetch current job to get customer_id and worker_id
    const jobRows = await queryDb<any>(`SELECT * FROM jobs WHERE id = $1 LIMIT 1`, [jobId]);
    if (jobRows.length === 0) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    const job = jobRows[0];
    const isReviewerCustomer = job.customer_id === reviewerId;
    const revieweeId = isReviewerCustomer ? job.worker_id : job.customer_id;

    // 2. Mark job as completed
    await queryDb(`UPDATE jobs SET status = 'completed', updated_at = NOW() WHERE id = $1`, [jobId]);

    // 3. Insert review if reviewee exists
    if (revieweeId) {
      await queryDb(
        `INSERT INTO reviews (job_id, reviewer_id, reviewee_id, rating, comment)
         VALUES ($1, $2, $3, $4, $5)`,
        [jobId, reviewerId, revieweeId, Math.min(Math.max(Number(rating), 1), 5), comment || ""]
      );

      // 4. Update reviewee's average rating and increment jobs_completed
      const avgRows = await queryDb<any>(
        `SELECT ROUND(AVG(rating), 2) AS avg_rating, COUNT(*) AS count 
         FROM reviews 
         WHERE reviewee_id = $1`,
        [revieweeId]
      );

      const newRating = avgRows[0]?.avg_rating || rating;

      await queryDb(
        `UPDATE users 
         SET rating = $1, 
             jobs_completed = jobs_completed + 1,
             updated_at = NOW() 
         WHERE id = $2`,
        [newRating, revieweeId]
      );
    }

    return NextResponse.json({ success: true, message: "Job completed and rating submitted successfully!" });
  } catch (err: any) {
    console.error("Complete job error:", err);
    return NextResponse.json({ error: err.message || "Failed to complete job" }, { status: 500 });
  }
}
