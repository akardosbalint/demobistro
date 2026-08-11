import "server-only";

// Promise.allSettled önmagában elnyeli a hibákat — ez a helper mindig logolja
// a sikertelen e-mail/SMS küldéseket, hogy a Vercel runtime logban látszódjon,
// ha pl. a Google Workspace hitelesítés vagy a Twilio hívás elutasításra kerül.
export async function notifyAll(promises: Promise<unknown>[], context: string): Promise<void> {
  const results = await Promise.allSettled(promises);
  results.forEach((result, index) => {
    if (result.status === "rejected") {
      console.error(`[notify:${context}] #${index} sikertelen:`, result.reason);
    }
  });
}
