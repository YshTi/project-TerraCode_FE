import { Container } from "@/components/container/container";
import { PageTitle } from "@/components/page-title/page-title";
import { TravellerInfo } from "@/components/traveller-info/traveller-info";
import { TravellersStories } from "@/components/travellers-stories/travellers-stories";
import { backendFetch } from "@/lib/api/backend";
import type { User } from "@/types/user";

import styles from "./page.module.css";

type TravellerPageProps = {
  params: Promise<{
    travellerId: string;
  }>;
};

type TravellerApiResponse = {
  data: {
    user: User;
  };
};

async function getTravellerProfile(travellerId: string) {
  const response = await backendFetch(
    `/api/users/${travellerId}?page=1&perPage=1`,
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Failed to fetch traveller profile");
  }

  const data = (await response.json()) as TravellerApiResponse;

  return data.data.user;
}

export default async function TravellerPage({
  params,
}: TravellerPageProps) {
  const { travellerId } = await params;

  const traveller = await getTravellerProfile(travellerId);

  if (!traveller) {
    return (
      <Container>
        <p className={styles.notFound}>Такий користувач відсутній</p>
      </Container>
    );
  }

  return (
    <section className={styles.section}>
      <Container>
        <TravellerInfo user={traveller} className={styles.travellerInfo} />

        <div className={styles.storiesBlock}>
          <PageTitle className={styles.storiesTitle}>
            Статті Мандрівника
          </PageTitle>

          <div className={styles.storiesList}>
            <TravellersStories
              source={{
                type: "public",
                userId: travellerId,
              }}
              emptyState={{
                text: "Цей користувач ще не публікував історій.",
                buttonText: "Назад до історій",
                linkTo: "/stories",
              }}
              limit={6}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}