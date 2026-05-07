"use client";

import { useState } from "react";

export function useRequest() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const execute = async () => {};

  return {
    execute,
    loading,
    success,
    error,
  };
}
