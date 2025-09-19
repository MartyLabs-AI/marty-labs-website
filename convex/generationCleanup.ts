import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

// Run every 5 minutes to check for stuck generations
const crons = cronJobs();

crons.interval(
  "cleanup stuck generations",
  { minutes: 5 },
  internal.generationCleanupImpl.checkStuckGenerations
);

export default crons;