"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { Container } from "@/components/container/container";
import { PageTitle } from "@/components/page-title/page-title";
import { AddStoryForm } from "@/components/add-story-form/add-story-form";
import { Loader } from "@/components/loader/loader";
import { useAuth } from "@/providers/auth-provider";

import styles from "./page.module.css";

export default function AddStoryPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/auth/login");
    }
  }, [isLoading, user, router]);

  if (isLoading || !user) {
    return <Loader />;
  }

  return (
    <section className={styles.addStorySection}>
      <Container>
        <PageTitle>Створити нову історію</PageTitle>
        <AddStoryForm />
      </Container>
    </section>
  );
}
