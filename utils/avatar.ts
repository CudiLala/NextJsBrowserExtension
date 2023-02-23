import { createAvatar } from "@dicebear/core";
import { shapes } from "@dicebear/collection";

export function addressAvatar(address: string) {
  return createAvatar(shapes, {
    seed: address,
  }).toString();
}
