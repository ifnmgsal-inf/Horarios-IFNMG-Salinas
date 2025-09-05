'use client';

import { Suspense } from "react";
import LoginValidacao from "../../components/auth/LoginValidacao";

export default function Login() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <LoginValidacao />
    </Suspense>
  );
}