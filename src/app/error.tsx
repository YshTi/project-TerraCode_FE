"use client"

import { ErrorContent } from "@/components/errors/error-content/error-content";

type ErrorPageProps = {
  error: Error;
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return <ErrorContent error={error} reset={reset} />;
}