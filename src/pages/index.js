import React from "react";
import Head from "next/head";

import { initializeApollo } from "/lib/apolloClient";
import { HOME_PAGE } from "queries";

import HomeServices from "components/pages/homepage/HomeServices";
import HomePortfolio from "components/pages/homepage/HomePortfolio";
import HomeTestimonial from "components/pages/homepage/HomeTestimonial";
import HomeContact from "components/pages/homepage/HomeContact";
import HomeExperience from "components/pages/homepage/HomeExperience";
import HomeAbout from "components/pages/homepage/HomeAbout";
import HomeHeader from "components/pages/homepage/HomeHeader";

export async function getStaticProps() {
  const apolloClient = initializeApollo();

  const data = await apolloClient.query({
    query: HOME_PAGE,
  });

  return {
    props: {
      data,
    },
  };
}

export default function Home(props) {
  const path = props?.data.data.pageCollection.items[0];

  return (
    <>
      <Head>
        <title>{path.title}</title>
        <meta
          name={path?.title}
          content={path?.description}
        />
        <meta
          property="og:title"
          content={path?.ogtitle}
        ></meta>
        <meta
          property="og:description"
          content={path?.description}
        ></meta>
        <meta
          property="og:url"
          content={path?.ogurl}
        ></meta>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
      </Head>
      <HomeHeader
        data={
          path?.sectionCollection.items[0]
            .contentsCollection
        }
      />
      <HomeAbout
        data={
          path.sectionCollection.items[1].contentsCollection
        }
      />
      <HomeExperience
        data={
          path?.sectionCollection.items[2]
            .contentsCollection
        }
      />
      <HomeServices
        data={
          path.sectionCollection.items[3].contentsCollection
            .items[0]
        }
        services={
          path.sectionCollection.items[3].contentsCollection
            .items
        }
      />
      <HomePortfolio
        data={
          path.sectionCollection.items[4].contentsCollection
            .items[0]
        }
        portfolio={
          path.sectionCollection.items[4].contentsCollection
            .items[1].contentsCollection.items
        }
      />
      <HomeTestimonial
        data={
          path.sectionCollection.items[5].contentsCollection
            .items[0]
        }
        testimonial={
          path.sectionCollection.items[5].contentsCollection
            .items[1].contentsCollection.items
        }
      />
      <HomeContact
        data={
          path.sectionCollection.items[6].contentsCollection
            .items[0]
        }
      />
    </>
  );
}
