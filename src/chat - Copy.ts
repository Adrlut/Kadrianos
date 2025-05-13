const predefinedAnswers = ["Hej", "Co tam", "Jak sie masz"];

export async function sendMessage(
  userText: string,
  threadId?: string // threadId is no longer used but kept for signature compatibility
): Promise<{ answer: string; threadId: string }> {
  console.log("Local sendMessage called with user text:", userText);
  // Simulate a short delay to make it feel like a response
  await new Promise(resolve => setTimeout(resolve, 500));

  const randomIndex = Math.floor(Math.random() * predefinedAnswers.length);
  const randomAnswer = predefinedAnswers[randomIndex];

  console.log("Responding with local answer:", randomAnswer);

  return {
    answer: randomAnswer,
    threadId: "local-thread" // Return a dummy threadId
  };
}

