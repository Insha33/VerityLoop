"use client";

import { Button } from "@astryxdesign/core/Button";

export default function NotFound() {
  return <main className="not-found"><h1>This page isn’t here</h1><p>Return to your account to find a workspace.</p><Button variant="primary" href="/" label="Go to dashboard" /></main>;
}
