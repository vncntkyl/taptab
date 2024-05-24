import { useEffect, useState } from "react";
import Card from "./Card";

import { useWidget } from "../../context/WidgetContext";
import { useFunction } from "../../context/Functions";

function QuickLinks() {
  const [count, setCount] = useState(null);
  const { retrieveQuickLinksValues } = useWidget();
  const { removeUnderscore } = useFunction();

  useEffect(() => {
    const setup = async () => {
      const response = await retrieveQuickLinksValues();
      console.log(response);
      setCount(response);
    };

    setup();
  }, []);
  return count ? (
    <div className="flex w-full overflow-x-auto snap-mandatory snap-x divide-x-2 shadow-md">
      {Object.keys(count).map((key) => {
        return (
          <Card
            key={key}
            title={removeUnderscore(key)}
            count={count[key]}
            link={key}
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
