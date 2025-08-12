export default async function sendPrompt(
  inputText: string,
  guidancePrompt: string
): Promise<string> {
  const res = await fetch(
    "https://airiedevapi-gwfcg9fyf4fwg2b2.australiaeast-01.azurewebsites.net/Airie/BasicChat",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inputText, guidancePrompt }),
    }
  );

  if (!res.ok) {
    throw new Error(`Request failed: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return data.choices[0].message.content;
}



// export default function sendPrompt(
//   userInput: string,
//   guidancePrompt: string
// ): Promise<string> {
//   return fetch(
//     "https://airiedevapi-gwfcg9fyf4fwg2b2.australiaeast-01.azurewebsites.net/Airie/BasicChat",
//     {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ userInput, guidancePrompt }),
//     }
//   )
//     .then((res) => {
//       if (!res.ok) {
//         throw new Error(`Request failed: ${res.status} ${res.statusText}`);
//       }
//       return res.json();
//     })
//     .then((data) => {
//       const content = data?.choices?.[0]?.message?.content;
//       if (typeof content !== "string") {
//         throw new Error("Unexpected response shape");
//       }
//       return content;
//     });
// }
