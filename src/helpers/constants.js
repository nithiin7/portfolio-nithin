import { getExperience } from "helpers";

import { BsLinkedin, BsWhatsapp } from "react-icons/bs";
import {
  FaAward,
  FaFacebookF,
  FaRedditAlien,
  FaGithub,
  FaBitbucket,
} from "react-icons/fa";
import { FiUsers, FiInstagram } from "react-icons/fi";
import { VscFolderLibrary } from "react-icons/vsc";
import { MdOutlineMail } from "react-icons/md";
import {
  RiMessengerLine,
  RiSnapchatLine,
} from "react-icons/ri";
import { IoLogoTwitter } from "react-icons/io";

export const socialMediaLinks = [
  {
    title: "LinkedIn",
    href: "https://www.linkedin.com/in/nithin-p7/",
    target: "_blank",
    icon: <BsLinkedin />,
    duration: 1000,
  },
  {
    title: "GitHub",
    href: "https://github.com/nithiin7",
    target: "_blank",
    icon: <FaGithub />,
    duration: 1200,
  },
  {
    title: "Bitbucket",
    href: "https://bitbucket.org/nithin-private/workspace/repositories/",
    target: "_blank",
    icon: <FaBitbucket />,
    duration: 1400,
  },
];

export const cardData = [
  {
    icon: <FaAward className={"about__icon"} />,
    title: "Tech Stacks",
    description: "15+ Stacks",
    duration: 1000,
  },
  {
    icon: <FiUsers className={"about__icon"} />,
    title: "Experience",
    description: getExperience("July 2022"),
    duration: 1100,
  },
  {
    icon: <VscFolderLibrary className={"about__icon"} />,
    title: "Projects",
    description: "15+ Completed",
    duration: 1200,
  },
];

export const contactOptions = [
  {
    icon: (
      <MdOutlineMail className={"contact__option-icon"} />
    ),
    title: "Email",
    subtitle: "nithinp150@gmail.com",
    link: "mailto:nithinp150@gmail.com",
    duration: 1300,
  },
  {
    icon: <BsWhatsapp className={"contact__option-icon"} />,
    title: "WhatsApp",
    subtitle: "+91-9645018007",
    link: "https://api.whatsapp.com/send?phone=+919645018007",
    duration: 1400,
  },
  {
    icon: (
      <RiMessengerLine className={"contact__option-icon"} />
    ),
    title: "Messenger",
    subtitle: "Nithin Pradeep",
    link: "https://m.me/i.am.np.007",
    duration: 1500,
  },
];

export const footerLinks = [
  { key: "home", href: "home", duration: "1000" },
  { key: "about", href: "about", duration: "1100" },
  {
    key: "experience",
    href: "experience",
    duration: "1200",
  },
  { key: "services", href: "services", duration: "1300" },
  { key: "portfolio", href: "portfolio", duration: "1400" },
  {
    key: "testimonials",
    href: "testimonials",
    duration: "1500",
  },
  { key: "contact", href: "contact", duration: "1600" },
];

export const socials = [
  {
    link: "https://www.facebook.com/i.am.np007/",
    title: "Facebook",
    icon: <FaFacebookF />,
    duration: 1700,
  },
  {
    link: "https://www.instagram.com/__nithiin__/",
    title: "Instagram",
    icon: <FiInstagram />,
    duration: 1800,
  },
  {
    link: "https://snapchat.com/nithiiin7",
    title: "Snapchat",
    icon: <RiSnapchatLine />,
    duration: 1900,
  },
  {
    link: "https://twitter.com/_nithiin7",
    title: "Twitter",
    icon: <IoLogoTwitter />,
    duration: 2000,
  },
  {
    link: "https://www.reddit.com/user/nithinp007",
    title: "Reddit",
    icon: <FaRedditAlien />,
    duration: 2100,
  },
];
