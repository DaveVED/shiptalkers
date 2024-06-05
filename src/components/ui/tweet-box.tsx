/**
 * v0 by Vercel.
 * @see https://v0.dev/t/HTV1Riwb0VD
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */

import { useState } from "react";
import { Button } from "./button";
import { LinkButton } from "./link-button";
import { Textarea } from "./textarea";
import { useQuery } from "@tanstack/react-query";

export function TweetBox(props: { src: string; text: string }) {
  const [copySuccess, setCopySuccess] = useState("");
  const { data } = useQuery(["copy-image"], async () => {
    const response = await fetch(props.src);
    const blob = await response.blob();
    return blob;
  });
  const queryParams = new URLSearchParams({
    text: props.text,
  });

  const copyToClipboard = async () => {
    try {
      if (!data) {
        return; // TODO: Handle error
      }
      const item = new ClipboardItem({ "image/png": data });
      await navigator.clipboard.write([item]);
      setCopySuccess("Image copied to clipboard!");
    } catch (error) {
      setCopySuccess("Failed to copy image.");
      console.error("Error copying image: ", error);
    }
  };

  return (
    <div className="mx-auto max-w-2xl rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
      <div className="overflow-hidden  border-b-2 border-gray-200 dark:border-gray-800">
        <img
          src={props.src}
          width={300}
          height={200}
          alt="Placeholder"
          className="aspect-[2/1] max-h-[270px] w-full max-w-[516px] object-cover"
        />
        <Textarea
          placeholder="What's on your mind?"
          defaultValue={props.text}
          className="min-h-[10px] w-full resize-none rounded-none border-0 p-4 py-0 dark:bg-gray-950 dark:text-gray-50"
          rows={3}
        />
      </div>
      <div className="mt-4 flex w-full items-center justify-end space-x-2">
        <Button onClick={copyToClipboard} variant={"blue"}>
          Copy Image
        </Button>
        <LinkButton
          href={"https://twitter.com/intent/tweet?" + queryParams.toString()}
          variant={"blue"}
          target="_blank"
        >
          Tweet
        </LinkButton>
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ImageIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
  );
}
