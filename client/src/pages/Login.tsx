import {
  CheckCircle2,
  LockKeyhole,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import {
  InstitutionalFooter,
  InstitutionalHeader,
} from "@/components/PortalShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  USER_PROFILE_DESCRIPTIONS,
  USER_PROFILE_LABELS,
  profileOfUser,
} from "@shared/userRoles";

export default function Login() {
  const { user, loading, error } = useAuth();

  return (
    <div className="min-h-screen bg-[#171717] text-white">
      <InstitutionalHeader section="ACESSO AO SISTEMA" />
      <main className="mx-auto flex min-h-[calc(100vh-78px)] max-w-6xl items-center justify-center px-5 py-12 md:px-8">
        <Card className="w-full max-w-2xl overflow-hidden border-white/10 bg-white/[0.045] text-white shadow-[0_24px_80px_rgba(0,0,0,.3)]">
          <CardContent className="grid gap-8 p-6 sm:p-10 md:grid-cols-[.85fr_1.15fr] md:items-center">
            <div className="relative overflow-hidden border border-[#e30613]/30 bg-[#e30613]/[0.08] p-6">
              <div className="absolute -right-10 -top-12 text-[150px] font-black leading-none text-white/[0.04]">
                SP
              </div>
              <ShieldCheck className="relative h-10 w-10 text-[#e30613]" />
              <p className="relative mt-8 text-[10px] font-bold uppercase tracking-[.24em] text-[#e30613]">
                Ambiente institucional
              </p>
              <h1 className="relative mt-3 text-3xl font-black leading-tight">
                Portal de Acompanhamento de Projetos
              </h1>
              <p className="relative mt-4 text-sm leading-6 text-white/60">
                Acesse com sua conta institucional para visualizar os recursos
                autorizados ao seu perfil.
              </p>
            </div>

            <div>
              {loading ? (
                <div className="flex min-h-56 flex-col items-center justify-center text-center">
                  <LockKeyhole className="h-10 w-10 animate-pulse text-[#e30613]" />
                  <p className="mt-4 text-sm text-white/60">
                    Identificando sua sessão...
                  </p>
                </div>
              ) : user ? (
                <AuthenticatedIdentity user={user} />
              ) : (
                <LoginPrompt
                  error={error instanceof Error ? error.message : null}
                />
              )}
            </div>
          </CardContent>
        </Card>
      </main>
      <InstitutionalFooter subtitle="Acesso seguro e identificação por perfil de usuário." />
    </div>
  );
}

function LoginPrompt({ error }: { error: string | null }) {
  return (
    <div>
      <LockKeyhole className="h-9 w-9 text-[#e30613]" />
      <p className="mt-6 text-xs font-bold uppercase tracking-[.2em] text-[#e30613]">
        Login seguro
      </p>
      <h2 className="mt-2 text-2xl font-black">Entre no sistema</h2>
      <p className="mt-3 text-sm leading-6 text-white/60">
        Use o botão abaixo para autenticar sua conta. Após o login, o portal
        identificará automaticamente seu nome, e-mail e perfil de acesso.
      </p>
      {error ? (
        <p className="mt-4 border border-red-400/30 bg-red-500/10 p-3 text-xs leading-5 text-red-200">
          Não foi possível validar a sessão. Tente novamente.
        </p>
      ) : null}
      <Button
        onClick={() => startLogin()}
        className="mt-7 h-11 w-full bg-[#e30613] font-bold hover:bg-[#c80511]"
      >
        <LockKeyhole className="mr-2 h-4 w-4" />
        Entrar com minha conta
      </Button>
      <Link
        href="/"
        className="mt-4 block text-center text-xs text-white/50 hover:text-white"
      >
        Voltar ao portal executivo
      </Link>
    </div>
  );
}

function AuthenticatedIdentity({
  user,
}: {
  user: {
    name?: string | null;
    email?: string | null;
    role: string;
    profile?: Parameters<typeof profileOfUser>[0]["profile"];
  };
}) {
  const profile = profileOfUser(user);

  return (
    <div>
      <CheckCircle2 className="h-9 w-9 text-emerald-400" />
      <p className="mt-6 text-xs font-bold uppercase tracking-[.2em] text-emerald-300">
        Sessão identificada
      </p>
      <h2 className="mt-2 text-2xl font-black">Acesso confirmado</h2>
      <div className="mt-6 space-y-3 border-y border-white/10 py-5">
        <div className="flex items-start gap-3">
          <UserRound className="mt-0.5 h-4 w-4 shrink-0 text-white/50" />
          <div>
            <p className="text-[10px] uppercase tracking-[.16em] text-white/40">
              Usuário
            </p>
            <p className="mt-1 text-sm font-semibold">
              {user.name || "Usuário autenticado"}
            </p>
            <p className="text-xs text-white/50">
              {user.email || "E-mail institucional não informado"}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#e30613]" />
          <div>
            <p className="text-[10px] uppercase tracking-[.16em] text-white/40">
              Perfil de acesso
            </p>
            <p className="mt-1 text-sm font-semibold text-[#ffb8bd]">
              {USER_PROFILE_LABELS[profile]}
            </p>
            <p className="mt-1 text-xs leading-5 text-white/50">
              {USER_PROFILE_DESCRIPTIONS[profile]}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link href="/admin" className="flex-1">
          <Button className="w-full bg-[#e30613] font-bold hover:bg-[#c80511]">
            Abrir Back-Office
          </Button>
        </Link>
        <Link href="/" className="flex-1">
          <Button
            variant="outline"
            className="w-full border-white/20 text-white hover:bg-white/10 hover:text-white"
          >
            Ir para o portal
          </Button>
        </Link>
      </div>
    </div>
  );
}
