import type { Container } from "@/entities/content/model/types";

export function pickRandomContainerContent(containers: Container[]) {
  if (containers.length === 0) {
    return null;
  }

  const randomContainer = containers[Math.floor(Math.random() * containers.length)];
  if (randomContainer.elementsList.length === 0) {
    return null;
  }

  const randomElement =
    randomContainer.elementsList[
      Math.floor(Math.random() * randomContainer.elementsList.length)
    ];

  return randomElement.content;
}
