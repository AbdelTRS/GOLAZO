import { expect, it } from "vitest";
import { CATALOG } from "./catalog";

/*
 * Les identifiants de cartes sont enregistrés dans les collections des joueurs.
 * Si ce test casse, une modification du générateur a changé des identifiants :
 * les cartes déjà possédées ne seraient plus reconnues. Ne mettre à jour le snapshot
 * (npx vitest -u) qu'en connaissance de cause.
 */
it("garde des identifiants de cartes stables", () => {
  expect(CATALOG.map((card) => card.id).sort()).toMatchSnapshot();
});
