import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { Container } from "@/components/container/container";
import { PageTitle } from "@/components/page-title/page-title";
import { AddStoryForm } from "@/components/add-story-form/add-story-form";

export default async function AddStoryPage() {
  // NOTE: "session" is a placeholder cookie name. Once the auth feature
  // sets its real session/access-token cookie, update the name below
  // (and, if needed, replace this check with a shared helper so every
  // private page reads it the same way).
  const cookieStore = await cookies();
  const session = cookieStore.get("session");

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <section className="section">
      <Container>
        <PageTitle title="Створити нову історію" />
        <AddStoryForm />
      </Container>
    </section>
  );
}
