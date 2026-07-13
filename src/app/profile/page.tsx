"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { ButtonLink } from "@/components/buttons/button";
import { Container } from "@/components/container/container";
import { Loader } from "@/components/loader/loader";
import { ProfileTabs } from "@/components/profile-tabs/profile-tabs";
import { SpriteIcon } from "@/components/sprite-icon/sprite-icon";
import { TravellerInfo } from "@/components/traveller-info/traveller-info";
import { TravellersStories } from "@/components/travellers-stories/travellers-stories";
import { useAuth } from "@/providers/auth-provider";

import css from "./page.module.css";

type ProfileTab = "saved" | "own";

const STORIES_LIMIT = 6;

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();

  const [activeTab, setActiveTab] =
    useState<ProfileTab>("saved");

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.replace("/auth/login");
    }
  }, [isAuthLoading, router, user]);

  if (isAuthLoading) {
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

  const emptyState =
    activeTab === "saved"
      ? {
          text: "У вас ще немає збережених історій, мершій збережіть вашу першу історію!",
          buttonText: "До історій",
          linkTo: "/stories",
        }
      : {
          text: "Ви ще нічого не публікували, поділіться своєю першою історією!",
          buttonText: "Опублікувати історію",
          linkTo: "/stories/new",
        };

  return (
    <main className={css.main}>
      <Container>
        <div className={css.profileHeader}>
          <TravellerInfo
            user={{
              name: user.name,
              avatarUrl: user.avatarUrl,
              articlesAmount: user.articlesAmount ?? 0,
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

            <span
              className={css.editProfileTooltip}
              role="tooltip"
            >
              Редагувати профіль
            </span>
          </div>
        </div>

        <ProfileTabs
          value={activeTab}
          onChange={setActiveTab}
        />

        <section className={css.storiesSection}>
          <TravellersStories
            source={{
              type: activeTab,
            }}
            emptyState={emptyState}
            limit={STORIES_LIMIT}
          />
        </section>
      </Container>
    </main>
  );
}