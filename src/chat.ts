export async function sendMessage(userText: string, threadId?: string) {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: userText, threadId })
  });

  const data = await res.json();

  if (!res.ok) {
    const errorMsg = data?.error ?? "Błąd podczas żądania do asystenta.";
    throw new Error(errorMsg);
  }

  return {
    answer: data.answer as string,
    threadId: data.threadId as string
  };
}
