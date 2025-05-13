import OpenAI from "openai";

// Helper function to introduce a delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const runtime = "nodejs";
export async function POST(req: Request) {
    console.log("API Route /api/chat POST called - V3 (debug attempt)");

    const apiKey = process.env.OPENAI_API_KEY;
    const assistantId = process.env.ASSISTANT_ID;

    console.log("Attempting to read ASSISTANT_ID from env. Found:", assistantId ? "Yes" : "No");
    console.log("Attempting to read OPENAI_API_KEY from env. Found:", apiKey ? "Yes" : "No");
	console.log("💥 KEY:", process.env.OPENAI_API_KEY)


    if (!assistantId) {
        console.error("ASSISTANT_ID is not configured in environment variables.");
        return Response.json({ error: "Serwer: ASSISTANT_ID nie jest skonfigurowany.", type: "env_error" }, { status: 500 });
    }
    if (!apiKey) {
        console.error("OPENAI_API_KEY is not configured in environment variables.");
        return Response.json({ error: "Serwer: OPENAI_API_KEY nie jest skonfigurowany.", type: "env_error" }, { status: 500 });
    }

    try {
        const openai = new OpenAI({ apiKey }); // Initialize OpenAI client here
        console.log("OpenAI client initialized successfully inside POST.");
		
		console.log("✅ Sprawdzam, czy asystent istnieje");
		const assistant = await openai.beta.assistants.retrieve(assistantId);
		console.log("✅ Asystent istnieje:", assistant.name);

        const body = await req.json();
        const userMessageContent = body.message;

        if (!userMessageContent) {
            console.error("Message content is required.");
            return Response.json({ error: "Message content is required." }, { status: 400 });
        }
        console.log("User message received:", userMessageContent);

        console.log("Creating new thread with initial message...");
        const thread = await openai.beta.threads.create({
            messages: [
                { role: "user", content: userMessageContent }
            ]
        });
        const threadId = thread.id;
        console.log("New thread created with ID:", threadId);

        console.log(`Running assistant ${assistantId} on thread ${threadId}`);
        let run = await openai.beta.threads.runs.create(threadId, {
            assistant_id: assistantId,
        });
        console.log("Run created:", run.id, "Status:", run.status);

        let runStatus = run.status;
        const startTime = Date.now();
        const timeout = 30000; // 30 seconds timeout

        while ((runStatus === 'queued' || runStatus === 'in_progress' || runStatus === 'requires_action') && (Date.now() - startTime < timeout)) {
            await delay(1000);
            run = await openai.beta.threads.runs.retrieve(threadId, run.id);
            runStatus = run.status;
            console.log(`Polling run ${run.id}, current status: ${runStatus}`);

            if (runStatus === 'requires_action' && run.required_action?.type === 'submit_tool_outputs') {
                console.log("Run requires action. Submitting empty tool outputs.");
                await openai.beta.threads.runs.submitToolOutputs(threadId, run.id, {
                    tool_outputs: [],
                });
            }
        }

        console.log(`Run ${run.id} final status: ${runStatus}`);
        if (runStatus !== 'completed') {
            console.error(`Run ended with status: ${runStatus}`, run.last_error);
            let errorMessage = 'Przepraszamy, asystent nie mógł ukończyć odpowiedzi.';
            if (runStatus === 'failed' && run.last_error) {
                errorMessage = `Błąd asystenta: ${run.last_error.message}`;
            }
            return Response.json({ error: errorMessage, details: run.last_error ? run.last_error.message : runStatus, threadId: threadId }, { status: 500 });
        }

        console.log(`Retrieving messages from thread ${threadId}`);
        const messagesPage = await openai.beta.threads.messages.list(threadId, { limit: 1, order: 'desc' });
        
        const assistantMessages = messagesPage.data.filter(m => m.role === 'assistant');

        if (assistantMessages.length > 0 && assistantMessages[0].content[0]?.type === 'text') {
            const assistantResponse = assistantMessages[0].content[0].text.value;
            console.log("Assistant response:", assistantResponse);
            return Response.json({ answer: assistantResponse, threadId: threadId });
        } else {
            console.error("No text response from assistant or unexpected format.", messagesPage.data);
            return Response.json({ error: 'Nie znaleziono odpowiedzi tekstowej asystenta.', threadId: threadId }, { status: 500 });
        }

    } catch (error: any) {
        console.error('Error in /api/chat POST (V3):', error.message, error.stack);
        return Response.json({ error: 'Wystąpił wewnętrzny błąd serwera podczas przetwarzania POST.', details: error.message }, { status: 500 });
    }
}

export async function GET(req: Request) {
    console.log("API Route /api/chat GET called - V3 (debug attempt)");
    const apiKey = process.env.OPENAI_API_KEY;
    const assistantId = process.env.ASSISTANT_ID;
    console.log("GET: ASSISTANT_ID from env:", assistantId ? "Yes" : "No");
    console.log("GET: OPENAI_API_KEY from env:", apiKey ? "Yes" : "No");

    return Response.json({
        message: "Chat API is active. Use POST to send messages.",
        env_check: {
            assistantId_present: !!assistantId,
            apiKey_present: !!apiKey,
            assistantId_value: assistantId || "Not found",
            apiKey_length: apiKey ? apiKey.length : 0
        }
    });
}

export async function OPTIONS() {
    return new Response(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': '*', 
            'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    });
}

