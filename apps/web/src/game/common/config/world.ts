export const dimensions = {
  scale: 3,
  // Width of a cell in pixels
  frameWidth: 16,
  // Height of a cell in pixels
  frameHeight: 16,
};

export const worldLayers = [
  'SeaLevel',
  'GroundLevel1',
  'Dirt',
  'GroundLevel2',
  'Buildings',
  //   'Objects',
  //   'Objects2',
  'Trees',
  'Trees2',
  'Trees3',
  'Trees4',
] as const;

export const tilesets = [
  'beach',
  'buildings',
  'dirt',
  'doors',
  'furniture',
  'grass-water',
  'mushrooms, flowers, stones',
  'tall-grass',
  'trees',
];
