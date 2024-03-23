import Button from "./Button";

export default {
  title: "Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export const Primary = {
  args: {
    data: "Button",
    href: "#",
    classModifier: "Button--primary",
    scrollType: "scroll_link",
  },
};

export const Secondary = {
  args: {
    data: "Button",
    href: "#",
    classModifier: "Button",
    type: "external_link",
  },
};
