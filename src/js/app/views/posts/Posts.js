import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import "@styles/style.scss";
import { ApiEndpoint, AppConfig, HttpRequest } from "../../config";
import { AppLoader } from "../../components";
import { NotFound } from "../index";
import { DataContext } from "../../context";

const Posts = () => {
  const base_url = AppConfig.SITE_URL;
  const { slug_name } = useParams();
  const { lang, menuData } = useContext(DataContext);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState();

  const curl = slug_name !== undefined ? "/" + slug_name + "/" : "";

  useEffect(() => {
    getPostsData();
  }, [lang, menuData, slug_name]);

  const getPostsData = async () => {
    setLoading(true);
    const url = `/${lang}${ApiEndpoint.GET_POSTS}?fields=id,type,title,content,slug,excerpt,languages,post_media,featured_media,screen_images,properties_3D,featured_video,cats,tags,type&filter[orderby]=ID&order=asc&per_page=100`;
    HttpRequest.httpGet(url)
      .then((result) => {
        result.map((postData) => {
          if (postData?.id == AppConfig?.SITE_FRONT_PAGE) {
            setData(postData);
          } else {
            if (postData?.slug === slug_name) {
              setData(postData);
            }
          }
        });
      })
      .catch((error) => {
        console.log("Error when getting GET_POSTS data", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <div className="container">
        {loading ? (
          <AppLoader />
        ) : (
          <div>
            {data ? (
              <div className="dynamic">
                {data?.post_media?._thumbnail_id[0]?.full_path && (
                  <img
                    src={data?.post_media?._thumbnail_id[0]?.full_path}
                    alt={data?.post_media?._thumbnail_id[0]?.alt}
                  />
                )}
                <div
                  dangerouslySetInnerHTML={{
                    __html: data?.content?.rendered,
                  }}
                />
              </div>
            ) : (
              <NotFound />
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Posts;
