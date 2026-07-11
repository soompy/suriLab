-- Add optional editorial metadata for the blog renewal content model.
ALTER TABLE "posts" ADD COLUMN "series" TEXT;
ALTER TABLE "posts" ADD COLUMN "thumbnail" TEXT;

CREATE INDEX "posts_series_idx" ON "posts"("series");
