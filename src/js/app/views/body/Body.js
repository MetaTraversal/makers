import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import "@styles/style.scss";
import { ApiEndpoint, AppConfig, HttpRequest } from "../../config";
import { AppLoader } from "../../components";
import { AFrame, AFrameOld, NotFound } from "../index";
import { DataContext } from "../../context";

const Body = () => {
  const base_url = AppConfig.SITE_URL;
  const { slug_name } = useParams();
  const { lang, menuData } = useContext(DataContext);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState();

  const curl = slug_name !== undefined && "/" + slug_name + "/";

  useEffect(() => {
    getPagesData();
  }, [lang, menuData, slug_name]);

  const getPagesData = async () => {
    setLoading(true);
    const url = `/${lang}${ApiEndpoint.GET_PAGES}?fields=id,type,title,content,slug,excerpt,languages,post_media,featured_media,screen_images,properties_3D,featured_video,cats,tags,type&filter[orderby]=ID&order=asc&per_page=100`;
    HttpRequest
      .httpGet(url)
      .then((result) => {
        result?.map((pageData) => {
          if (pageData?.id == AppConfig?.SITE_FRONT_PAGE) {
            setData(pageData);
          } else {
            if (pageData?.slug === slug_name) {
              setData(pageData);
            } 
          }
        });
      })
      .catch((error) => {
        console.log("Error when getting PAGES data", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      {loading ? (
        <AppLoader />
      ) : (
        <>
          {data ? (
            <div className="content">
              {data?.properties_3D?.use_aframe ? (
                <AFrame aFrameData={data} />
                // <AFrameOld aFrameData={data} />
              ) : (
                <div className="container">
                  <h1>{data?.title?.rendered}</h1>

                  {data?.post_media?._thumbnail_id[0]?.full_path && (
                    <div className="featured-image">
                      <img
                        src={data?.post_media?._thumbnail_id[0]?.full_path}
                        alt={data?.post_media?._thumbnail_id[0]?.alt}
                      />
                    </div>
                  )}
                  <div
                    dangerouslySetInnerHTML={{
                      __html: data?.content?.rendered,
                    }}
                  />
                </div>
              )}
            </div>
          ) : (
            <NotFound />
          )}
        </>
      )}
    </>
  );
};

export default Body;
