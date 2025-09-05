'use client';

import { Suspense } from "react";
import ValidacaoDados from "../../components/schedules/ValidacaoDados";

export default function Validacao() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <ValidacaoDados />
    </Suspense>
  );
}