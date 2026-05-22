"use client";

import Image from "next/image";
import React, { type FormEvent, useState } from "react";
import type {
  GenerateImageErrorResponse,
  GenerateImageRequestBody,
  GenerateImageSuccessResponse,
} from "@/lib/image-generation";

const TestPage = () => {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateImage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedPrompt = prompt.trim();

    if (!trimmedPrompt) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: trimmedPrompt,
          resolution: "768×768",
        } satisfies GenerateImageRequestBody),
      });

      if (!response.ok) {
        const contentType = response.headers.get("content-type") ?? "";

        if (contentType.includes("application/json")) {
          const data = (await response.json()) as GenerateImageErrorResponse;
          throw new Error(data.error || "Не удалось сгенерировать картинку.");
        }

        throw new Error("Не удалось сгенерировать картинку.");
      }

      const data = (await response.json()) as GenerateImageSuccessResponse;
      setImageUrl(data.imageUrl);
    } catch (error) {
      setLoading(false);
      setImageUrl("");
      setError(
        error instanceof Error
          ? error.message
          : "Не удалось сгенерировать картинку.",
      );
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-8 text-white">
      <div className="grid w-full max-w-6xl grid-cols-1 gap-8 rounded-3xl bg-slate-900 p-8 shadow-2xl md:grid-cols-2">
        <div className="flex flex-col justify-center">
          <h1 className="mb-3 text-4xl font-bold">AI Image Generator</h1>

          <p className="mb-6 text-slate-400">
            Введи prompt, и Pollinations AI сгенерирует картинку.
          </p>

          <form onSubmit={generateImage} className="space-y-4">
            <textarea
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              placeholder="Например: human reading a book, realistic, cinematic"
              className="min-h-[180px] w-full resize-none rounded-2xl border border-slate-700 bg-slate-950 p-4 outline-none focus:border-indigo-500"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-indigo-500 py-4 font-semibold transition hover:bg-indigo-600 disabled:opacity-60"
            >
              {loading ? "Генерируется..." : "Сгенерировать"}
            </button>
          </form>
        </div>

        <div>
          <h2 className="mb-4 text-2xl font-semibold">Result</h2>

          <div className="relative flex min-h-[420px] items-center justify-center overflow-hidden rounded-3xl border border-dashed border-slate-700 bg-slate-950">
            {!imageUrl && !loading && (
              <p className="text-slate-500">Картинка появится здесь</p>
            )}

            {loading && (
              <p className="absolute text-slate-400">Генерируется...</p>
            )}

            {error && (
              <p className="absolute px-4 text-center text-red-400">{error}</p>
            )}

            {imageUrl && (
              <Image
                key={imageUrl}
                src={imageUrl}
                alt="Generated result"
                fill
                unoptimized
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
                onLoad={() => {
                  setLoading(false);
                  setError("");
                }}
                onError={() => {
                  setLoading(false);
                  setError(
                    "Не удалось загрузить картинку. Попробуй другой prompt.",
                  );
                }}
              />
            )}
          </div>

          {imageUrl && (
            <a
              href={imageUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-4 block text-indigo-400 hover:text-indigo-300"
            >
              Открыть картинку по ссылке
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestPage;
