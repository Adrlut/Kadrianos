'use client';

import React, { useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link'; // Import Link
import { initChatUI } from '../../ui'; // Poprawny import z ../../ui

const KadrianosPageEn: React.FC = () => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      initChatUI("en");
      console.log("KadrianosPage EN mounted, initChatUI('en') called.");
    }
  }, []);

  const promptChips = [
    { id: 'who', label: 'Who are you?' },
    { id: 'what', label: 'What questions can I ask?' },
    { id: 'skills', label: 'What are your top skills?' },
  ];

  return (
    <>
      <Head>
        <title>Kadrianos (EN)</title>
        <meta name="description" content="My interactive Resume in AI form." />
        <link rel="icon" href="/Kadrianos.png" />
      </Head>

      <div className="flex flex-col h-screen max-w-[900px] mx-auto p-4 bg-chat-bg text-white font-inter">
        <header className="flex items-center justify-between mb-6 pt-4">
          <div className="flex items-center">
            <Image
              src="/Kadrianos.png"
              alt="Kadrianos Avatar"
              width={64}
              height={64}
              className="mr-4 rounded-full"
            />
            <div>
              <h1 className="text-3xl font-orbitron font-bold">Kadrianos</h1>
              <p className="text-sm text-gray-400">
                My interactive Resume in AI form.
              </p>
            </div>
          </div>
          <Link href="/">
            <button
              className="text-sm bg-button-bg hover:bg-button-hover-bg text-white px-3 py-1 rounded-md transition-colors duration-150"
            >
              PL
            </button>
          </Link>
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

        <main
          id="chat-list-container"
          className="flex-grow overflow-y-auto mb-4 p-3 bg-chat-area-bg rounded-lg scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
        >
          <ul id="chat-list" className="flex flex-col space-y-2">
            {/* Messages will be appended here by ui.ts */}
          </ul>
        </main>

        <footer className="mt-auto pb-4">
          <form
            id="chat-form"
            className="flex items-center bg-chat-input-bg p-3 rounded-lg"
          >
            <input
              id="chat-input"
              type="text"
              placeholder="Type a message..."
              className="flex-grow bg-transparent text-white placeholder-gray-400 focus:outline-none"
            />
            <button
              type="submit"
              className="ml-3 p-2 bg-button-bg hover:bg-button-hover-bg rounded-md text-white disabled:opacity-50 transition-colors duration-150"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
              </svg>
            </button>
          </form>
        </footer>
      </div>
    </>
  );
};

export default KadrianosPageEn;
