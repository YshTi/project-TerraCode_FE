import { Container } from "@/components/container/container";
import { PageTitle } from "@/components/page-title/page-title";
import { TravellerInfo } from "@/components/traveller-info/traveller-info";
import { TravellersStories } from "@/components/travellers-stories/travellers-stories";
import { backendFetch } from "@/lib/api/backend";
import type { Story } from "@/types/story";
import type { User } from "@/types/user";

import styles from "./page.module.css";

type TravellerPageProps = {
  params: Promise<{
    travellerId: string;
  }>;
};

type TravellerApiStory = Omit<Story, "ownerId"> & {
  ownerId: string;
};

type TravellerApiResponse = {
  data: {
    user: User;
    stories: TravellerApiStory[];
    pagination: {
      page: number;
      perPage: number;
      totalStories: number;
      totalPages: number;
    };
  };
};

async function getTravellerProfile(travellerId: string) {
  const response = await backendFetch(
    `/api/users/${travellerId}?page=1&perPage=6`,
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Failed to fetch traveller profile");
  }

  const data = (await response.json()) as TravellerApiResponse;

  return data.data;
}

export default async function TravellerPage({
  params,
}: TravellerPageProps) {
  const { travellerId } = await params;

  const travellerProfile = await getTravellerProfile(travellerId);

  if (!travellerProfile) {
    return (
      <Container>
        <p className={styles.notFound}>Такий користувач відсутній</p>
      </Container>
    );
  }

  const { user, stories } = travellerProfile;

  const normalizedStories: Story[] = stories.map((story) => ({
    ...story,
    ownerId: {
      _id: user._id,
      name: user.name,
      avatarUrl: user.avatarUrl,
    },
  }));

  return (
    <section className={styles.section}>
      <Container>
        <TravellerInfo user={user} className={styles.travellerInfo} />

        <div className={styles.storiesBlock}>
          <PageTitle className={styles.storiesTitle}>
            Статті Мандрівника
          </PageTitle>

          <div className={styles.storiesList}>
            <TravellersStories stories={normalizedStories} />
          </div>
        </div>
      </Container>
    </section>
  );
}