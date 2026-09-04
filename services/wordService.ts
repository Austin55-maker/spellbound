import { Difficulty, SpellingWord, CustomWord } from "../types";

const CUSTOM_WORDS_KEY = 'spellbound_custom_words';
const CUSTOM_VICTORY_MESSAGE_KEY = 'spellbound_custom_victory_message';

// Helper to expand compressed strings "WORD|Hint" into objects
const expand = (str: string): SpellingWord => {
  const [word, hint] = str.split('|');
  return { word, hint };
};

// Data structure: Difficulty -> Letter -> Array of Strings
const RAW_DATA: Record<Difficulty, Record<string, string[]>> = {
  [Difficulty.EASY]: {
    A: ["ANT|Tiny insect", "APPLE|Red fruit", "ARM|Body part", "AXE|Chops wood", "ART|Drawing and painting", "AIR|We breathe it", "ASH|From a fire", "ASK|Question", "ADD|Math plus", "AGE|How old you are"],
    B: ["BAT|Flying mammal", "BALL|Round toy", "BED|Sleep here", "BUS|School vehicle", "BOX|Cardboard container", "BIG|Not small", "BAG|Carries things", "BEE|Makes honey", "BOY|Young man", "BUG|Small insect"],
    C: ["CAT|Meowing pet", "CUP|Drink from it", "CAR|Drive this", "COW|Says moo", "CAP|Head hat", "CAN|Metal container", "COT|Small bed", "CRY|Shed tears", "CUT|Use scissors", "CUB|Baby bear"],
    D: ["DOG|Barking pet", "DAD|Father", "DAY|Sun is out", "DOT|Small point", "DIG|Hole in ground", "DEN|Animal home", "DRY|Not wet", "DIP|Chip sauce", "DUE|Expected time", "DIE|Number cube"],
    E: ["EGG|Chicken lays it", "EYE|See with this", "EAR|Hear with this", "EAT|Consume food", "END|Finish", "EEL|Snake-like fish", "ELK|Large deer", "ELF|Santa's helper", "EVE|Evening before", "EBB|Tide goes out"],
    F: ["FAN|Cooling device", "FOX|Sly animal", "FUN|Enjoyment", "FAT|Not thin", "FIT|Healthy", "FAR|Long distance", "FIG|Sweet fruit", "FLY|Airplane or insect", "FOG|Low cloud", "FIX|Repair"],
    G: ["GAS|Car fuel", "GET|Obtain", "GOD|Deity", "GUM|Chewy treat", "GUN|Weapon", "GAP|Space between", "GYM|Exercise place", "GUT|Stomach", "GEL|Hair product", "GEM|Precious stone"],
    H: ["HAT|Head wear", "HOT|High heat", "HUT|Small house", "HEN|Female chicken", "HOP|Jump on one foot", "HUG|Embrace", "HAM|Pork meat", "HAY|Horse food", "HIT|Strike", "HIP|Side of body"],
    I: ["ICE|Frozen water", "INK|Pen fluid", "ILL|Sick", "INN|Small hotel", "IVY|Climbing plant", "ICY|Slippery cold", "ION|Atom part", "IMP|Little rascal", "IRE|Anger", "INK|Tattoo fluid"],
    J: ["JAM|Fruit spread", "JAR|Glass container", "JET|Fast plane", "JOG|Slow run", "JAW|Mouth bone", "JOY|Happiness", "JAY|Blue bird", "JIG|Dance", "JOB|Work", "JUT|Stick out"],
    K: ["KEY|Unlocks door", "KID|Young child", "KIT|Set of tools", "KIN|Family", "KEG|Barrel", "KOI|Colorful fish", "KEN|Knowledge", "KIP|Nap", "KIT|Baby fox", "KEY|Music note"],
    L: ["LIP|Mouth part", "LEG|Walk with this", "LOG|Wood piece", "LOT|Many", "LID|Cover", "LAB|Science room", "LAP|Sit on knees", "LOW|Not high", "LAY|Put down", "LED|Guided"],
    M: ["MOM|Mother", "MAN|Adult male", "MAP|Guide", "MAT|Floor covering", "MUG|Coffee cup", "MOP|Clean floor", "MAD|Angry", "MIX|Stir together", "MUD|Wet dirt", "MEN|Plural of man"],
    N: ["NET|Catch fish", "NUT|Hard shell food", "NAP|Short sleep", "NOD|Head shake", "NEW|Not old", "NOW|Current time", "NIL|Zero", "NIP|Small bite", "NUN|Sister", "NET|Web"],
    O: ["OWL|Wise bird", "OLD|Aged", "ONE|Number 1", "OFF|Not on", "OIL|Slippery liquid", "OUT|Not in", "OAK|Acorn tree", "OAR|Boat paddle", "ORE|Rock mineral", "ODD|Strange"],
    P: ["PIG|Farm animal", "PEN|Write with this", "PAN|Cook with this", "PET|Animal friend", "POT|Cooking vessel", "PIN|Sharp needle", "POD|Pea casing", "POP|Soda", "PAD|Soft cushion", "PAY|Give money"],
    Q: ["QAT|Leafy plant", "QUE|Spanish what", "QUA|In the capacity of", "QIS|Life force", "QAT|Shrub", "QUA|As", "QUE|Letter Q", "QIS|Energies", "QAT|Plant", "QUE|What"], 
    R: ["RAT|Mouse cousin", "RED|Color", "RUN|Move fast", "RUG|Floor carpet", "ROW|Boat action", "RIB|Chest bone", "ROD|Stick", "ROT|Decay", "RUB|Massage", "RIM|Edge"],
    S: ["SUN|Sky star", "SIT|Use a chair", "SAD|Unhappy", "SAW|Cut wood", "SIX|Number 6", "SON|Male child", "SKY|Blue above", "SEA|Ocean", "SIP|Small drink", "SET|Ready"],
    T: ["TOP|Spinning toy", "TEN|Number 10", "TOY|Plaything", "TUB|Bath container", "TAG|Chase game", "TIP|End point", "TOE|Foot finger", "TAN|Sun color", "TEA|Hot drink", "TIE|Neck wear"],
    U: ["URN|Vase", "USE|Utilize", "UNO|One in Spanish", "UFO|Spaceship", "UPS|Deliveries", "URN|Ash holder", "USE|Employ", "UGH|Disgust sound", "UKE|Small guitar", "UMP|Referee"],
    V: ["VAN|Big car", "VET|Animal doctor", "VAT|Large tank", "VIE|Compete", "VOW|Promise", "VIM|Energy", "VAN|Vehicle", "VET|Doctor", "VAT|Tub", "VIA|By way of"],
    W: ["WEB|Spider home", "WET|Not dry", "WIG|Fake hair", "WAX|Candle material", "WIN|Victory", "WAY|Path", "WAR|Conflict", "WAG|Dog tail move", "WIT|Humor", "WOW|Amazement"],
    X: ["XRAY|Bone picture", "XMAS|Christmas", "XEN|Guest", "XIS|Greek letters", "XU|Vietnam money", "XRAY|Scan", "XIS|Letters", "XEN|Foreign", "XU|Coin", "XMAS|Holiday"], 
    Y: ["YAK|Hairy ox", "YES|Positive answer", "YOU|Yourself", "YAM|Sweet potato", "YET|So far", "YAP|Dog bark", "YIP|Puppy sound", "YEN|Japan money", "YEW|Tree type", "YEA|Yes vote"],
    Z: ["ZOO|Animal park", "ZIP|Close jacket", "ZAP|Electric sound", "ZAG|Zig opposite", "ZEN|Calm", "ZED|Letter Z", "ZIP|Fast", "ZOO|Animals", "ZAP|Strike", "ZIG|Zag partner"]
  },
  [Difficulty.MEDIUM]: {
    A: ["APPLE|Fruit", "ABOVE|Over", "ACTOR|Performer", "ADULT|Grown up", "AGREE|Say yes", "ALARM|Wake up sound", "ALBUM|Photo book", "ALIEN|Space being", "ALIKE|Similar", "ALIVE|Not dead"],
    B: ["BEACH|Sandy shore", "BREAD|Sandwich part", "BRAVE|Not scared", "BRICK|Building block", "BRUSH|Hair tool", "BENCH|Park seat", "BIRTH|Born day", "BLACK|Dark color", "BLAME|Fault", "BLANK|Empty"],
    C: ["CHAIR|Sit here", "CLASS|School room", "CLEAN|Not dirty", "CLOCK|Tells time", "CLOUD|White sky puff", "CLOWN|Circus funny", "COACH|Team leader", "COAST|By the sea", "COLOR|Red or Blue", "COUNT|1, 2, 3"],
    D: ["DANCE|Move to music", "DREAM|Sleep story", "DRINK|Thirst quencher", "DRIVE|Car action", "DRESS|Pretty clothes", "DAIRY|Milk food", "DANGER|Unsafe", "DARK|No light", "DATE|Calendar day", "DAILY|Every day"],
    E: ["EAGLE|Big bird", "EARLY|Not late", "EARTH|Our planet", "EIGHT|Number 8", "ELBOW|Arm joint", "EMPTY|Nothing inside", "ENEMY|Not friend", "ENJOY|Have fun", "ENTER|Go in", "EQUAL|Same"],
    F: ["FAIRY|Magical being", "FANCY|Elegant", "FIELD|Grass area", "FIGHT|Conflict", "FINAL|Last one", "FLAME|Fire part", "FLOAT|On water", "FLOOR|Walk on it", "FLOWER|Plant bloom", "FLUTE|Wind instrument"],
    G: ["GHOST|Spooky spirit", "GIANT|Very big", "GLASS|See through", "GLOVE|Hand warmer", "GRAPE|Purple fruit", "GRASS|Green lawn", "GREAT|Very good", "GREEN|Grass color", "GROUP|Many people", "GUARD|Protector"],
    H: ["HAPPY|Smile emotion", "HEART|Love symbol", "HEAVY|Not light", "HELLO|Greeting", "HOBBY|Fun activity", "HONEY|Bee food", "HORSE|Ride animal", "HOTEL|Travel stay", "HOUSE|Home", "HUMAN|Person"],
    I: ["IMAGE|Picture", "INDEX|List", "INNER|Inside", "INPUT|Data in", "ISSUE|Problem", "IRON|Metal", "IDEA|Thought", "IGLOO|Ice house", "ICING|Cake top", "ISLAND|Land in water"],
    J: ["JELLY|Toast spread", "JEWEL|Gemstone", "JOINT|Connection", "JUDGE|Court decider", "JUICE|Fruit drink", "JUMP|Hop high", "JUNGLE|Wild forest", "JUNIOR|Younger", "JOKER|Funny card", "JEANS|Blue pants"],
    K: ["KAYAK|Small boat", "KEBAB|Meat stick", "KNIFE|Cut tool", "KNOCK|Door sound", "KOALA|Bear animal", "KITE|Fly in wind", "KINGS|Rulers", "KNEES|Leg joints", "KNOWN|Famous", "KICK|Foot hit"],
    L: ["LAUGH|Funny sound", "LEMON|Sour fruit", "LIGHT|Not dark", "LUNCH|Midday meal", "LARGE|Big", "LATER|After", "LEARN|Study", "LEAVE|Go away", "LEVEL|Game stage", "LIMIT|Stop point"],
    M: ["MAGIC|Tricks", "MAJOR|Big", "MAKER|Creator", "MARCH|Walk together", "MATCH|Pair", "METAL|Hard material", "MODEL|Example", "MONEY|Cash", "MONTH|Calendar page", "MOUSE|Computer clicker"],
    N: ["NIGHT|Dark time", "NOISE|Loud sound", "NORTH|Compass direction", "NURSE|Doctor helper", "NEVER|Not ever", "NEWER|More fresh", "NICER|More kind", "NINJA|Silent fighter", "NOBLE|Royal", "NOVEL|Book"],
    O: ["OCEAN|Big sea", "OFFER|Give", "OFTEN|Many times", "ONION|Cry vegetable", "ORDER|Command", "OTHER|Different", "OUTER|Outside", "OWNER|Possessor", "OPERA|Singing play", "ORBIT|Circle around"],
    P: ["PAINT|Art color", "PAPER|Write on", "PARTY|Celebration", "PASTE|Glue", "PEACE|No war", "PHONE|Call device", "PHOTO|Picture", "PIANO|Music keys", "PILOT|Plane driver", "PIZZA|Cheesy pie"],
    Q: ["QUEEN|Royal lady", "QUACK|Duck sound", "QUIET|No noise", "QUICK|Fast", "QUILT|Warm blanket", "QUEST|Adventure", "QUOTE|Said words", "QUITS|Stops", "QUAKE|Shake", "QUERY|Question"],
    R: ["RADIO|Music box", "RAINY|Wet weather", "RAISE|Lift up", "REACH|Stretch", "READY|Prepared", "RELAX|Calm down", "RIGHT|Correct", "RIVER|Flowing water", "ROBOT|Machine man", "ROUND|Circle shape"],
    S: ["SCHOOL|Learn place", "SHEEP|Wool animal", "SHIRT|Upper clothes", "SHOES|Foot wear", "SLEEP|Rest", "SMILE|Happy face", "SNAKE|Long reptile", "SNOW|Cold flakes", "SOUND|Hear it", "SPACE|Stars place"],
    T: ["TABLE|Eat on it", "TASTE|Mouth sense", "TEACH|Give lesson", "TEETH|Mouth bones", "THANK|Say grateful", "TIGER|Striped cat", "TITLE|Name", "TOAST|Hot bread", "TOUCH|Feel", "TOWEL|Dry off"],
    U: ["UNCLE|Dad's brother", "UNDER|Below", "UNION|Together", "UNITE|Join", "UNTIL|Up to time", "UPPER|Higher", "UPSET|Sad or mad", "URBAN|City", "USAGE|How used", "USUAL|Normal"],
    V: ["VALUE|Worth", "VIDEO|Movie", "VIRUS|Sick bug", "VISIT|Go see", "VOICE|Speak sound", "VOTER|Chooser", "VAULT|Safe box", "VEGAN|No meat", "VENOM|Poison", "VIEWS|Sights"],
    W: ["WATCH|Time piece", "WATER|Liquid life", "WHEEL|Car part", "WHERE|Location", "WHITE|Snow color", "WHOLE|Complete", "WOMAN|Lady", "WORLD|Earth", "WRITE|Use pencil", "WRONG|Incorrect"],
    X: ["XENON|Gas element", "XEROX|Copy", "XYLEM|Plant part", "XRAYS|Bone scans", "XEBEC|Old ship", "XENON|Noble gas", "XEROX|Duplicate", "XYLYL|Chemistry", "XENOS|Stranger", "XRAYS|Medical"], 
    Y: ["YACHT|Fancy boat", "YARD|Grass lawn", "YEARN|Want badly", "YEAST|Bread riser", "YELLOW|Sun color", "YIELD|Give way", "YOUNG|Not old", "YOUTH|Kids", "YOYO|String toy", "YUMMY|Tasty"],
    Z: ["ZEBRA|Striped horse", "ZERO|Nothing", "ZONAL|Area", "ZONES|Areas", "ZOOMS|Goes fast", "ESTY|Spicy", "ZILCH|Zero", "ZINC|Metal", "ZOMBIE|Undead", "ZEAL|Energy"]
  },
  [Difficulty.HARD]: {
    A: ["ABSOLUTE|Total", "ACCIDENT|Mistake", "ACTIVITY|Doing things", "ACTUALLY|In fact", "ADDITION|Math plus", "ADVANCED|High level", "ADVISOR|Helper", "AIRPLANE|Flying machine", "ALPHABET|A to Z", "ALTHOUGH|Even though"],
    B: ["BACKPACK|School bag", "BACKWARD|Reverse", "BACTERIA|Tiny germs", "BALANCE|Steady", "BALLOON|Air bag", "BASEBALL|Bat game", "BASEMENT|Under house", "BEAUTIFUL|Pretty", "BEHAVIOR|Acting", "BIRTHDAY|Age day"],
    C: ["CALENDAR|Date book", "CAMPAIGN|Plan", "CAPACITY|Volume", "CAPTAIN|Leader", "CARRIAGE|Wagon", "CATEGORY|Group", "CEILING|Room top", "CEREMONY|Ritual", "CHAMPION|Winner", "CHARACTER|Person"],
    D: ["DAUGHTER|Girl child", "DAYLIGHT|Sun time", "DECEMBER|Last month", "DECISION|Choice", "DECREASE|Go down", "DELICATE|Fragile", "DELIVERY|Bring to", "DESCRIBE|Tell about", "DINOSAUR|Ancient lizard", "DISASTER|Bad event"],
    E: ["ELECTRIC|Power", "ELEPHANT|Trunk animal", "ELEVATOR|Lift", "EMOTION|Feeling", "EMPLOYEE|Worker", "ENGINEER|Builder", "ENORMOUS|Huge", "ENTRANCE|Door way", "ENVELOPE|Letter case", "EQUATION|Math sentence"],
    F: ["FAVORITE|Best liked", "FEBRUARY|Second month", "FESTIVAL|Party time", "FIREWORK|Sky boom", "FLAMINGO|Pink bird", "FLEXIBLE|Bendy", "FOOTBALL|Kicking game", "FOREHEAD|Face top", "FOREVER|Always", "FRIENDLY|Nice"],
    G: ["GARDENER|Plant keeper", "GATHERING|Meeting", "GENEROUS|Giving", "GEOGRAPHY|Map study", "GIRAFFE|Tall animal", "GLORIOUS|Amazing", "GRADUATE|Finish school", "GRATEFUL|Thankful", "GROCERY|Food store", "GUARDIAN|Protector"],
    H: ["HOSPITAL|Sick place", "HIMSELF|That man", "HISTORY|Past events", "HOLIDAY|Celebration", "HOMEWORK|School work", "HORRIBLE|Very bad", "HOSPITAL|Clinic", "HUMANITY|People", "HUMOROUS|Funny", "HUNDRED|100"],
    I: ["IDENTITY|Who you are", "IMAGINE|Dream up", "IMPROVE|Get better", "INCLUDE|Add in", "INDUSTRY|Business", "INFANT|Baby", "INSECT|Bug", "INSTRUMENT|Music tool", "INTERNET|Web", "INVENTOR|Creator"],
    J: ["JANUARY|First month", "JEALOUS|Envious", "JEWELRY|Gems", "JOURNEY|Trip", "JUDGMENT|Decision", "JUNCTION|Crossing", "JUVENILE|Young", "JUMPING|Leaping", "JACKPOT|Big win", "JELLYFISH|Sea blob"],
    K: ["KANGAROO|Hop animal", "KEYBOARD|Type keys", "KITCHEN|Cook room", "KNOCKING|Door tap", "KNOWLEDGE|Smarts", "KINGDOM|Royal land", "KNIGHT|Armor man", "KNITTING|Yarn work", "KIDNAPPED|Taken", "KILOGRAM|Weight"],
    L: ["LANGUAGE|Speech", "LAUGHTER|Ha ha", "LEARNING|Studying", "LEMONADE|Sour drink", "LOCATION|Place", "LUGGAGE|Suitcases", "LUNCHEON|Meal", "LANDSCAPE|Scenery", "LATITUDE|Map line", "LIBRARY|Book house"],
    M: ["MACHINE|Device", "MAGAZINE|Thin book", "MAJORITY|Most", "MANAGER|Boss", "MARRIAGE|Wedding", "MATERIAL|Fabric", "MECHANIC|Car fixer", "MEDICINE|Pill", "MEMORIAL|Statue", "MIDNIGHT|12 AM"],
    N: ["NATIONAL|Country wide", "NEGATIVE|Minus", "NEIGHBOR|Next door", "NINETEEN|19", "NORTHERN|Up map", "NOTEBOOK|Paper pad", "NOVEMBER|Month 11", "NUMEROUS|Many", "NUTRITION|Food health", "NAVIGATE|Steer"],
    O: ["OBEDIENT|Listening", "OBSTACLE|Blocker", "OCCASION|Event", "OFFICIAL|Formal", "OLYMPIC|Sports", "OPERATOR|Worker", "OPINION|Thought", "OPPOSITE|Reverse", "ORDINARY|Normal", "ORIGINAL|First one"],
    P: ["PAINTING|Art", "PARADISE|Perfect place", "PARALLEL|Side by side", "PATIENT|Waiting", "PAVEMENT|Sidewalk", "PEACEFUL|Calm", "PELICAN|Big bird", "PENGUIN|Ice bird", "PERSONAL|Private", "PHYSICAL|Body"],
    Q: ["QUANTITY|Amount", "QUARTER|One fourth", "QUESTION|Ask", "QUICKLY|Fast", "QUIETLY|Softly", "QUOTIENT|Math answer", "QUALITY|Goodness", "QUALIFY|Pass test", "QUARREL|Fight", "QUARTET|Group of 4"],
    R: ["RAILROAD|Train track", "REACTION|Response", "RECEIVED|Got it", "RECOVERY|Getting well", "REGION|Area", "RELATION|Family", "RELATIVE|Kin", "REMEMBER|Don't forget", "REMOVAL|Taking away", "REPTILE|Lizard"],
    S: ["SANDWICH|Lunch food", "SATURDAY|Weekend day", "SCISSORS|Cutters", "SCRIBBLE|Messy write", "SECURITY|Safety", "SENTENCE|Words line", "SEPARATE|Apart", "SHOULDER|Arm joint", "SKELETON|Bones", "SOLUTION|Answer"],
    T: ["TEACHER|School leader", "TEENAGER|Young adult", "TELEPHONE|Call device", "TELESCOPE|Star looker", "TERRIBLE|Bad", "THEATER|Movie place", "THOUSAND|1000", "THURSDAY|Weekday", "TOGETHER|With", "TOMORROW|Next day"],
    U: ["UMBRELLA|Rain shield", "UNIVERSE|Space", "UNLIKELY|Not probable", "UNUSUAL|Strange", "UPGRADE|Improve", "UPSTAIRS|Higher floor", "USERNAME|Login ID", "UTENSIL|Fork spoon", "ULTIMATE|Best", "UNDERWEAR|Clothes"],
    V: ["VACATION|Holiday", "VALUABLE|Worth much", "VEGETABLE|Healthy food", "VEHICLE|Car truck", "VERTICAL|Up down", "VICTORY|Win", "VILLAGE|Small town", "VIOLENCE|Fighting", "VISITOR|Guest", "VOLCANO|Lava mountain"],
    W: ["WATERMELON|Big fruit", "WEATHER|Sun rain", "WEDDING|Marriage", "WEDNESDAY|Hump day", "WHATEVER|Anything", "WHISPER|Soft talk", "WINDMILL|Air power", "WIRELESS|No cords", "WONDERFUL|Great", "WRESTLE|Fight sport"],
    X: ["XYLOPHONE|Music toy", "XMAS|Christmas", "XENOPHOBIA|Fear strangers", "XEROGRAPHY|Copying", "XYLOGRAPHY|Wood carving", "XIPHOID|Bone part", "XENON|Noble gas", "XENIAL|Friendly", "XRAY|Scan", "XMAS|Holiday"], 
    Y: ["YESTERDAY|Day before", "YOUNGSTER|Kid", "YOURSELF|You", "YOUTHFUL|Young", "YEARBOOK|School book", "YELLOWISH|Like lemon", "YIELDING|Giving", "YOGHURT|Milk snack", "YOUTUBE|Video site", "YUULETIDE|Christmas"],
    Z: ["ZEPPELIN|Airship", "ZOOLOGY|Animal science", "ZUCCHINI|Green veg", "ZIGZAGGED|Winding", "ZILLION|Huge number", "ZIPCODE|Mail code", "ZOOKEEPER|Animal boss", "ZONE|Area", "ZERO|None", "ZEALOUS|Eager"]
  }
};

// --- Custom Word Management ---

export const getCustomWords = (): CustomWord[] => {
  try {
    const stored = localStorage.getItem(CUSTOM_WORDS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Failed to load custom words", e);
    return [];
  }
};

export const addCustomWord = (word: string, hint: string, difficulty: Difficulty) => {
  const words = getCustomWords();
  const newWord: CustomWord = {
    id: Date.now().toString(),
    word: word.toUpperCase().trim(),
    hint: hint.trim(),
    difficulty
  };
  localStorage.setItem(CUSTOM_WORDS_KEY, JSON.stringify([...words, newWord]));
  return newWord;
};

export const deleteCustomWord = (id: string) => {
  const words = getCustomWords();
  const filtered = words.filter(w => w.id !== id);
  localStorage.setItem(CUSTOM_WORDS_KEY, JSON.stringify(filtered));
};

export const getCustomVictoryMessage = (): string => {
  return localStorage.getItem(CUSTOM_VICTORY_MESSAGE_KEY) || "Well done! You are amazing!";
};

export const setCustomVictoryMessage = (message: string) => {
  localStorage.setItem(CUSTOM_VICTORY_MESSAGE_KEY, message);
};

// --- Generation Logic ---

export const generateWordList = async (difficulty: Difficulty, letter: string | null = null): Promise<SpellingWord[]> => {
  const difficultyData = RAW_DATA[difficulty];
  let pool: SpellingWord[] = [];

  // 1. Get Built-in Words
  if (letter && letter !== 'ALL') {
    // Get words for specific letter
    const rawStrings = difficultyData[letter] || [];
    pool = rawStrings.map(expand);
  } else {
    // Get words from all letters
    Object.values(difficultyData).forEach(rawStrings => {
      pool = [...pool, ...rawStrings.map(expand)];
    });
  }

  // 2. Get Custom Words
  const customWords = getCustomWords().filter(w => {
    // Filter by difficulty
    if (w.difficulty !== difficulty) return false;
    // Filter by letter
    if (letter && letter !== 'ALL' && w.word[0] !== letter) return false;
    return true;
  });

  // 3. Combine
  const fullPool = [...pool, ...customWords];

  // 4. Shuffle array using Fisher-Yates algorithm
  const shuffled = [...fullPool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // 5. Return top 5 words
  return shuffled.slice(0, 5);
};

export const generateCustomGameWords = (): SpellingWord[] => {
  const customWords = getCustomWords();
  
  if (customWords.length === 0) return [];

  // Shuffle
  const shuffled = [...customWords];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  // Return top 10 custom words for the game session
  return shuffled.slice(0, 10);
};