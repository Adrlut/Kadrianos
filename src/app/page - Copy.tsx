
'use client';

import React, { useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
// Import the init function from ui.ts
import { initChatUI } from '../ui'; 

const KadrianosPage: React.FC = () => {
  useEffect(() => {
    // Initialize the chat UI logic only on the client side
    if (typeof window !== "undefined") {
      initChatUI("pl");
      console.log("KadrianosPage mounted, initChatUI('pl') called.");
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  const promptChips = [
    { id: 'who', label: 'Kim jesteś?' },
    { id: 'what', label: 'Jakie pytania mogę zadać?' },
    { id: 'skills', label: 'Jakie są Twoje najlepsze umiejętności?' },
  ];

  return (
    <>
      <Head>
        <title>Kadrianos</title>
        <meta name="description" content="Moje interaktywne CV w formie AI." />
        <link rel="icon" href="/Kadrianos.png" />
      </Head>

      <div className="flex flex-col h-screen max-w-[900px] mx-auto p-4 bg-chat-bg text-white font-inter">
        <header className="flex items-center mb-6 pt-4">
          <Image src="/Kadrianos.png" alt="Kadrianos Avatar" width={64} height={64} className="mr-4 rounded-full" />
          <div>
            <h1 className="text-3xl font-orbitron font-bold">Kadrianos</h1>
            <p className="text-sm text-gray-400">Moje interaktywne CV w formie AI.</p>
          </div>
        </header>

        <div className="mb-4 flex flex-wrap gap-2">
          {promptChips.map((chip) => (
            <button
              key={chip.id}
              className="prompt-chip bg-button-bg hover:bg-button-hover-bg text-white text-sm py-2 px-3 rounded-lg transition-colors duration-150"
            >
              {chip.label}
            </button>
          ))}
        </div>

        <main id="chat-list-container" className="flex-grow overflow-y-auto mb-4 p-3 bg-chat-area-bg rounded-lg scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
          <ul id="chat-list" className="flex flex-col space-y-2">
            {/* Messages will be appended here by ui.ts */}
          </ul>
        </main>

        <footer className="mt-auto pb-4">
          <form id="chat-form" className="flex items-center bg-chat-input-bg p-3 rounded-lg">
            <input
              id="chat-input"
              type="text"
              placeholder="Napisz wiadomość..."
              className="flex-grow bg-transparent text-white placeholder-gray-400 focus:outline-none"
            />
            <button
              type="submit"
              className="ml-3 p-2 bg-button-bg hover:bg-button-hover-bg rounded-md text-white disabled:opacity-50 transition-colors duration-150"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
              </svg>
            </button>
          </form>
        </footer>
      </div>
    </>
  );
};

export default KadrianosPage;

