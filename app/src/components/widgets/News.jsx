import React, { useState, useEffect } from "react";
import newsData from "./SampleNews.json";
import { format } from "date-fns";

function News() {
  const [news, setNews] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const setup = async () => {
      setNews(newsData.articles);
    };
    setup();
  }, []);

  useEffect(() => {
    const slideshowTimer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % news.length);
    }, 3000);

    // Clear the timer when the component unmounts to prevent memory leaks.
    return () => {
      clearInterval(slideshowTimer);
    };
  }, [news]);

  return (
    <div className="flex flex-col gap-1">
      {news.length !== 0 && (
        <div className="flex gap-2 animate-fade duration-500 shadow-md p-2">
          <img
            src={news[currentSlide].image}
            alt=""
            className="max-h-[100px] rounded-md"
          />
          <div>
            <p className="font-semibold leading-4">{news[currentSlide].title}</p>
            <p className="text-sm">{news[currentSlide].source.name}</p>
            <p className="text-xs">{format(new Date(news[currentSlide].publishedAt), "MMM dd, yyy | hh:mm a")}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default News;
