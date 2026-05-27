import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useNavigate } from "react-router";
import { useAuthStore } from "@/store/auth";
import type {UserSchemaType} from "@repo/types"
import { getFriendlyErrorMessage } from "@/lib/error-message";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const store_login = useAuthStore((s) => s.login);

  const login = trpc.auth.login.useMutation({
    onSuccess(data) {
      navigate("/dashboard")
      store_login(data as UserSchemaType)
    },
    onError: (error) => {
      setError(getFriendlyErrorMessage(error, "Unable to log in. Please try again."));
    }
  });

  const handleLogin = (e:React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    login.mutate({email, password});
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Log in to your account</CardTitle>
          <CardDescription>
            Enter your email below to log in to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => handleLogin(e)}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input id="password" value={password} type="password"  onChange={(e) => setPassword(e.target.value)} required />
              </Field>
              <Field>
                <Button type="submit">Log in</Button>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <Button variant="outline" type="button">
                  Log in with Google
                </Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account? <a href="/register">Sign up</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
