import { NextRequest, NextResponse } from "next/server";
import { queryDb } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const uid = searchParams.get("uid");
    const slug = searchParams.get("slug");

    if (!uid && !slug) {
      return NextResponse.json({ error: "Missing uid or slug parameter" }, { status: 400 });
    }

    let query = `
      SELECT id, email, display_name, role, trade, sector, phone, photo_url, slug,
             is_verified, rating, jobs_completed, bio_urdu, bio_english, tagline, 
             skills, experience_years, voice_note_transcript, created_at, updated_at
      FROM users 
    `;
    const params: any[] = [];

    if (uid) {
      params.push(uid);
      query += ` WHERE id = $1 LIMIT 1`;
    } else if (slug) {
      params.push(slug);
      query += ` WHERE slug = $1 LIMIT 1`;
    }

    const rows = await queryDb<any>(query, params);

    if (rows.length === 0) {
      return NextResponse.json({ profile: null }, { status: 200 });
    }

    const row = rows[0];

    // If fetched by slug or worker, also fetch recent reviews
    let reviews: any[] = [];
    if (slug || row.role === "worker") {
      reviews = await queryDb<any>(
        `SELECT r.*, u.display_name AS reviewer_name 
         FROM reviews r
         LEFT JOIN users u ON r.reviewer_id = u.id
         WHERE r.reviewee_id = $1 
         ORDER BY r.created_at DESC 
         LIMIT 10`,
        [row.id]
      );
    }

    return NextResponse.json({
      profile: {
        uid: row.id,
        email: row.email,
        displayName: row.display_name,
        role: row.role,
        trade: row.trade,
        sector: row.sector,
        phone: row.phone,
        photoURL: row.photo_url,
        slug: row.slug,
        isVerified: row.is_verified,
        rating: Number(row.rating),
        jobsCompleted: row.jobs_completed,
        bioUrdu: row.bio_urdu,
        bioEnglish: row.bio_english,
        tagline: row.tagline,
        skills: row.skills || [],
        experienceYears: row.experience_years,
        voiceNoteTranscript: row.voice_note_transcript,
        createdAt: new Date(row.created_at).getTime(),
      },
      reviews,
    });
  } catch (err: any) {
    console.error("GET /api/profile error:", err);
    return NextResponse.json({ error: err.message || "Failed to fetch profile" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      uid,
      email,
      displayName,
      role,
      trade,
      sector,
      phone,
      photoURL,
      slug,
      bioUrdu,
      bioEnglish,
      tagline,
      skills,
      experienceYears,
      voiceNoteTranscript,
    } = body;

    if (!uid) {
      return NextResponse.json({ error: "Missing uid" }, { status: 400 });
    }

    const cleanRole = role === "worker" ? "worker" : "customer";

    // Clean slug
    let cleanSlug = slug;
    if (cleanSlug) {
      cleanSlug = cleanSlug
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9-]/g, "-")
        .replace(/-+/g, "-");
    } else if (cleanRole === "worker" && displayName) {
      // Auto-generate clean slug from name if not provided
      cleanSlug = displayName
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9-]/g, "-")
        .replace(/-+/g, "-");
    }

    const query = `
      INSERT INTO users (
        id, email, display_name, role, trade, sector, phone, photo_url, slug,
        bio_urdu, bio_english, tagline, skills, experience_years, voice_note_transcript, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, NOW())
      ON CONFLICT (id) DO UPDATE SET
        email = COALESCE(EXCLUDED.email, users.email),
        display_name = COALESCE(EXCLUDED.display_name, users.display_name),
        role = COALESCE(EXCLUDED.role, users.role),
        trade = COALESCE(EXCLUDED.trade, users.trade),
        sector = COALESCE(EXCLUDED.sector, users.sector),
        phone = COALESCE(EXCLUDED.phone, users.phone),
        photo_url = COALESCE(EXCLUDED.photo_url, users.photo_url),
        slug = COALESCE(EXCLUDED.slug, users.slug),
        bio_urdu = COALESCE(EXCLUDED.bio_urdu, users.bio_urdu),
        bio_english = COALESCE(EXCLUDED.bio_english, users.bio_english),
        tagline = COALESCE(EXCLUDED.tagline, users.tagline),
        skills = COALESCE(EXCLUDED.skills, users.skills),
        experience_years = COALESCE(EXCLUDED.experience_years, users.experience_years),
        voice_note_transcript = COALESCE(EXCLUDED.voice_note_transcript, users.voice_note_transcript),
        updated_at = NOW()
      RETURNING *;
    `;

    const rows = await queryDb<any>(query, [
      uid,
      email || null,
      displayName || null,
      cleanRole,
      trade || null,
      sector || null,
      phone || null,
      photoURL || null,
      cleanSlug || null,
      bioUrdu || null,
      bioEnglish || null,
      tagline || null,
      skills || null,
      experienceYears || null,
      voiceNoteTranscript || null,
    ]);

    const row = rows[0];

    return NextResponse.json({
      success: true,
      profile: {
        uid: row.id,
        email: row.email,
        displayName: row.display_name,
        role: row.role,
        trade: row.trade,
        sector: row.sector,
        phone: row.phone,
        photoURL: row.photo_url,
        slug: row.slug,
        isVerified: row.is_verified,
        rating: Number(row.rating),
        jobsCompleted: row.jobs_completed,
        bioUrdu: row.bio_urdu,
        bioEnglish: row.bio_english,
        tagline: row.tagline,
        skills: row.skills || [],
        experienceYears: row.experience_years,
        voiceNoteTranscript: row.voice_note_transcript,
        createdAt: new Date(row.created_at).getTime(),
      },
    });
  } catch (err: any) {
    console.error("POST /api/profile error:", err);
    return NextResponse.json({ error: err.message || "Failed to save profile" }, { status: 500 });
  }
}
