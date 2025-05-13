import { sendMessage } from "./chat";

export function initChatUI() {
  const form = document.querySelector("#chat-form") as HTMLFormElement;
  const input = document.querySelector("#chat-input") as HTMLInputElement;
  const list = document.querySelector("#chat-list") as HTMLElement;

  let threadId: string | undefined;
  let turns = 0;

  if (form && input && list) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const text = input.value.trim();
      if (!text) return;

      appendBubble("user", text);
      input.value = "";

      try {
        input.disabled = true;
        const thinkingBubble = appendBubble("assistant", "Kadrianos pisze...");

        const res = await sendMessage(text, threadId);
        threadId = res.threadId;

        if (thinkingBubble && thinkingBubble.parentNode) {
          thinkingBubble.parentNode.removeChild(thinkingBubble);
        }
        appendBubble("assistant", res.answer);
        turns += 1;
        if (turns >= 20) showAndReload();
      } catch (err: any) {
        const thinkingBubble = list.querySelector(".thinking-bubble");
        if (thinkingBubble && thinkingBubble.parentNode) {
          thinkingBubble.parentNode.removeChild(thinkingBubble);
        }
        appendBubble("assistant", `⚠️ ${err.message || "Something went wrong. Try again."}`);
        console.error(err);
      } finally {
        input.disabled = false;
        if(input) input.focus();
      }
    });
  } else {
    console.error("Chat UI elements (#chat-form, #chat-input, #chat-list) not found. Ensure they exist in the DOM when initChatUI is called.");
  }

  function appendBubble(role: "user" | "assistant", text: string): HTMLLIElement {
    const li = document.createElement("li");
    li.className =
      role === "user"
        ? "self-end bg-[#10a37f]/20 rounded-lg p-3 max-w-[80%] mb-2 text-white"
        : "self-start bg-[#343541] rounded-lg p-3 max-w-[80%] mb-2 text-white";
    
    // Clear any existing interval if this bubble is being reused (e.g. for thinking -> actual message)
    if ((li as any).intervalId) {
        clearInterval((li as any).intervalId);
        delete (li as any).intervalId;
    }

    if (text === "Kadrianos pisze...") {
      li.classList.add("thinking-bubble");
      let dotCount = 1;
      const thinkingText = "Kadrianos pisze";
      li.textContent = thinkingText + "."; // Initial text
      const intervalId = setInterval(() => {
        dotCount = (dotCount % 3) + 1;
        li.textContent = thinkingText + ".".repeat(dotCount);
      }, 500);
      (li as any).intervalId = intervalId; 
    } else {
      li.textContent = text;
    }
    
    if (list) {
        list.appendChild(li);
        li.scrollIntoView({ behavior: "smooth", block: "end" });
    } else {
        console.error("#chat-list element not found when trying to append bubble.");
    }
    return li;
  }

  function showAndReload() {
    const m = document.createElement("div");
    m.className =
      "fixed inset-0 flex items-center justify-center bg-black/60 text-white text-lg z-50";
    m.textContent = "Session limit reached — refreshing…";
    document.body.appendChild(m);
    setTimeout(() => {
      localStorage.clear();
      location.reload();
    }, 2500);
  }

  document.querySelectorAll(".prompt-chip").forEach(button => {
    button.addEventListener("click", () => {
      if (input && !input.disabled) {
        const promptText = button.textContent;
        if (promptText) {
          input.value = promptText;
          // Optionally, trigger form submission automatically if desired
          // if (form) form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
        }
      }
    });
  });
  console.log("Chat UI Initialized by ui.ts");
}

