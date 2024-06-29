import { Pet } from '../Models/Pet';

const pets = [
    { name: 'Dog', imageUrl: 'https://www.shutterstock.com/image-photo/funny-dog-licking-lips-tongue-out-1761385949' },
    { name: 'Cat', imageUrl: 'https://www.shutterstock.com/image-photo/cute-cat-most-people-link-first-2466559507' },
    { name: 'Fish', imageUrl: 'https://www.shutterstock.com/image-photo/large-mouth-bass-jumping-out-water-2311027969' },
    { name: 'Parrot', imageUrl: 'https://www.shutterstock.com/image-photo/parrot-on-flower-beautiful-extreme-close-2328046837' },
    { name: 'Rabbit', imageUrl: 'https://www.shutterstock.com/image-photo/easter-bunny-hare-cottontail-rabbit-domestic-2437814323' },
    { name: 'Hamster', imageUrl: 'https://www.shutterstock.com/image-photo/peachcolored-syrian-hamster-rised-paw-looked-2300410583' },
    { name: 'Guinea Pig', imageUrl: 'https://www.shutterstock.com/image-photo/funny-fat-guinea-pig-carrot-summer-2086406899' },
    { name: 'Gerbil', imageUrl: 'https://www.shutterstock.com/image-photo/garbils-garbillinae-studio-2224080409' },
    { name: 'Ferret', imageUrl: 'https://www.shutterstock.com/image-photo/endangered-animal-blackfooted-ferret-2353456945' },
    { name: 'Turtle', imageUrl: 'https://www.shutterstock.com/image-photo/land-turtle-natural-environment-cute-sulcata-2206224699' },
    { name: 'Tortoise', imageUrl: 'https://www.shutterstock.com/image-photo/galapagos-islands-tortoise-big-turtle-ecuador-2316709979' },
    { name: 'Gecko', imageUrl: 'https://www.shutterstock.com/image-photo/mediterranean-house-gecko-hemidactylus-turcicus-2376839205' },
    { name: 'Bearded Dragon', imageUrl: 'https://www.shutterstock.com/image-photo/closeup-head-bearded-dragon-on-isolated-2356148695' },
    { name: 'Anole', imageUrl: 'https://www.shutterstock.com/image-photo/anolis-cybotes-largeheaded-anole-tiburon-stout-2438192149' },
    { name: 'Corn Snake', imageUrl: 'https://www.shutterstock.com/image-photo/full-lenght-shot-normal-colored-corn-2235169267' },
    { name: 'Ball Python', imageUrl: 'https://www.shutterstock.com/image-photo/royal-python-looks-close-reptile-terrarium-2004367055' },
    { name: 'Frog', imageUrl: 'https://www.shutterstock.com/image-photo/whitelipped-tree-frog-litoria-infrafrenata-on-2263125941' },
    { name: 'Hedgehog', imageUrl: 'https://www.shutterstock.com/image-photo/hands-man-holding-hedgehog-2371436943' },
    { name: 'Chinchilla', imageUrl: 'https://www.shutterstock.com/image-photo/charming-chinchilla-cage-pedigree-gray-pet-2244602299' },
    { name: 'Mouse', imageUrl: 'https://www.shutterstock.com/image-photo/yellownecked-mouse-apodemus-flavicollis-called-field-2059965023' },
    { name: 'Pigeon', imageUrl: 'https://www.shutterstock.com/image-photo/rock-pigeon-street-looking-food-pigeons-1684487635' },
    { name: 'Dove', imageUrl: 'https://www.shutterstock.com/image-photo/side-view-wild-common-wood-pigeon-2311336065' }
];

const petNames = [
    'Buddy', 'Max', 'Charlie', 'Oscar', 'Milo', 'Archie', 'Bailey', 'Teddy', 'Toby', 'Jack',
    'Luna', 'Bella', 'Lucy', 'Daisy', 'Lola', 'Molly', 'Sadie', 'Sophie', 'Chloe', 'Zoe'
];

export class DataGenerator {
    static generateRandomPetName(): string {
        const randomIndex = Math.floor(Math.random() * petNames.length);
        return petNames[randomIndex];
    }

    static generateRandomPet(): Pet {
        const randomPet = pets[Math.floor(Math.random() * pets.length)];
        const randomId = Math.floor(Math.random() * 1000);

        return {
            id: randomId,
            category: {
                id: Math.floor(Math.random() * 100),
                name: randomPet.name
            },
            name: this.generateRandomPetName(),
            photoUrls: [randomPet.imageUrl],
            tags: [
                {
                    id: Math.floor(Math.random() * 100),
                    name: 'string'
                }
            ],
            status: 'available'
        };
    }
}
