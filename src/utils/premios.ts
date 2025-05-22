export type Premio = {
  title: string;
  imgUrl: string;
};
type PremiosList = {
  [key: string]: Premio;
};

export const premios: PremiosList = {
  "juego-de-ollas": {
    title: "un Juego de ollas",
    imgUrl:
      "https://oechsle.vtexassets.com/arquivos/ids/18333322/2668525_1.jpg?v=638560911682030000",
  },
  licuadora: {
    title: "una Licuadora",
    imgUrl:
      "https://oechsle.vtexassets.com/arquivos/ids/18333322/2668525_1.jpg?v=638560911682030000",
  },
  plancha: {
    title: "una Plancha",
    imgUrl:
      "https://oechsle.vtexassets.com/arquivos/ids/18333322/2668525_1.jpg?v=638560911682030000",
  },
  televisor: {
    title: "un Televisor",
    imgUrl:
      "https://oechsle.vtexassets.com/arquivos/ids/18333322/2668525_1.jpg?v=638560911682030000",
  },
  prueba: {
    title: "PREMIO TEST",
    imgUrl:
      "https://oechsle.vtexassets.com/arquivos/ids/18333322/2668525_1.jpg?v=638560911682030000",
  },
};
