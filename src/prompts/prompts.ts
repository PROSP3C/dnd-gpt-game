import type { CharacterRace, Region, Town } from 'src/dnd-types.js'

const world = {
  name: 'Virelia',
  description:
    'Virelia is a realm fractured by ancient magic, where reality itself is thin and unstable. Long ago, a cataclysmic event known as the "Veil Sundering" tore the boundaries between dimensions, scattering fragments of other worlds across the land. Now, Virelia is a patchwork of strange biomes, forgotten technologies, and arcane anomalies — a place where time bends, gravity flickers, and gods whisper through broken skies.',
}

export const prompts = {
  character: {
    getRandomCharacterName: (race: CharacterRace) => {
      return `generate a random dnd character of the ${race} race. one full name only, do not ask any further questions`
    },
  },
  geographical: {
    getRandomRegionName: () => {
      return `generate a random region name within the world of ${world.name}. ${world.name}'s description is as follows: ${world.description}. provide one name only, do not ask any further questions`
    },
    getRandomTownName: (region: Region) => {
      return `generate a random town name within the ${region.name} region. ${region.name}'s description is as follows: ${region.description}. provide one name only, do not ask any further questions`
    },
    getRandomLocationNameWithinRegion: (region: Region) => {
      return `generate a random location name within ${region.name}. ${region.name}'s description is as follows: ${region.description}. provide one name only, make sure it's not a town, do not ask any further questions`
    },
    getRandomDungeonNameWithinRegion: (region: Region) => {
      return `generate a random dungeon name within ${region.name}. ${region.name}'s description is as follows: ${region.description}. provide one name only, do not ask any further questions`
    },
    getRandomLocationNameWithinTown: (town: Town) => {
      return `generate a random location name within ${town.name}. ${town.name}'s description is as follows: ${town.description}. provide one name only, do not ask any further questions`
    },
  },
}
