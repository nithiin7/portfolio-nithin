import Head from "next/head";
import React from "react";
import Link from "next/link";
import { Link as ScrollLink } from "react-scroll";
import Image from "next/image";
import styles from "styles/home.module.scss";
import Typewriter from "typewriter-effect";

import { documentToReactComponents } from "@contentful/rich-text-react-renderer";

import Button from "components/utilities/Button";
import ExperienceCard from "components/pages/ExperienceCard";

import {
  socialMediaLinks,
  cardData,
} from "helpers/constants";
import CV from "assets/documents/cv.pdf";

import { initializeApollo } from "/lib/apolloClient";
import { HOME_PAGE } from "queries";

import HomeTestimonial from "components/utilities/HomeTestimonial";
import HomeContact from "components/utilities/HomeContact";
import HomePortfolio from "components/utilities/HomePortfolio";
import HomeServices from "components/utilities/HomeServices";

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
  const path_header =
    path?.sectionCollection.items[0].contentsCollection;
  const header_list =
    path_header?.items[1].contentsCollection.items[0].list;

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
      <header
        id="home"
        className={styles["portfolio__header"]}
      >
        <div className={styles["header__container"]}>
          <h5
            data-aos="fade-up"
            data-aos-duration="500"
            data-aos-once="true"
          >
            {path_header?.items[0].title}
          </h5>
          <h1 data-aos="fade-up" data-aos-duration="1000">
            {path_header?.items[0].subTitle}
          </h1>
          <h5
            data-aos="fade-up"
            data-aos-duration="1200"
            data-aos-once="true"
            className={styles["text-light"]}
          >
            <Typewriter
              options={{
                strings: header_list.map(item => item),
                autoStart: true,
                loop: true,
              }}
            />
          </h5>
          <div
            data-aos="fade-up"
            data-aos-duration="1200"
            data-aos-once="true"
            className={styles["header__cta"]}
          >
            <a
              className={styles["header__button"]}
              href={CV}
              download
            >
              Download CV
            </a>
            <Button
              classModifier={"Button--primary"}
              href={"contact"}
              data={"Let's Talk"}
              type={"scroll_link"}
            />
          </div>
          <div
            data-aos="fade-up"
            data-aos-duration="1400"
            data-aos-once="true"
            className={styles["header__socials"]}
          >
            {socialMediaLinks.map(link => (
              <Link
                key={link.title}
                data-aos="fade-up"
                data-aos-duration={link.duration}
                data-aos-once="true"
                title={link.title}
                href={link.href}
                target={link.target}
              >
                {link.icon}
              </Link>
            ))}
          </div>
          <div
            data-aos="fade-up"
            data-aos-duration="1200"
            data-aos-once="true"
            className={styles["header__img"]}
          >
            <Image
              src={
                path.sectionCollection.items[0]
                  .contentsCollection.items[3]
                  .contentsCollection.items[0].image.url
              }
              alt={
                path.sectionCollection.items[0]
                  .contentsCollection.items[3]
                  .contentsCollection.items[0].image.title
              }
              height={1000}
              width={1000}
              quality={100}
              priority
            />
          </div>
          <ScrollLink
            to="contact"
            className={styles["header__scroll-down"]}
          >
            ScrollDown
          </ScrollLink>
        </div>
      </header>
      <section id="about">
        <h5
          data-aos="fade-up"
          data-aos-duration="1100"
          data-aos-once="true"
        >
          {
            path.sectionCollection.items[1]
              .contentsCollection.items[0].title
          }
        </h5>
        <h2
          data-aos="fade-up"
          data-aos-duration="1200"
          data-aos-once="true"
        >
          {
            path.sectionCollection.items[1]
              .contentsCollection.items[0].subTitle
          }
        </h2>
        <div
          data-aos="fade-up"
          data-aos-duration="1300"
          data-aos-once="true"
          className={styles["portfolio__about"]}
        >
          <div
            className={styles["about__me"]}
            data-aos="fade-up"
            data-aos-duration="1200"
            data-aos-once="true"
          >
            <div className={styles["about__me-image"]}>
              <Image
                src={
                  path.sectionCollection.items[1]
                    .contentsCollection.items[1].image.url
                }
                alt="about-me"
                height={1000}
                width={1000}
                quality={100}
              />
            </div>
          </div>
          <div className={styles["about__content"]}>
            <div className={styles["about__cards"]}>
              {cardData.map((card, index) => (
                <article
                  key={index}
                  className={styles["about__card"]}
                  data-aos="fade-up"
                  data-aos-duration={card.duration}
                  data-aos-once="true"
                >
                  {card.icon}
                  <h5>{card.title}</h5>
                  <small>{card.description}</small>
                </article>
              ))}
            </div>
            <div
              data-aos="fade-up"
              data-aos-duration="1200"
              data-aos-once="true"
            >
              {documentToReactComponents(
                path.sectionCollection.items[1]
                  .contentsCollection.items[3]
                  .descriptionLong.json
              )}
            </div>
            <div
              data-aos="fade-up"
              data-aos-duration="1300"
              data-aos-once="true"
              className={styles["about__icon"]}
            >
              <Button
                href={"contact"}
                classModifier={"Button--primary"}
                data={"Let’s make something special."}
                type={"scroll_link"}
              />
            </div>
          </div>
        </div>
      </section>
      <section id="experience">
        <h5
          data-aos="fade-up"
          data-aos-duration="1000"
          data-aos-once="true"
        >
          {
            path.sectionCollection.items[2]
              .contentsCollection.items[0].title
          }
        </h5>
        <h2
          data-aos="fade-up"
          data-aos-duration="1100"
          data-aos-once="true"
        >
          {
            path.sectionCollection.items[2]
              .contentsCollection.items[0].subTitle
          }
        </h2>
        <div className={styles["portfolio__experience"]}>
          <div
            data-aos="fade-up"
            data-aos-duration="1200"
            data-aos-once="true"
            className={styles["experience__frontend"]}
          >
            <h3
              data-aos="fade-up"
              data-aos-duration="1200"
              data-aos-once="true"
            >
              {
                path.sectionCollection.items[2]
                  .contentsCollection.items[1].title
              }
            </h3>
            <div
              data-aos="fade-up"
              data-aos-duration="1300"
              data-aos-once="true"
              className={styles["experience__content"]}
            >
              {path.sectionCollection.items[2].contentsCollection.items[1].contentsCollection.items?.map(
                item => (
                  <ExperienceCard
                    key={item.title}
                    tech={item.title}
                    experience={item.description}
                  />
                )
              )}
            </div>
          </div>
          <div className={styles["experience__backend"]}>
            <h3
              data-aos="fade-up"
              data-aos-duration="1200"
              data-aos-once="true"
            >
              {
                path.sectionCollection.items[2]
                  .contentsCollection.items[2].title
              }
            </h3>
            <div
              data-aos="fade-up"
              data-aos-duration="1300"
              data-aos-once="true"
              className={styles["experience__content"]}
            >
              {path.sectionCollection.items[2].contentsCollection.items[2].contentsCollection.items?.map(
                item => (
                  <ExperienceCard
                    key={item.title}
                    tech={item.title}
                    experience={item.description}
                  />
                )
              )}
            </div>
          </div>
        </div>
      </section>
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
