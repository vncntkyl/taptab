import { useEffect, useState } from "react";
import { useStorage } from "../../context/StorageContext";
import { useStaticAds } from "../../context/StaticAdsContext";
import { usePlayers } from "../../context/PlayersContext";
import { useEngagements } from "../../context/EngagementContext";
import { useUsers } from "../../context/UserContext";
import Card from "./Card";
import { FaPhotoVideo } from "react-icons/fa";
import { BsMegaphoneFill } from "react-icons/bs";
import { FaTabletScreenButton, FaUsers } from "react-icons/fa6";
import { RiSurveyFill } from "react-icons/ri";

function QuickLinks() {
  const [count, setCount] = useState(null);
  const { getMedia } = useStorage();
  const { getStaticAds } = useStaticAds();
  const { getPlayers } = usePlayers();
  const { retrieveEngagements } = useEngagements();
  const { getUsers } = useUsers();

  useEffect(() => {
    const setup = async () => {
      const [mediaAds, staticAds, players, surveyEngagements, users] =
        await Promise.all([
          getMedia(),
          getStaticAds(),
          getPlayers(),
          retrieveEngagements(),
          getUsers(),
        ]);

      if (!mediaAds || !staticAds || !players || !surveyEngagements || !users)
        return;

      const filteredMediaAds = mediaAds.filter((res) => {
        if (!res.fileName) {
          return res.type === "link";
        }
        return !res.fileName.startsWith("thumbnail") || res.type === "link";
      });
      const summary = [
        {
          title: "Media Library",
          count: filteredMediaAds.length,
          link: "media_library",
          icon: FaPhotoVideo,
        },
        {
          title: "Static Ads",
          count: staticAds.length,
          link: "static_ads",
          icon: BsMegaphoneFill,
        },
        {
          title: "Players",
          count: players.length,
          link: "players",
          icon: FaTabletScreenButton,
        },
        {
          title: "Survey Engagements",
          count: surveyEngagements.reduce(
            (sum, survey) => sum + parseInt(survey.responseCount),
            0
          ),
          link: "user_engagement",
          icon: RiSurveyFill,
        },
        {
          title: "Users",
          count: users.length,
          link: "user_accounts",
          icon: FaUsers,
        },
      ];

      setCount(summary);
    };

    setup();
  }, []);
  return count ? (
    <div className="flex w-full overflow-x-auto snap-mandatory snap-x divide-x-2 shadow-md">
      {count.map((item, index) => {
        const { icon: Icon } = item;
        return (
          <Card
            key={index}
            title={item.title}
            count={item.count}
            link={item.link}
            icon={Icon}
          />
        );
      })}
    </div>
  ) : (
    <>Loading...</>
  );
}

QuickLinks.propTypes = {};

export default QuickLinks;
