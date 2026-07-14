"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import {
  usePathname,
  useRouter,
} from "next/navigation";

import { ButtonLink } from "@/components/buttons/button";
import { Container } from "@/components/container/container";
import { Loader } from "@/components/loader/loader";
import { ProfileTabs } from "@/components/profile-tabs/profile-tabs";
import { SpriteIcon } from "@/components/sprite-icon/sprite-icon";
import { TravellerInfo } from "@/components/traveller-info/traveller-info";
import { useAuth } from "@/providers/auth-provider";

import css from "./layout.module.css";

interface ProfileLayoutProps {
  children: ReactNode;
}

export default function ProfileLayout({
  children,
}: ProfileLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading } = useAuth();

  const isEditPage = pathname === "/profile/edit";

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/auth/login");
    }
  }, [isLoading, router, user]);

  if (isLoading) {
    return (
      <main className={css.main}>
        <div className={css.loaderWrapper}>
          <Loader />
        </div>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className={css.main}>
      <Container>
        {!isEditPage && (
          <>
            <div className={css.profileHeader}>
              <TravellerInfo
                user={{
                  name: user.name,
                  avatarUrl: user.avatarUrl,
                  articlesAmount:
                    user.articlesAmount ?? 0,
                }}
                className={css.travellerInfo}
              />

              <div className={css.editProfileWrapper}>
                <ButtonLink
                  href="/profile/edit"
                  variant="secondary"
                  className={css.editProfileButton}
                  aria-label="Редагувати профіль"
                >
                  <SpriteIcon
                    id="icon-quill"
                    width={18}
                    height={18}
                    className={css.editProfileIcon}
                  />
                </ButtonLink>
              </div>
            </div>

            <ProfileTabs />
          </>
        )}

        <section className={css.storiesSection}>
          {children}
        </section>
      </Container>
    </main>
  );
}
