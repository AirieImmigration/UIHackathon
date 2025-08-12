

// Change this later
export default async function GetPercentage(inputText: string, guidancePrompt: string): Promise<string> {
  const res = await fetch("https://airiedevapi-gwfcg9fyf4fwg2b2.australiaeast-01..net/Airie/...", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ inputText, guidancePrompt }),
  });

  if (!res.ok) {
    throw new Error(`Request failed: ${res.status} ${res.statusText}`);
  }

  const data = await res.json()
  return data.choices[0].message.content
}