"use client";

import React from "react";
import { Amplify } from "aws-amplify";
import outputs from "@/../../amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import { Authenticator } from "@aws-amplify/ui-react";

Amplify.configure(outputs, { ssr: true });

export default function Auth({ children }: { children: React.ReactNode }) {
  return <Authenticator.Provider>{children}</Authenticator.Provider>;
}
