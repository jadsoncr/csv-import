import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import BroAIImporter from "./BroAIImporter";

const meta: Meta<typeof BroAIImporter> = {
  title: "BRO.AI/Importer",
  component: BroAIImporter,
  argTypes: {
    type: {
      control: { type: "select" },
      options: ["PDV", "NF", "FICHA_TECNICA"],
    },
    language: { control: { type: "text" } },
    darkMode: { control: { type: "boolean" } },
    isModal: { control: { type: "boolean" } },
  },
};

export default meta;

type Story = StoryObj<typeof BroAIImporter>;

export const PDV: Story = {
  args: {
    type: "PDV",
    language: "pt-BR",
    darkMode: false,
    isModal: true,
  },
};

export const NF: Story = {
  args: {
    type: "NF",
    language: "pt-BR",
    darkMode: false,
    isModal: true,
  },
};

export const FichaTecnica: Story = {
  args: {
    type: "FICHA_TECNICA",
    language: "pt-BR",
    darkMode: false,
    isModal: true,
  },
};
